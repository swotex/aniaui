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

  export default ({ addComponents, prefix = '', style = 'basic' }) => {
    let objBase = null;
    let objStyle = null;
    if (fs.existsSync(path.resolve(__dirname, "./object.js")))
    {
      objBase = require("./object.js");
      objBase = objBase.default || objBase;
    }
    for (const st of styles)
    {
      const filePath = path.resolve(__dirname, st.file);
      if (st.name === style && fs.existsSync(filePath))
      {
        objStyle = require(st.file);
        objStyle = objStyle.default || objStyle;
      }
    }
    if(objBase != null && objStyle != null)
    {
      let mergedStyles = { ...objBase };

      for (const [key, value] of Object.entries(objStyle)) {
        mergedStyles[key] = { ...(mergedStyles[key] || {}), ...value };
      }
      const prefixedobj = addPrefix(mergedStyles, prefix);
      addComponents({ ...prefixedobj });
    }
    else if(objBase != null)
    {
      const prefixedobj = addPrefix(objBase, prefix);
      addComponents({ ...prefixedobj });
    }
    else if(objStyle != null)
    {
      const prefixedobj = addPrefix(objStyle, prefix);
      addComponents({ ...prefixedobj });
    }
  };
  `

  await fs.writeFile(indexJsPath, indexJsContent)
}
