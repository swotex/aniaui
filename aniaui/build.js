import { generateThemesObject } from "./functions/generateThemesObject.js"
import { generateThemeFiles } from "./functions/generateThemeFiles.js"
import { generateColorRules } from "./functions/generateColorRules.js"
import { generateRawStyles } from "./functions/generateRawStyles.js"
import { minify, minifyCssInDirectory } from "./functions/minify.js"
import { generatePlugins, generatePluginComponent } from "./functions/generatePlugins.js"
import { generateImports } from "./functions/generateImports.js"
import { extractClasses } from "./functions/extractClasses.js"
import { generateThemes } from "./functions/generateThemes.js"
import { generateChunks } from "./functions/generateChunks.js"
import { removeFiles } from "./functions/removeFiles.js"
import { copyFile } from "./functions/copyFile.js"
import { packCss } from "./functions/packCss.js"
import { report } from "./functions/report.js"
import { version } from "../package.json"

const isDev = process.argv.includes("--dev")

async function generateFiles() {
  await Promise.all([
    copyFile("./functions/themePlugin.js", "./theme/themePlugin.js", "index.js"),
    !isDev &&
      generateColorRules({
        distDir: "../colors",
        styles: ["bg", "text", "border"],
        breakpoints: ["sm", "md", "lg", "xl", "2xl"],
        states: ["hover"],
      }),
    !isDev && generateThemeFiles({ srcDir: "src/themes", distDir: "theme" }),
    !isDev && generateRawStyles({ srcDir: "../src/base", distDir: "../base", layer: "base" }),
    !isDev &&
      generateRawStyles({
        srcDir: "../src/components",
        distDir: "../components",
        responsive: true,
        exclude: [
          "calendar",
          "countdown",
          "loading",
          "filter",
          "mask",
          "mockup",
          "skeleton",
          "swap",
          "validator",
        ],
        layer: "utilities",
      }),
    !isDev &&
      generateRawStyles({
        srcDir: "../src/utilities",
        distDir: "../utilities",
        responsive: true,
        exclude: ["typography", "glass", "join"],
        layer: "utilities",
      }),
    generatePlugins({ type: "base", srcDir: "src/themes", distDir: "theme" }),
    generatePlugins({ type: "base", srcDir: "src/base", distDir: "base", exclude: ["reset"] }),
    generatePluginComponent({ type: "component", srcDir: "src/components", distDir: "components" }),
    generatePlugins({ type: "utility", srcDir: "src/utilities", distDir: "utilities" }),
  ])
  await Promise.all([
    generateImports("imports.js"),
    !isDev && generateChunks("chunks.css"),
    !isDev && packCss("aniaui.css", []),
    !isDev && generateThemes("themes.css"),
    generateThemesObject("./theme/object.js"),
  ])
  await Promise.all([
    extractClasses({ srcDir: "components" }),
    !isDev && minifyCssInDirectory(["colors", "base", "components", "utilities"]),
    !isDev && minify("themes.css"),
    !isDev && minify("aniaui.css"),
  ])
}

async function build() {
  try {
    !isDev &&
      (await removeFiles([
        "base",
        "colors",
        "components",
        "theme",
        "utilities",
        "chunks.css",
        "aniaui.css",
        "imports.js",
        "themes.css",
      ]))
    console.time(`${decodeURIComponent("%F0%9F%90%BC")} ${"AniaUI"} ${version}`)
    await generateFiles()
    console.timeEnd(`${decodeURIComponent("%F0%9F%90%BC")} ${"AniaUI"} ${version}`)
    !isDev &&
      (await report([
        "base",
        "components",
        "utilities",
        "colors",
        "chunks.css",
        "themes.css",
        "aniaui.css",
      ]))
  } catch (error) {
    throw new Error("Build error: " + error.message)
  }
}

build()