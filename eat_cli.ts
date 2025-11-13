// eat_cli.ts
// Simple CLI for EAT <-> JSON conversion.

import * as fs from "fs";
import * as path from "path";
import { parseEAT, stringifyEAT } from "./eat_parser";

function printUsage() {
  console.log("Usage:");
  console.log("  eat-cli parse <file.eat>");
  console.log("  eat-cli stringify <file.json>");
  process.exit(1);
}

async function main() {
  const [, , cmd, file] = process.argv;
  if (!cmd || !file) {
    printUsage();
  }

  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    process.exit(1);
  }

  if (cmd === "parse") {
    const text = fs.readFileSync(file, "utf8");
    const doc = parseEAT(text);
    console.log(JSON.stringify(doc, null, 2));
  } else if (cmd === "stringify") {
    const text = fs.readFileSync(file, "utf8");
    const json = JSON.parse(text);
    const eatText = stringifyEAT(json);
    console.log(eatText);
  } else {
    printUsage();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
