import { getInput } from "@actions/core";

export const url = getInput("url");
export const name = getInput("name");
export const pagesFile = getInput("pages_file");
export const outputDir = getInput("output");

// Optional Inputs
export const width = Number.parseInt(getInput("width")); // Default: 1360
export const height = Number.parseInt(getInput("height")); // Default: 768
export const type = getInput("type") as "webp" | "png" | "jpeg"; // Default: png
export const quality = Number.parseInt(getInput("quality")); // Default 100
