export function resizePixels(
  rgbData: Uint8Array,
  w1: number,
  h1: number,
  w2: number,
  h2: number
): Uint8Array {
  if (rgbData.length % 3 != 0) {
    throw new Error("invalid RGB data");
  }

  const resized = new Uint8Array(3 * w2 * h2);
  let x0 = 0;
  let y0 = 0;
  for (let y = 0; y < h2; y++) {
    const y1 = ((y + 1) * h1) / h2 | 0;
    for (let x = 0; x < w2; x++) {
      const x1 = ((x + 1) * w1) / w2 | 0;
      const [r, g, b] = averagePixels(rgbData, w1, x0, y0, x1 - x0, y1 - y0);
      const offset = 3 * (x + y * w2);
      resized[offset] = r;
      resized[offset + 1] = g;
      resized[offset + 2] = b;
      x0 = x1;
    }
    y0 = y1;
    x0 = 0;
  }

  return resized;
}

function averagePixels(
  rgbData: Uint8Array,
  imageWidth: number,
  x0: number,
  y0: number,
  width: number,
  height: number
): number[] {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let x = x0; x < x0 + width; x++) {
    for (let y = y0; y < y0 + height; y++) {
      const offset = 3 * (y * imageWidth + x);
      r += rgbData[offset];
      g += rgbData[offset + 1];
      b += rgbData[offset + 2];
    }
  }
  // return pixel values as integers
  const pixelCount = width * height;
  return [(r / pixelCount) | 0, (g / pixelCount) | 0, (b / pixelCount) | 0];
}

export function grayscalePixels(rgbData: Uint8Array): Uint8Array {
  if (rgbData.length % 3 != 0) {
    throw new Error("invalid RGB data");
  }
  return new Uint8Array(rgbData.byteLength / 3).map((_, i) => {
    return (rgbData[3 * i] + rgbData[3 * i + 1] + rgbData[3 * i + 2]) / 3;
  });
}
