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
  const indexJsContent = `import ${fileName} from './${objName}';
import { addPrefix } from '../../functions/addPrefix.js';

export default ({ ${types[type]}, prefix = '', style = 'basic' }) => {
  const prefixed${fileName} = addPrefix(${fileName}, prefix);
  ${types[type]}({ ...prefixed${fileName} });
};
`
  await fs.writeFile(indexJsPath, indexJsContent)
}