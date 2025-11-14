import { describe, expect, it } from "vitest";
import { parseEAT } from "./eat_parser";

describe("parseEAT array blocks", () => {
  it("parses keyed array rows", () => {
    const eat = `
Items[2]{id, value}:
  1, foo
  2, bar
`;

    const doc = parseEAT(eat);
    expect(doc.Items).toEqual([
      { id: "1", value: "foo" },
      { id: "2", value: "bar" },
    ]);
  });
});
