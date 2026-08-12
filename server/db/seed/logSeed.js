import { writeFile, appendFile } from "fs/promises";

export function shouldLog() {
  if (!process.env.LOG_SEED) return false;
  //if environment variable is equal to 'true': log
  return process.env.LOG_SEED == "true";
}

export async function createLogFile(fileName) {
  //create log file
  try {
    await writeFile(fileName, "", "utf8");
  } catch (e) {
    console.error("Error creating log file:", e.message);
  }
}

export async function logObjectArray(fileName, arr) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    let itemText = JSON.stringify(item);
    itemText = itemText.replaceAll("{", "");
    itemText = itemText.replaceAll("}", "");
    itemText = itemText.replaceAll('"', "");
    const properties = itemText.split(",");

    const lineBreak = i != 0 ? "\n" : "";
    let fileText = "";
    for (const property of properties) {
      const propertyInfo = property.split(":");
      fileText += `${propertyInfo[0]}: ${propertyInfo[1]}\n`;
    }

    try {
      await appendFile(fileName, lineBreak + fileText, "utf8");
    } catch (e) {
      console.error("Error writing to log file:", e.message);
    }
  }
}
