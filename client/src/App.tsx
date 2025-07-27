import { createRef, useEffect } from "react";
import Board from "./components/Board";
import Digits from "./components/Digits";
import "./styles/App.css";

function App() {
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {console.log("App rerendered")}, [])

  return (
    <div className="App">
      <h1>Digit recognizer</h1>
      <Board ref={canvasRef} />
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
      <Digits />
    </div>
  );
}

export default App;
