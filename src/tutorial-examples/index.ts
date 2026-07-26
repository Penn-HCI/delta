import dragInputSource from "./drag-input.tsx?raw";
import formulaSource from "./formula.tsx?raw";
import linearConfigSource from "./linear-config.tsx?raw";
import multipleInputsSource from "./multiple-inputs.tsx?raw";
import nameAndValueSource from "./name-and-value.tsx?raw";
import numberFormattingSource from "./number-formatting.tsx?raw";
import semanticsSource from "./semantics.tsx?raw";
import stepControlSource from "./step-control.tsx?raw";
import stepDescriptionSource from "./step-description.tsx?raw";
import stepDistanceSource from "./step-distance.tsx?raw";
import stepEnableSource from "./step-enable.tsx?raw";
import stepExpressionSource from "./step-expression.tsx?raw";
import stepFirstSource from "./step-first.tsx?raw";
import stepForceSource from "./step-force.tsx?raw";
import stepFormattingSource from "./step-formatting.tsx?raw";
import variablesSource from "./variables.tsx?raw";

const startMarker = "/* @delta-edit:start */";
const endMarker = "/* @delta-edit:end */";

const rawExamples = {
  "linear-config": { source: linearConfigSource, formulaHeight: 250 },
  formula: { source: formulaSource, formulaHeight: 250 },
  "name-and-value": { source: nameAndValueSource, formulaHeight: 250 },
  variables: { source: variablesSource, formulaHeight: 250 },
  "number-formatting": {
    source: numberFormattingSource,
    formulaHeight: 250,
  },
  semantics: { source: semanticsSource, formulaHeight: 250 },
  "drag-input": { source: dragInputSource, formulaHeight: 250 },
  "multiple-inputs": { source: multipleInputsSource, formulaHeight: 250 },
  "step-enable": { source: stepEnableSource, formulaHeight: 300 },
  "step-control": { source: stepControlSource, formulaHeight: 300 },
  "step-first": { source: stepFirstSource, formulaHeight: 300 },
  "step-description": { source: stepDescriptionSource, formulaHeight: 300 },
  "step-expression": { source: stepExpressionSource, formulaHeight: 300 },
  "step-formatting": { source: stepFormattingSource, formulaHeight: 300 },
  "step-distance": { source: stepDistanceSource, formulaHeight: 300 },
  "step-force": { source: stepForceSource, formulaHeight: 300 },
} as const;

export type PlaygroundPreset = keyof typeof rawExamples;

export type TutorialExample = {
  after: string;
  before: string;
  displaySource: string;
  formulaHeight: number;
  indent: number;
  initial: string;
};

function leadingSpaces(line: string) {
  return line.length - line.trimStart().length;
}

function indentSource(source: string, spaces: number) {
  const indent = " ".repeat(spaces);
  return source
    .split("\n")
    .map((line) => (line ? indent + line : line))
    .join("\n");
}

function prepareExample(
  source: string,
  formulaHeight: number,
): TutorialExample {
  const lines = source.replace(/\r\n/g, "\n").trim().split("\n");
  const starts = lines
    .map((line, index) => (line.includes(startMarker) ? index : -1))
    .filter((index) => index >= 0);
  const ends = lines
    .map((line, index) => (line.includes(endMarker) ? index : -1))
    .filter((index) => index >= 0);

  if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0]) {
    throw new Error(
      "Each tutorial example needs exactly one ordered editable marker pair.",
    );
  }

  const editableLines = lines.slice(starts[0] + 1, ends[0]);
  const nonemptyLines = editableLines.filter((line) => line.trim());
  const indent = nonemptyLines.length
    ? Math.min(...nonemptyLines.map(leadingSpaces))
    : 0;
  const initial = editableLines
    .map((line) => line.slice(Math.min(indent, leadingSpaces(line))))
    .join("\n");
  const before = `${lines.slice(0, starts[0]).join("\n")}\n`;
  const after = lines.slice(ends[0] + 1).join("\n");
  const displaySource = `${before}${indentSource(initial, indent)}\n${after}`;

  return {
    after,
    before,
    displaySource,
    formulaHeight,
    indent,
    initial,
  };
}

export const tutorialExamples = Object.fromEntries(
  Object.entries(rawExamples).map(([id, example]) => [
    id,
    prepareExample(example.source, example.formulaHeight),
  ]),
) as Record<PlaygroundPreset, TutorialExample>;

export function rebuildTutorialSource(
  example: TutorialExample,
  editableSource: string,
) {
  return `${example.before}${indentSource(editableSource, example.indent)}\n${example.after}`;
}
