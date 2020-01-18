import { renderFile } from "pug";

import { dirname } from "path";
import { writeFileSync, mkdirSync } from "fs";
import { html as beautifyHtml } from "js-beautify";

const isProduction = process.env.NODE_ENV === "production";

export const makeBundle = (options) => {
  return {
    name: "makeBundle",
    generateBundle(outputOptions, bundle) {
      var js = "", css = "";
      
      const bundleEntries = Object.entries(bundle);
      for (const [key, value] of bundleEntries) {
        if (key.endsWith("js")) {
          js += value.code;
        } else if (key.endsWith("css")) {
          css += value.source;
        }
        delete bundle[key]
      }
      
      var html = renderFile(options.template, {
        ...options,
        css, js
      });
      
      if (!isProduction || 1) {
        html = beautifyHtml(html, { 
          indent_size: 2, 
          space_in_empty_paren: true 
        });
      }
      
      mkdirSync(dirname(options.outputPath), { 
        recursive: true 
      });
      
      writeFileSync(options.outputPath, html);
    }
  };
};