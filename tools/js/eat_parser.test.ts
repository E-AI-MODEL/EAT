import { describe, expect, test } from "bun:test";
import { parseEAT } from "./eat_parser";

describe("parseEAT", () => {
  test("parses description block with multiline sentinel on separate line", () => {
    const input = `description:\n"""\nDit is regel 1\nDit is regel 2\n"""`;
    const parsed = parseEAT(input);
    expect(parsed.description).toBe("Dit is regel 1\nDit is regel 2");
  });
});
