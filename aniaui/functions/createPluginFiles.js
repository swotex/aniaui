import { promises as fs } from "fs"
import path from "path"

export const createPluginFiles = async (type, componentDir, jsContent, fileName) => {
  const types = {
    base: "addBase",
    component: "addComponents",
    utility: "addUtilities",
  }

  // create object.js
  const objectJsPath = path.join(componentDir, "object.js")
  await fs.writeFile(objectJsPath, `export default ${jsContent};`)

  // create index.js
  const indexJsPath = path.join(componentDir, "index.js")
  const indexJsContent = `import ${fileName} from './object.js';
import { addPrefix } from '../../functions/addPrefix.js';

export default ({ ${types[type]}, prefix = '' }) => {
  const prefixed${fileName} = addPrefix(${fileName}, prefix);
  ${types[type]}({ ...prefixed${fileName} });
};
`
  await fs.writeFile(indexJsPath, indexJsContent)
}

export const createPluginFilesComponent = async (type, componentDir, jsContent, fileName) => {
  const types = {
    base: "addBase",
    component: "addComponents",
    utility: "addUtilities",
  }

  // create object.js
  const parts = fileName.split('.');
  let objName = "object.js";
  if (parts.length > 1)
    objName = `object.${parts.slice(1).join('.')}.js`;

  const objectJsPath = path.join(componentDir, objName)
  await fs.writeFile(objectJsPath, `export default ${jsContent};`)


  // create index.js
  const indexJsPath = path.join(componentDir, "index.js")
  const indexJsContent = `
    const fs = require("fs");
    const path = require("path");
    import { addPrefix } from '../../functions/addPrefix.js';
    import styles from '../../functions/styleList.json';

    // const styles = [
    //   {'name': "basic", 'file': "./object.js"},
    //   {'name': "neumorphism", 'file': "./object.neu.js"},
    //   {'name': "old", 'file': "./object.old.js"},
    // ];

    export default ({ addComponents, prefix = '', style = 'basic' }) => {
      for (const st of styles)
      {
        const filePath = path.resolve(__dirname, st.file);
        if (st.name === style && fs.existsSync(filePath))
        {
          let obj = require(st.file);
          obj = obj.default || obj
          const prefixedobj = addPrefix(obj, prefix);
          addComponents({ ...prefixedobj });
        }
      }
    };
  `

  await fs.writeFile(indexJsPath, indexJsContent)
}
