import { promises as fs } from "fs"
import path from "path"

export const getFileNames = async (dir, extension, recursive = true) => {
  let fileNames = []
  const files = await fs.readdir(dir, { withFileTypes: true })

  for (const file of files) {
    const filePath = path.join(dir, file.name)

    // console.log("File name : ", file.name, " is dir ", file.isDirectory(), " end by css ", file.name.endsWith(extension))

    if (file.isDirectory() && recursive) {
      const subDirFiles = await getFileNames(filePath, extension, recursive)
      fileNames = fileNames.concat(subDirFiles)
    } else if (file.isFile() && file.name.endsWith(extension)) {
      // Extract the file name without extension
      const fileName = path.basename(file.name, extension)
      fileNames.push(fileName)
    }
  }

  return fileNames
}

export const getFileNamesDir = async (dir, extension, recursive = true) => {
  let fileNames = []
  const files = await fs.readdir(dir, { withFileTypes: true })

  for (const file of files) {
    const filePath = path.join(dir, file.name)

    // console.log("File name : ", file.name, " is dir ", file.isDirectory(), " end by css ", file.name.endsWith(extension))

    if (file.isDirectory() && recursive) {
      const subDirFiles = await getFileNamesDir(filePath, extension, recursive)
      fileNames = fileNames.concat(subDirFiles)
    } else if (file.isFile() && file.name.endsWith(extension)) {
      // Extract the file name without extension
      const fileName = path.basename(file.name, extension)
      fileNames.push({'name': fileName, 'path': filePath})
    }
  }

  return fileNames
}