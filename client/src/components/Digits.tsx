import { useContext, useEffect, useState } from "react";
import Digit from "./Digit";
import { PredictionContext } from "src/context/PredictionContext";

function Digits() {
  const prediction = useContext(PredictionContext)
  return (
    <div className="digits">
      {prediction.map((opacity, idx) => (
        <Digit key={idx} index={idx} opacity={opacity} />
      ))}
    </div>
  );
}

export default Digits;
