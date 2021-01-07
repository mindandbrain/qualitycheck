import { formatLikeBids } from "../utils";

describe("formatLikeBids", () => {
  it.each([
    ["seedCorr", "seedCorr"],
    ["faces>shapes", "facesGtShapes"],
    ["faces-vs-shapes", "facesVsShapes"],
    ["fALFF", "fALFF"],
  ])("format %s like bids", (a: string, b: any) => {
    expect(formatLikeBids(a)).toEqual(b);
  });
});
