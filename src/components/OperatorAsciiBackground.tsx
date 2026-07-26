const rowPatterns = [
  "+ - * /  + / - *  - + / *  + * - /  ",
  "/ * + -  - / * +  * - / +  / + - *  ",
  "* + / -  / - * +  + * - /  - / + *  ",
  "- / + *  * + - /  / * + -  + - / *  ",
] as const;

const operatorRows = Array.from({ length: 15 }, (_, rowIndex) =>
  `${rowPatterns[rowIndex % rowPatterns.length]}${
    rowPatterns[(rowIndex + 1) % rowPatterns.length]
  }`,
);

const copiesPerRow = 7;

export function OperatorAsciiBackground() {
  return (
    <div aria-hidden="true" className="operator-ascii">
      {operatorRows.map((row, rowIndex) => (
        <div className="operator-ascii-row" key={rowIndex}>
          {Array.from({ length: copiesPerRow }, (_, copyIndex) => (
            <span key={copyIndex}>{row}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
