import fs from "fs/promises"
import { getFileNames, getFileNamesDir } from "./getFileNames.js"
import { cssToJs } from "./cssToJs.js"
import { createDirectoryBasedOnFileNames, createDirectoryBasedOnFileNamesComponent } from "./createDirectoryBasedOnFileNames.js"
import { createPluginFiles, createPluginFilesComponent } from "./createPluginFiles.js"

export const generatePlugins = async ({ type, srcDir, distDir, exclude = [] }) => {
  await fs.mkdir(distDir, { recursive: true })
  const cssFiles = await getFileNames(srcDir, ".css")
  const filteredCssFiles = cssFiles.filter((file) => !exclude.includes(file))

  await Promise.all(
    filteredCssFiles.map(async (cssFile) => {
      const [jsContent, componentDir] = await Promise.all([
        cssToJs(`${srcDir}/${cssFile}.css`),
        createDirectoryBasedOnFileNames(cssFile, ".css", distDir),
      ])

      await createPluginFiles(type, componentDir, jsContent, cssFile)
    }),
  )
}

export const generatePluginComponent = async ({ type, srcDir, distDir, exclude = [] }) => {
  await fs.mkdir(distDir, { recursive: true })
  const cssFiles = await getFileNamesDir(srcDir, ".css")
  const filteredCssFiles = cssFiles.filter((file) => !exclude.includes(file.name))

  await Promise.all(
    filteredCssFiles.map(async (cssFile) => {
      const [jsContent, componentDir] = await Promise.all([
        // cssToJs(`${srcDir}/${cssFile}.css`),
        cssToJs(cssFile.path),
        // createDirectoryBasedOnFileNames(cssFile.name, ".css", distDir),
        createDirectoryBasedOnFileNamesComponent(cssFile.path, ".css", srcDir, distDir),
      ])
      await createPluginFilesComponent(type, componentDir, jsContent, cssFile.name)
    }),
  )
}