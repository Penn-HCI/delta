import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import type { Config } from "delta-dsl";

import {
  rebuildTutorialSource,
  tutorialExamples,
  type PlaygroundPreset,
  type TutorialExample,
} from "../tutorial-examples";
import DeltaPreview from "./DeltaPreview";
import { SyntaxHighlightedCode } from "./SyntaxHighlightedCode";

export type { PlaygroundPreset } from "../tutorial-examples";

type SnippetPlaygroundProps = {
  preset: PlaygroundPreset;
  title: string;
};

type ParsedPlayground = {
  config: Config;
  formulaHeight: number;
  formulaId: string;
  showSteps: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractConfigSource(source: string) {
  const assignment = /const\s+config\s*:\s*Config\s*=/.exec(source);
  if (!assignment) {
    throw new Error("The tutorial file needs a Config named config.");
  }

  let index = assignment.index + assignment[0].length;
  while (/\s/.test(source[index] ?? "")) index += 1;
  if (source[index] !== "{") {
    throw new Error("The tutorial config must be an object.");
  }

  const start = index;
  let depth = 0;
  let quote: "'" | '"' | "`" | null = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === "'" || character === '"' || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") {
      depth += 1;
      continue;
    }
    if (character !== "}") continue;

    depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  throw new Error("The tutorial config is missing its closing brace.");
}

function evaluateConfig(source: string): Config {
  const configSource = extractConfigSource(source);
  const evaluate = new Function(
    `"use strict"; return (${configSource});`,
  ) as () => unknown;
  const config = evaluate();

  if (!isRecord(config)) {
    throw new Error("The tutorial config must evaluate to an object.");
  }
  if (config.variables !== undefined && !isRecord(config.variables)) {
    throw new Error("variables must be an object.");
  }
  if (!Array.isArray(config.formulas)) {
    throw new Error("formulas must be an array.");
  }
  if (
    config.semantics !== undefined &&
    typeof config.semantics !== "function"
  ) {
    throw new Error("semantics must be a function.");
  }

  return config as Config;
}

function validateStepControl(editableSource: string) {
  const remaining = editableSource
    .replace(/<StepControl\b[^>]*\/>/g, "")
    .trim();

  if (remaining) {
    throw new Error("Only StepControl belongs in this editable region.");
  }
}

function parsePlayground(
  preset: PlaygroundPreset,
  editableSource: string,
): ParsedPlayground {
  if (preset === "step-control") validateStepControl(editableSource);

  const example = tutorialExamples[preset];
  const fullSource = rebuildTutorialSource(example, editableSource);
  const config = evaluateConfig(fullSource);
  const formulas = config.formulas ?? [];
  const formula = formulas[0];

  if (!formula?.id) {
    throw new Error("The resulting config needs one formula with an id.");
  }
  if (new Set(formulas.map(({ id }) => id)).size !== formulas.length) {
    throw new Error("Formula ids must be unique.");
  }

  const renderedId = /<Formula\s+id="([^"]+)"/.exec(fullSource)?.[1];
  if (renderedId && renderedId !== formula.id) {
    throw new Error(
      `The formula id must stay "${renderedId}" to match the rendered Formula.`,
    );
  }

  return {
    config,
    formulaHeight: example.formulaHeight,
    formulaId: formula.id,
    showSteps:
      config.stepping === true &&
      /<StepControl\b[^>]*\/>/.test(fullSource),
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not parse this section.";
}

function ProtectedCodeEditor({
  after,
  before,
  indent,
  label,
  onChange,
  value,
}: Pick<TutorialExample, "after" | "before" | "indent"> & {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const helpId = useId();
  const editableRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bodyLines = value.split("\n");
  const longestLine = Math.max(
    52,
    ...before.split("\n").map((line) => line.length + 4),
    ...bodyLines.map((line) => line.length + indent + 4),
    ...after.split("\n").map((line) => line.length + 4),
  );
  const style = {
    "--code-indent": `${indent}ch`,
    "--editable-lines": Math.max(1, bodyLines.length),
    "--code-width": `${longestLine}ch`,
  } as CSSProperties;

  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    const editable = editableRef.current;
    if (!scroller || !editable) return;

    const centerEditable = () => {
      scroller.style.setProperty(
        "--code-scroll-space",
        `${scroller.clientHeight / 2}px`,
      );
      const scrollerBounds = scroller.getBoundingClientRect();
      const editableBounds = editable.getBoundingClientRect();
      scroller.scrollTop +=
        editableBounds.top +
        editableBounds.height / 2 -
        (scrollerBounds.top + scrollerBounds.height / 2);
      scroller.scrollLeft = 0;
    };

    centerEditable();

    const observer = new ResizeObserver(centerEditable);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [before, label]);

  return (
    <div
      aria-label={`${label} protected configuration editor`}
      className="protected-code"
      ref={scrollRef}
      role="group"
    >
      <p className="sr-only" id={helpId}>
        The surrounding code is read-only. Only the highlighted code between
        the locked delimiters can be edited.
      </p>
      <div className="protected-code-content" style={style}>
        <pre className="protected-code-readonly">
          <code>
            <SyntaxHighlightedCode source={before} />
          </code>
        </pre>
        <div className="protected-code-editable-region">
          <pre
            aria-hidden="true"
            className="protected-code-editable-highlight"
          >
            <code>
              <SyntaxHighlightedCode source={value} />
            </code>
          </pre>
          <textarea
            aria-describedby={helpId}
            aria-label={`${label} editable contents`}
            className="protected-code-editable-input"
            onChange={(event) => onChange(event.target.value)}
            ref={editableRef}
            rows={Math.max(1, bodyLines.length)}
            spellCheck={false}
            value={value}
            wrap="off"
          />
        </div>
        <pre className="protected-code-readonly">
          <code>
            <SyntaxHighlightedCode source={after} />
          </code>
        </pre>
      </div>
    </div>
  );
}

export function SnippetPlayground({
  preset,
  title,
}: SnippetPlaygroundProps) {
  const example = tutorialExamples[preset];
  const [draft, setDraft] = useState(example.initial);
  const [parsed, setParsed] = useState(() =>
    parsePlayground(preset, example.initial),
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const updateCode = (nextCode: string) => {
    setDraft(nextCode);

    try {
      const next = parsePlayground(preset, nextCode);
      setParsed(next);
      setParseError(null);
      setRevision((value) => value + 1);
    } catch (error) {
      setParseError(errorMessage(error));
    }
  };

  return (
    <div className="snippet-playground">
      <div className="snippet-editor">
        <ProtectedCodeEditor
          after={example.after}
          before={example.before}
          indent={example.indent}
          label={title}
          onChange={updateCode}
          value={draft}
        />
        {parseError && (
          <p className="snippet-error">
            {parseError} The preview is showing the last valid contents.
          </p>
        )}
      </div>

      <div className="snippet-preview">
        <DeltaPreview
          config={parsed.config}
          formulaHeight={parsed.formulaHeight}
          formulaId={parsed.formulaId}
          key={`${preset}-${revision}`}
          showSteps={parsed.showSteps}
        />
      </div>
    </div>
  );
}

export function ConfigPlayground() {
  return (
    <SnippetPlayground
      preset="linear-config"
      title="Complete linear config"
    />
  );
}
