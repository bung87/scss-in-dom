// @ts-nocheck
import { createFilter } from 'rollup-pluginutils';
import { walk, Node } from 'estree-walker';
import sid from './index'
import MagicString from 'magic-string';
import path from 'path';
import { Plugin } from 'rollup';
import pkg from '../package.json'


export default function (options: { include?: any, exclude?: any, sourceMap?: boolean } = { include: ["*.js"] }): Plugin {
  const sourceMap = options.sourceMap !== false;
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'scss-in-dom',

    transform(code, id) {

      if (!filter(id)) { return; }
      const ast = this.parse(code, null);
      const imports = new Set();
      ast.body.forEach((node) => {
        if (node.type === 'ImportDeclaration') {
          node.specifiers.forEach((specifier) => {
            imports.add(specifier.local.name);
          });
        }
      });
      console.log(imports)

      const mainPath = path.normalize(path.resolve(path.join(__dirname,"..")))
      console.log(mainPath)
      let mainFunc
      const usages: Node[] = []
      const args: Node[] = []
      const values: Node[] = []
      var lib: Node
      // @ts-ignore
      walk(ast, {
        enter(node) {
          if (node.type == "VariableDeclarator" && node.init.type == "CallExpression" && node.init.callee.name == "require") {
            const res = require.resolve(node.init.arguments[0].value)
            if (res.indexOf(mainPath) === 0) {
              mainFunc = node.id.name
              lib = ast.body.filter(x => {
                return x.type === "VariableDeclaration" && x.declarations.filter(y => {
                  const a = y as unknown as Node
                  return a.start === node.start && a.end === node.end
                })
              })[0] as Node
              this.skip()
            }
          } else if (node.type === "CallExpression" && node.callee.name == mainFunc) {
            usages.push(node)
            args.push(...node.arguments)
          }
        },
      });
      // @ts-ignore
      walk(ast, {
        enter(node) {
          if (node.type === 'VariableDeclarator' && args.filter(x => node.id.name == x.name).length > 0) {
            if (node.init.type === "Literal") {
              values.push(node.init)
            } else if (node.init.type === "TemplateLiteral") {
              values.push(node.init.quasis[0])
            }
          }
        },
      });
      const magicString = new MagicString(code);
      const outs: string[] = []
      values.forEach((v, i) => {
        // tslint:disable-next-line: one-variable-per-declaration
        let thecode: string = "";
        let out: string = "";
        // let out 
        if (v.type == "TemplateElement") {
          thecode = v.value.cooked;
          out = JSON.stringify(sid(thecode))
        } else if (v.type == "Literal") {
          thecode = v.value
          out = JSON.stringify(sid(v.value))
        }
        outs.push(out)

      })
      usages.forEach((v, i) => {
        magicString.overwrite(v.start, v.end, outs[i]);

      })
      if (typeof lib !== "undefined") {
        magicString.remove(lib.start, lib.end);
      }

      const map = sourceMap ? magicString.generateMap() : null;
      return { code: magicString.toString(), map };
    }
  };
}
