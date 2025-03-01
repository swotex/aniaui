import fs from "fs/promises"
import path from "path"
import { getFileNames } from "./getFileNames"

// Function to extract class names from CSS content
const extractClassNames = async (cssContent) => {
  const classRegex =
    /\.([a-zA-Z_-][a-zA-Z0-9_-]*)(?=\s*[\{,:\(])|:where\(\.([a-zA-Z_-][a-zA-Z0-9_-]*)\)/g
  const matches = cssContent.match(classRegex)
  const classNames = matches
    ? matches.map((match) => {
        const cleanedMatch = match.replace(/:where\(\.|[\{,:\(\)]/g, "").trim()
        return cleanedMatch.startsWith(".") ? cleanedMatch.slice(1) : cleanedMatch
      })
    : []
  return [...new Set(classNames)] // Remove duplicates
}


const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Function to read if file already exist and merge both
const updateFile = async (path, classNames) => {
  let fileContent;
  if (await fileExists(path))
  {
    fileContent = await fs.readFile(path, "utf8");
    fileContent = JSON.parse(fileContent);
    if (Array.isArray(fileContent))
      fileContent = [...new Set([...fileContent, ...classNames])];
    else
      fileContent = classNames;
  }
  else
    fileContent = classNames;

  fileContent = JSON.stringify(fileContent, null, 2)
  await fs.writeFile(path, fileContent)
}

// Function to process a single CSS file
const processCssFile = async (srcDir, filePath) => {
  try {
    const cssContent = await fs.readFile(filePath, "utf8")
    const classNames = await extractClassNames(cssContent)

    const fileName = path.basename(filePath, ".css").split(".")[0]
    const outputDir = path.join(import.meta.dirname, "..", srcDir, fileName)
    const outputFilePath = path.join(outputDir, "class.json")

    // Create directory if it doesn't exist
    try {
      await fs.mkdir(outputDir, { recursive: true })
    } catch (err) {
      if (err.code !== "EEXIST") throw err
    }

    await updateFile(outputFilePath, classNames)

    return classNames.length
  } catch (error) {
    throw new Error(`Error processing file ${filePath}: ${error.message}`)
  }
}

// Function to process all CSS files
export const extractClasses = async ({ srcDir }) => {
  try {
    // Read all CSS files from the styles directory
    const stylesDir = path.join(import.meta.dirname, "..", "src", srcDir)
    const cssFiles = await fs.readdir(stylesDir, {recursive: true})
    const filteredCssFiles = cssFiles.filter((file) => file.endsWith(".css"))

    if (filteredCssFiles.length === 0) {
      throw new Error("No CSS files found in the specified directory")
    }

    const justFile = filteredCssFiles.filter(file => !file.includes('/'));
    let subDirFile = filteredCssFiles.filter(file => file.includes('/'));

    subDirFile = subDirFile.reduce((groups, file) => {
      const folder = file.split('/')[0];

      if (!groups[folder]) {
        groups[folder] = [];
      }
      groups[folder].push(file);
    
      return groups;
    }, {});

    subDirFile = Object.values(subDirFile);

    // Create async create orphan file
    const classNameCounts = await Promise.all(
      justFile.map(async (file) => {
        const filePath = path.join(stylesDir, file)
        return await processCssFile(srcDir, filePath)
      }),
    )

    const classNameCountsGroup = await Promise.all(
      subDirFile.map(async (fileGroup) => {
        let nbItems = 0;
        for (const file of fileGroup){
          const filePath = path.join(stylesDir, file)
          nbItems += await processCssFile(srcDir, filePath)
        }
        return nbItems;
      }),
    )

    let totalClassNames = classNameCounts.reduce((total, count) => total + count, 0)
    totalClassNames += classNameCountsGroup.reduce((total, count) => total + count, 0)

    return totalClassNames
  } catch (error) {
    throw new Error(`Error extracting classes: ${error.message}`)
  }
}