import { createContext } from "react";

export const PredictionContext = createContext(new Array(10).fill(1.0));
export const SetPredictionContext = createContext((_prediction: number[]) => {});
