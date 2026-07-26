import { useEffect, useState } from "react";

const rowPatterns = [
  "+ - * / + / - * - + / * + * - /",
  "/ * + - - / * + * - / + / + - *",
  "* + / - / - * + + * - / - / + *",
  "- / + * * + - / / * + - + - / *",
] as const;

const operatorRows = Array.from({ length: 44 }, (_, rowIndex) =>
  `${rowPatterns[rowIndex % rowPatterns.length]} ${
    rowPatterns[(rowIndex + 1) % rowPatterns.length]
  }`,
);

const copiesPerStrip = 6;
const operatorGlyphs = ["+", "-", "*", "/"] as const;
const digitGlyphs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const initialStrips = operatorRows.map((row) =>
  `${row} `.repeat(copiesPerStrip),
);

function getNextGlyph(currentGlyph: string) {
  const glyphs = Math.random() < 0.5 ? operatorGlyphs : digitGlyphs;
  const randomIndex = Math.floor(Math.random() * glyphs.length);
  const nextGlyph = glyphs[randomIndex];

  return nextGlyph === currentGlyph
    ? glyphs[(randomIndex + 1) % glyphs.length]
    : nextGlyph;
}

function mutateStrip(strip: string) {
  const characters = [...strip];

  for (let index = 0; index < characters.length; index += 1) {
    if (characters[index] !== " " && Math.random() < 0.06) {
      characters[index] = getNextGlyph(characters[index]);
    }
  }

  return characters.join("");
}

export function OperatorAsciiBackground() {
  const [strips, setStrips] = useState(initialStrips);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let mutationInterval: number | undefined;

    const syncMutationAnimation = () => {
      if (reducedMotion.matches) {
        window.clearInterval(mutationInterval);
        mutationInterval = undefined;
        return;
      }

      if (mutationInterval === undefined) {
        mutationInterval = window.setInterval(() => {
          setStrips((currentStrips) => currentStrips.map(mutateStrip));
        }, 650);
      }
    };

    syncMutationAnimation();
    reducedMotion.addEventListener("change", syncMutationAnimation);

    return () => {
      window.clearInterval(mutationInterval);
      reducedMotion.removeEventListener("change", syncMutationAnimation);
    };
  }, []);

  return (
    <div aria-hidden="true" className="operator-ascii">
      {strips.map((strip, rowIndex) => (
        <div className="operator-ascii-row" key={rowIndex}>
          <span>{strip}</span>
          <span>{strip}</span>
        </div>
      ))}
    </div>
  );
}
