"use strict";

const PLUGIN_NAME = "templates";

const through = require("through2");
const { src, dest, series, parallel } = require("gulp");
var PluginError = require("plugin-error");

const { dirname, relative, join, basename, extname } = require("path");

const camelCase = require("camelcase");

const { render } = require("pug");
const { decode } = require("ent");
const { Parser } = require("htmlparser2");
const beautify = require("js-beautify").js;

class Element {
  constructor(parent = undefined) {
    this.parent = parent;
    
    this.children = [];
  }
  
  appendToString(string) {
    this.children.push(string);
  }
  
  toString() {
    let string = "";
    let needsComma = false;
    for (let child of this.children) {
      if (needsComma) {
        string += ",";
      }
      
      string += child;
      needsComma = true;
    }
    return string;
  }
}

const plugin = () => {
  return through.obj((file, enc, cb) => {
    const templateName = basename(file.path, extname(file.path));
    const className = camelCase(templateName, { pascalCase: true }) + "Template";
    
    file.path = join(dirname(file.path), templateName + ".ts");
    
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, "Stream not supported!");
    }
  
    if (file.isBuffer()) {
      const contents = String(file.contents);

      const html = render(contents).trim();
    
      let refdElements = "";
    
      const rootElement = new Element();
      let currentElement = rootElement;
      let elementStack = [];
      const parser = new Parser({
        onopentag: (name, attrs) => {
            currentElement = new Element(currentElement);
            currentElement.name = name;
            currentElement.attrs = attrs;
        },
        ontext: (text) => {
          const string = JSON.stringify(decode(text));
          currentElement.appendToString(`t(${string})`);
        },
        oncomment: (text) => {
          currentElement.string += `/* ${text} */`; 
        },
        onclosetag: (tagname) => {
          const elementNameString = JSON.stringify(currentElement.name);
    
          let elementRefString = "undefined";
          let elementAttrsElement = new Element();
    
          for (let key in currentElement.attrs) {
            let value = currentElement.attrs[key];
            if (key === "ref") {
              elementRefString = value;
            } else {
              elementAttrsElement.appendToString(`new Attribute(${JSON.stringify(key)}, ${JSON.stringify(value)})`);
            }
          }
    
          const elementAttrsString = `[${elementAttrsElement.toString()}]`;
    
          const elementContent = currentElement.toString();
    
          // pop tree
          currentElement = currentElement.parent;
    
          const string = `h(${elementNameString}, ${elementAttrsString}, [${elementContent}])`;
    
          if (elementRefString !== "undefined") {
            refdElements += ` public ${elementRefString}: HTMLElement = ${string};`;
            currentElement.appendToString(`this.${elementRefString}`);
          } else {
            currentElement.appendToString(string);
          }
        }
      }, {
        decodeEntities: true, 
        xmlMode: true
      });
      parser.write(html);
      parser.end();
    
      let appendChildrenString = "";
    
      let once = true;
      for (let child of rootElement.children) {
        if (!once) {
          appendChildrenString += "\n";
        }
        appendChildrenString += `      parent.appendChild(${child});`;
        once = false;
      }
    
      const func = `class ${className} extends ViewBase {
${refdElements}

constructor(parent: HTMLElement) {
  super(parent);

  const appendChildren = () => {
${appendChildrenString}
  };

  this.queue.push(appendChildren);
}

public loop() {
  super.loop();
}
}`;
    
      let code = `import { Attribute, h, t } from "view/render";
import { ViewBase } from "view/base";
export default ${func}`;
    
      code = beautify(code, { 
        indent_size: 2, 
        space_in_empty_paren: true 
      });
      
      file.contents = Buffer.from(code);
    }
    
    cb(null, file);
  });
};

const templates = (cb) => {
  src("./src/pug/**/*.pug")
    .pipe(plugin())
    .pipe(dest("./generated/ts/view/template"));
  cb();
};

module.exports = templates;
