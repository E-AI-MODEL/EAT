import { describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { parseEAT, stringifyEAT } from "./eat_parser";

describe("parseEAT ↔ stringifyEAT", () => {
  const fixture = readFileSync("example/analyst_agent.eat", "utf8");

  it("retains locked boolean across round-trip", () => {
    const parsed = parseEAT(fixture);
    expect(parsed.locked).toBe(true);
    expect(Array.isArray(parsed.rules)).toBe(true);
    expect(parsed.rules).toEqual(["geen_hallucinaties", "brontransparantie"]);

    const roundTripped = stringifyEAT(parsed);
    expect(roundTripped.includes("locked: true")).toBe(true);

    const reparsed = parseEAT(roundTripped);
    expect(reparsed.locked).toBe(true);
    expect(reparsed.rules).toEqual(parsed.rules);
  });
});
