import { createRef, useEffect, useState } from "react";
import Board from "./components/Board";
import Digits from "./components/Digits";
import "./styles/App.css";
import { PredictionContext, SetPredictionContext } from "./context/PredictionContext";

function App() {
  const canvasRef = createRef<HTMLCanvasElement>();
  const [prediction, setPrediction] = useState<number[]>(
    new Array(10).fill(1.0)
  );

  useEffect(() => {
    console.log("App rerendered");
  }, []);

  return (
    <div className="App">
      <h1>Digit recognizer</h1>
      <SetPredictionContext value={setPrediction}>
        <Board ref={canvasRef} />
      </SetPredictionContext>
      <button
        onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const width = canvas.width;
            const height = canvas.height;
            canvas.getContext("2d")?.clearRect(0, 0, width, height);
          }
        }}
      >
        Clear
      </button>
      <PredictionContext value={prediction}>
        <Digits />
      </PredictionContext>
    </div>
  );
}

export default App;
