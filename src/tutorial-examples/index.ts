import defaultValuesSource from "./default-values.tsx?raw";
import dragInputSource from "./drag-input.tsx?raw";
import dragRangeSource from "./drag-range.tsx?raw";
import dragStepSource from "./drag-step.tsx?raw";
import helloWorldSource from "./hello-world.tsx?raw";
import nameSource from "./name.tsx?raw";
import numberFormattingSource from "./number-formatting.tsx?raw";
import semanticsSource from "./semantics.tsx?raw";
import stepControlSource from "./step-control.tsx?raw";
import stepDescriptionSource from "./step-description.tsx?raw";
import stepFormattingSource from "./step-formatting.tsx?raw";
import stepLabelsSource from "./step-labels.tsx?raw";
import variableKeysSource from "./variable-keys.tsx?raw";
import walkthroughSource from "./walkthrough.tsx?raw";

const startMarker = "/* @delta-edit:start */";
const endMarker = "/* @delta-edit:end */";

const rawExamples = {
  "hello-world": { source: helloWorldSource, formulaHeight: 300 },
  name: { source: nameSource, formulaHeight: 250 },
  "variable-keys": { source: variableKeysSource, formulaHeight: 250 },
  "default-values": { source: defaultValuesSource, formulaHeight: 250 },
  semantics: { source: semanticsSource, formulaHeight: 250 },
  "number-formatting": {
    source: numberFormattingSource,
    formulaHeight: 250,
  },
  "drag-input": { source: dragInputSource, formulaHeight: 250 },
  "drag-range": { source: dragRangeSource, formulaHeight: 250 },
  "drag-step": { source: dragStepSource, formulaHeight: 250 },
  walkthrough: { source: walkthroughSource, formulaHeight: 300 },
  "step-control": { source: stepControlSource, formulaHeight: 300 },
  "step-description": { source: stepDescriptionSource, formulaHeight: 300 },
  "step-labels": { source: stepLabelsSource, formulaHeight: 300 },
  "step-formatting": { source: stepFormattingSource, formulaHeight: 300 },
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
