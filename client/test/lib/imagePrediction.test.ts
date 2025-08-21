import { fetchPrediction, submitImage, type PredictionMessage } from "src/lib/imagePrediction";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("submitImage", async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("request returns error message", async () => {
    const mockResponse = {
      ok: false,
      json: () =>
        Promise.resolve({ message: "this message doesn't matter atm" }),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as Response);
    const maybeGuessId = await submitImage(new Uint8Array([1]));
    expect(maybeGuessId).toBeNull();
  });

  test("request returns guessId", async () => {
    const expectedGuessId = "hi I'm a guess ID";
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ guess_id: expectedGuessId }),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as Response);
    const maybeGuessId = await submitImage(new Uint8Array([1]));
    expect(maybeGuessId).not.toBeNull();
    expect(maybeGuessId!).toEqual(expectedGuessId);
  });
});

describe("fetchPrediction", async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("request returns error message", async () => {
    const mockGuessId = "guess id";
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: "an error message" }),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as Response);
    const prediction = await fetchPrediction(mockGuessId);
    expect(prediction).toBeNull();
  });

  test("server found prediction result", async () => {
    const mockGuessId = "guess id";
    const expectedResult = {
      status: "FOUND",
      result: [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    } as PredictionMessage;
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(expectedResult),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as Response);
    const prediction = await fetchPrediction(mockGuessId);
    expect(prediction).toEqual(expectedResult);
  });

  test("server could not find prediction result", async () => {
    const mockGuessId = "guess id";
    const expectedResult = {
      status: "NOT_FOUND",
    } as PredictionMessage;
    const mockResponse = {
      ok: false,
      status: 404,
      json: () => Promise.resolve(expectedResult),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse as Response);
    const prediction = await fetchPrediction(mockGuessId);
    expect(prediction).toEqual(expectedResult);
  });
});
