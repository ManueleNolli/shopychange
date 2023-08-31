// this script copy the .env.example file to .env
const fs = require("fs");
const path = require("path");

const targets = [
  path.join(__dirname, "backend"),
  path.join(__dirname, "frontend"),
  path.join(__dirname, "blockchain"),
];

targets.forEach((target) => {
  fs.copyFileSync(path.join(target, ".env.example"), path.join(target, ".env"));
  console.log(`.env file created at ${target}`);
});
