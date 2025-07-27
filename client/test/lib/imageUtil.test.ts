import { describe, expect, test } from "vitest";
import { grayscalePixels, resizePixels } from "src/lib/imageUtil";

function simple2x2(): Uint8Array {
  return new Uint8Array([
    25,
    50,
    75, // top left
    50,
    75,
    100, // top right
    20,
    40,
    60, // bottom left
    100,
    150,
    200, // bottom right
  ]);
}

function createPixelsFromRgb(...rgbValues: number[][]): Uint8Array {
  return new Uint8Array(rgbValues.reduce((acc, val) => acc.concat(...val)));
}

describe("createPixelsFromRgb", () => {
  test("sanity check", () => {
    expect(createPixelsFromRgb([1, 2, 3], [4, 5, 6])).toEqual(
      new Uint8Array([1, 2, 3, 4, 5, 6])
    );
  });
});

describe("grayscale", () => {
  test("empty pixel data", () => {
    const emptyData = new Uint8Array(0);
    const grayscale = grayscalePixels(emptyData);
    expect(grayscale.length).toBe(0);
  });

  test("rgb pixel is averaged", () => {
    const rgbData = new Uint8Array([25, 50, 75]);
    const grayscale = grayscalePixels(rgbData);
    expect(grayscale.length).toBe(1);
    expect(grayscale[0]).toBe(50);
  });

  test("invalid rgb data", () => {
    const rgbData = new Uint8Array([25, 50]);
    expect(() => {
      grayscalePixels(rgbData);
    }).toThrowError("invalid RGB data");
  });
});

describe("resizePixels", () => {
  test("empty pixel data", () => {
    const emptyData = new Uint8Array(0);
    const average = resizePixels(emptyData, 0, 0, 0, 0);
    expect(average.length).toBe(0);
  });

  test("invalid rgb data", () => {
    const rgbData = new Uint8Array([25, 50]);
    expect(() => {
      resizePixels(rgbData, 0, 0, 0, 0);
    }).toThrowError("invalid RGB data");
  });

  test("resize to one pixel", () => {
    const rgbData = simple2x2();
    const expected = new Uint8Array([48, 78, 108]);
    expect(resizePixels(rgbData, 2, 2, 1, 1)).toEqual(expected);
  });

  test("resize to same number of pixels", () => {
    const rgbData = simple2x2();
    expect(resizePixels(rgbData, 2, 2, 2, 2)).toEqual(rgbData);
  });

  test("resize to pixels to count indivisible by original", () => {
    const rgbData = createPixelsFromRgb(
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
      [13, 14, 15],
      [16, 17, 18],
      [19, 20, 21],
      [22, 23, 24],
      [25, 26, 27]
    );
    const expected = createPixelsFromRgb(
      [1, 2, 3],
      [5, 6, 7],
      [14, 15, 16],
      [19, 20, 21]
    );
    expect(resizePixels(rgbData, 3, 3, 2, 2)).toEqual(expected);
  });
});
