/*
Modify the .env value for the given key to the given value and path.
*/

import fs from "fs";
import path from "path";

export function modifyEnv(
  key: string,
  newValue: string,
  destinationPath: string,
  quote = false,
  quoteType = '"'
) {
  const envPath = path.join(__dirname, "..", "..", "..", destinationPath);
  const env = fs.readFileSync(envPath).toString();
  const envLines = env.split("\n");
  let newEnv = "";
  for (const line of envLines) {
    if (line.startsWith(key)) {
      newEnv += `${key}=${quote ? quoteType : ""}${newValue}${
        quote ? quoteType : ""
      }\n`;
    } else {
      newEnv += `${line}\n`;
    }
  }
  fs.writeFileSync(envPath, newEnv);
  console.log(`Modified ${key} to ${newValue} in ${envPath}`);
}
