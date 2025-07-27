import { useEffect, useState } from "react";
import Digit from "./Digit";

function Digits() {
  const opacities = new Array(10).fill(1.0).map((opacity) => useState(opacity));
  useEffect(() => {
    opacities[0][1](0.2);
  }, []);
  return (
    <div className="digits">
      {opacities.map(([opacity, _], idx) => (
        <Digit key={idx} index={idx} opacity={opacity} />
      ))}
    </div>
  );
}

export default Digits;
