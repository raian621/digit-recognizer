type QueuedMessage = {
  guess_id: string;
};

type ErrorMessage = {
  message: string;
};

export type PredictionMessage = {
  status: "FOUND" | "NOT_FOUND";
  result?: Array<number>;
};

const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function submitImage(image: Uint8Array): Promise<string | null> {
  const guessUrl = BASE_API_URL + "make_guess";
  const res = await fetch(guessUrl, {
    body: image as BodyInit,
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
  if (!res.ok) {
    const { message } = (await res.json()) as ErrorMessage;
    console.error("Invalid image submitted:", message);
    return null;
  }
  const { guess_id: guessId } = (await res.json()) as QueuedMessage;
  return guessId;
}

export async function fetchPrediction(
  guessId: string
): Promise<PredictionMessage | null> {
  const inferenceUrl = BASE_API_URL + `/inference?guess_id=${guessId}`;
  const res = await fetch(inferenceUrl);
  if (!res.ok) {
    if (res.status == 404) {
      return (await res.json()) as PredictionMessage;
    }
    const { message } = (await res.json()) as ErrorMessage;
    console.error(message);
    return null;
  }
  return (await res.json()) as PredictionMessage;
}
