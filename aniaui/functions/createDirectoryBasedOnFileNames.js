import { promises as fs } from "node:fs"
import path from "node:path"

export const createDirectoryBasedOnFileNames = async (fileName, fileExtension, distDir) => {
  const componentName = path.basename(fileName, fileExtension)
  const componentDir = path.join(distDir, componentName)
  await fs.mkdir(componentDir, { recursive: true })
  return componentDir
}

export const createDirectoryBasedOnFileNamesComponent = async (fileDir, fileExtension, srcDir, distDir) => {
  const relativePath = path.relative(srcDir, fileDir);
  const parsedPath = path.parse(relativePath);
  const parts = parsedPath.dir.split(path.sep).filter(Boolean);
  let componentDir;
  if (parts.length === 0)
    componentDir = parsedPath.name;
  else
    componentDir = parts.join(path.sep);

  componentDir = path.join(distDir, componentDir)
  await fs.mkdir(componentDir, { recursive: true })

  return componentDir
}