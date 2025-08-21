import { useEffect, useRef, type RefObject } from "react";
import {
  getCanvasPixels,
  grayscalePixels,
  resizePixels,
} from "../lib/imageUtil";

const GUESS_DELAY_MS = 200;
const OUTPUT_PIXEL_WIDTH = 28;
const OUTPUT_PIXEL_HEIGHT = 28;

export default function Board({
  ref,
}: {
  ref: RefObject<HTMLCanvasElement | null>;
}) {
  const mouseDown = useRef(false);
  const initX = useRef(0.0);
  const initY = useRef(0.0);
  const lastGuessTime = useRef(Date.now());

  useEffect(() => {
    console.log("Board rendered");
  }, []);

  return (
    <canvas
      ref={ref}
      className="board"
      width={500}
      height={500}
      onMouseDown={(e) => {
        initX.current =
          e.clientX - e.currentTarget.getBoundingClientRect().left;
        initY.current = e.clientY - e.currentTarget.getBoundingClientRect().top;
        mouseDown.current = true;
        drawLine(
          e.currentTarget.getContext("2d")!,
          initX.current,
          initY.current,
          initX.current,
          initY.current
        );
      }}
      onMouseUp={() => {
        mouseDown.current = false;
      }}
      onMouseMove={async (e) => {
        if (mouseDown.current) {
          console.log("mouse dragging");
          const newX = e.clientX - e.currentTarget.getBoundingClientRect().left;
          const newY = e.clientY - e.currentTarget.getBoundingClientRect().top;
          drawLine(
            e.currentTarget.getContext("2d")!,
            initX.current,
            initY.current,
            newX,
            newY
          );
          initX.current = newX;
          initY.current = newY;
          if (Date.now() - lastGuessTime.current >= GUESS_DELAY_MS) {
            lastGuessTime.current = Date.now();
            const canvas = e.currentTarget;
            const pixels = await getDownscaledGrayscaleCanvasPixelData(canvas);
            let lines = "";
            for (let y = 0; y < 28; y++) {
              let line = "";
              for (let x = 0; x < 28; x++) {
                if (pixels[y * 28 + x] == 0) {
                  line += "# ";
                } else {
                  line += "  ";
                }
              }
              lines += line + '\n';
            }
            console.log(lines)
          }
        }
      }}
    ></canvas>
  );
}

async function getDownscaledGrayscaleCanvasPixelData(
  canvas: HTMLCanvasElement
): Promise<Uint8Array> {
  return grayscalePixels(
    resizePixels(
      getCanvasPixels(canvas),
      canvas.width,
      canvas.height,
      OUTPUT_PIXEL_WIDTH,
      OUTPUT_PIXEL_HEIGHT
    )
  );
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number = 10
) {
  ctx.fillStyle = "black";
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
