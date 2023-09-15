import { transRGBTo16 } from "../src/utils";

describe("utils test", () => {
  it("transRGBTo16", () => {
    expect(transRGBTo16("255,255,255")).toEqual("#ffffff");
  });
});
