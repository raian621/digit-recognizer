import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import Digits from "src/components/Digits";

test("Digits", () => {
  render(<Digits />);
  const digits = document.querySelector(".digits");
  expect(digits).not.toBeNull();
  const digitTexts: String[] = [];
  digits?.childNodes.forEach((node) => digitTexts.push(node.textContent!));
  expect(digitTexts).toEqual([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ]);
});
