"use strict";

const PLUGIN_NAME = "templates";

const through = require("through2");
const { src, dest, series, parallel } = require("gulp");
var PluginError = require("plugin-error");

const camelCase = require("camelcase");
const { join, dirname, parse } = require("path");

const beautify = require("js-beautify").js;


//
//

const plugin = () => {
  return through.obj((file, enc, cb) => {
    const fileName = parse(file.path).name;
    const capitalizedTypeName = camelCase(fileName, { pascalCase: true });
    const typeName = camelCase(fileName, { pascalCase: false });
    
    file.path = join(dirname(file.path), fileName + ".ts");

    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, "Stream not supported!");
    }
  
    if (file.isBuffer()) {
      const types = JSON.parse(file.contents);

      let enumFields = "", decls = "";
      let typeToTagMapFields = "",
          tagToTypeMapFields = "",
          typeToDisplayNameMapFields = "",
          displayNameToTypeMapFields = "";
      let firstElement = true;

      const chars = "abcdefghijklmnopqrstuvwxyz";
      const base = (num) => {
        var ret = "", base = chars.length;
        num++;
        do {
            num--;
            ret += chars[num % base];
            num = Math.floor(num / base);
        } while (num > 0);
        return ret;
      };
      let vname = 0;

      for (let i in types) {
          const type = types[i];
          const capitalizedFieldName = camelCase(type.displayName, { pascalCase: true });
          const fieldName = camelCase(type.displayName, { pascalCase: false });
          
          if (!firstElement) {
            enumFields += ",\n";
          }
            
          enumFields += ` ${capitalizedFieldName} = ${i}`;
          
          if (!firstElement) {
            decls += "\n";
          }
          
          const displayNameVarName = base(vname++),
                tagVarName = base(vname++);
          
          decls += `const ${displayNameVarName}: string = "${type.displayName}";
const ${tagVarName}: string = "${type.tag}";`;

          if (!firstElement) {
            typeToTagMapFields += ",\n";
            tagToTypeMapFields += ",\n";
            typeToDisplayNameMapFields += ",\n";
            displayNameToTypeMapFields += ",\n";
          }

          typeToTagMapFields += `  [${capitalizedTypeName}.${capitalizedFieldName}]: ${tagVarName}`;
          tagToTypeMapFields += `  [${tagVarName}]: ${capitalizedTypeName}.${capitalizedFieldName}`;
          typeToDisplayNameMapFields += `  [${capitalizedTypeName}.${capitalizedFieldName}]: ${displayNameVarName}`;
          displayNameToTypeMapFields += `  [${displayNameVarName}]: ${capitalizedTypeName}.${capitalizedFieldName}`;
          
          firstElement = false;
      }

      let code = `export const enum ${capitalizedTypeName} { // number defines order
${enumFields}
}

export type ${capitalizedTypeName}Map<T> = {
  [P in ${capitalizedTypeName}]: T;
};

export type Inverse${capitalizedTypeName}Map = {
  [key: string]: ${capitalizedTypeName};
};

${decls}

export const ${typeName}ToTagMap: ${capitalizedTypeName}Map<string> = {
${typeToTagMapFields}
};

export const tagTo${capitalizedTypeName}Map: Inverse${capitalizedTypeName}Map = {
${tagToTypeMapFields}
};

export const ${typeName}ToDisplayNameMap: ${capitalizedTypeName}Map<string> = {
${typeToDisplayNameMapFields}
};

export const displayNameTo${capitalizedTypeName}Map: Inverse${capitalizedTypeName}Map = {
${displayNameToTypeMapFields}
};

`;
      code = beautify(code, { 
        indent_size: 2, 
        space_in_empty_paren: true 
      });

      file.contents = Buffer.from(code);
    }

    cb(null, file);
  });
};

const enums = (cb) => {
  src("./src/json/**/*.json")
    .pipe(plugin())
    .pipe(dest("./generated/ts/model"));
  cb();
};

module.exports = enums;
