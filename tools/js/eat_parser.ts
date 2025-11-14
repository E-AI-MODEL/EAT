// eat_parser.ts
// EAT → JSON parser and JSON → EAT serializer

export type EatValue = string | boolean | string[] | Record<string, any> | Record<string, any>[];
export interface EatDocument { [key: string]: EatValue; }

interface ParseState {
  currentBlock: string | null;
  currentKeys: string[];
  inMultiline: boolean;
  multilineBuffer: string[];
  inArray: boolean;
}

const arrayHeaderRegex = /^(\w+)\[(\d*)\]\{([^}]*)\}:\s*$/;
const blockHeaderRegex = /^(\w+)(?:\{([^}]*)\})?:\s*$/;
const exactHeaderRegex = /^(\w+_exact):\s*$/;

export function parseEAT(text: string): EatDocument {
  const lines = text.split(/\r?\n/);
  const doc: EatDocument = {};
  const state: ParseState = {
    currentBlock: null,
    currentKeys: [],
    inMultiline: false,
    multilineBuffer: [],
    inArray: false,
  };

  for (let rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    const trimmed = line.trim();

    if (!trimmed && !state.inMultiline) {
      if (state.currentBlock && state.currentKeys.length === 0 && !state.inArray) {
        state.currentBlock = null;
      }
      continue;
    }

    if (state.inMultiline && trimmed === '"""') {
      if (state.currentBlock) {
        doc[state.currentBlock] = state.multilineBuffer.join("\n");
      }
      state.inMultiline = false;
      state.currentBlock = null;
      state.multilineBuffer = [];
      continue;
    }

    if (state.inMultiline) {
      state.multilineBuffer.push(line);
      continue;
    }

    if (trimmed.endsWith('"""')) {
      const name = trimmed.split(":")[0];
      state.currentBlock = name;
      state.inMultiline = true;
      state.multilineBuffer = [];
      continue;
    }

    const arrayMatch = trimmed.match(arrayHeaderRegex);
    if (arrayMatch) {
      const [, name, , keysRaw] = arrayMatch;
      state.currentBlock = name;
      state.currentKeys = keysRaw.split(",").map((s) => s.trim());
      state.inArray = true;
      doc[name] = [];
      continue;
    }

    if (state.inArray && state.currentBlock && state.currentKeys.length > 0 && trimmed.includes(",")) {
      const values = trimmed.split(",").map((s) => s.trim());
      const row: Record<string, any> = {};
      state.currentKeys.forEach((k, i) => {
        row[k] = values[i] ?? null;
      });
      (doc[state.currentBlock] as any[]).push(row);
      continue;
    }

    const inlineMatch = trimmed.match(/^(\w+):\s+(.+)$/);
    if (inlineMatch) {
      const [, name, rawValue] = inlineMatch;
      let value: any = rawValue.trim();
      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      doc[name] = value;
      state.currentBlock = null;
      state.currentKeys = [];
      state.inArray = false;
      continue;
    }

    const exactMatch = trimmed.match(exactHeaderRegex);
    if (exactMatch) {
      state.currentBlock = exactMatch[1];
      state.currentKeys = [];
      state.inArray = false;
      continue;
    }

    if (state.currentBlock && state.currentBlock.endsWith("_exact")) {
      const value = trimmed.replace(/^"|"$/g, "");
      doc[state.currentBlock] = value;
      state.currentBlock = null;
      state.currentKeys = [];
      state.inArray = false;
      continue;
    }

    const blockMatch = trimmed.match(blockHeaderRegex);
    if (blockMatch) {
      const [, name, keysRaw] = blockMatch;
      state.currentBlock = name;
      state.currentKeys = keysRaw ? keysRaw.split(",").map((s) => s.trim()) : [];
      state.inArray = false;

      if (!keysRaw) {
        doc[name] = [];
      }
      continue;
    }

    if (state.currentBlock && state.currentKeys.length > 0 && !state.inArray) {
      const values = trimmed.split(",").map((s) => s.trim());
      const obj: Record<string, any> = {};
      state.currentKeys.forEach((k, i) => {
        obj[k] = values[i] ?? null;
      });
      doc[state.currentBlock] = obj;
      state.currentBlock = null;
      state.currentKeys = [];
      continue;
    }

    if (state.currentBlock && state.currentKeys.length === 0 && !state.inArray) {
      const existing = doc[state.currentBlock];
      const val = trimmed.replace(/,$/, "");
      if (Array.isArray(existing)) {
        existing.push(val);
      } else if (existing === undefined) {
        doc[state.currentBlock] = [val];
      } else {
        doc[state.currentBlock] = [existing, val];
      }
      continue;
    }
  }

  return doc;
}

export function stringifyEAT(doc: EatDocument): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(doc)) {
    if (key.endsWith("_exact") && typeof value === "string") {
      lines.push(`${key}:`);
      lines.push(`  "${value}"`);
      lines.push("");
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}:`);
        lines.push("");
        continue;
      }
      if (typeof value[0] === "string") {
        lines.push(`${key}:`);
        for (const v of value as string[]) {
          lines.push(`  ${v}`);
        }
        lines.push("");
        continue;
      }
      const arr = value as Record<string, any>[];
      const keys = Object.keys(arr[0] || {});
      lines.push(`${key}[${arr.length}]{${keys.join(", ")}}:`);
      for (const row of arr) {
        const vals = keys.map((k) => String(row[k] ?? ""));
        lines.push(`  ${vals.join(", ")}`);
      }
      lines.push("");
      continue;
    }

    if (typeof value === "object" && value !== null) {
      const obj = value as Record<string, any>;
      const keys = Object.keys(obj);
      lines.push(`${key}{${keys.join(", ")}}:`);
      const vals = keys.map((k) => String(obj[k] ?? ""));
      lines.push(`  ${vals.join(", ")}`);
      lines.push("");
      continue;
    }

    if (typeof value === "string") {
      lines.push(`${key}:`);
      lines.push(`  ${value}`);
      lines.push("");
      continue;
    }

    if (typeof value === "boolean") {
      lines.push(`${key}: ${value ? "true" : "false"}`);
      lines.push("");
      continue;
    }
  }

  return lines.join("\n").trimEnd();
}
