import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Github,
  PanelLeftClose,
  PanelLeftOpen,
  TreePalm,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import {
  ConfigPlayground,
  SnippetPlayground,
  type PlaygroundPreset,
} from "./components/TutorialPlaygrounds";
import { SyntaxHighlightedCode } from "./components/SyntaxHighlightedCode";
import { assetUrl, playgroundUrl } from "./site";
import { tutorialExamples } from "./tutorial-examples";

type DocsPage = "installation" | "config" | "constructs";

type DocsProps = {
  page: DocsPage;
};

type ConstructItemProps = {
  description: ReactNode;
  id: string;
  preset: PlaygroundPreset;
  title: string;
};

const desktopSidebarWidth = 260;
const sidebarToggleProximity = 72;
const sidebarToggleVerticalMargin = 28;

const pageLinks: Array<{ id: DocsPage; label: string; href: string }> = [
  {
    id: "installation",
    label: "Installation",
    href: "#/getting-started/installation",
  },
  {
    id: "config",
    label: "Config setup",
    href: "#/getting-started/config",
  },
];

const constructAnchors = [
  {
    id: "formula-constructs",
    label: "Formulas & variables",
    constructs: [
      { id: "formula-entries", label: "Formula entries & ids" },
      { id: "names-and-values", label: "First annotated variable" },
      { id: "latex-variable-keys", label: "Remaining variable keys" },
      { id: "number-formatting", label: "Number formatting" },
    ],
  },
  {
    id: "computation-constructs",
    label: "Computation & inputs",
    constructs: [
      { id: "semantics", label: "Semantics" },
      { id: "drag-input", label: "First drag input" },
      { id: "multiple-inputs", label: "Second drag input" },
    ],
  },
  {
    id: "step-constructs",
    label: "Walkthrough steps",
    constructs: [
      { id: "step-enable", label: "Enable stepping" },
      { id: "step-control", label: "Add step controls" },
      { id: "step-first", label: "First snapshot" },
      { id: "step-description", label: "Descriptions & labels" },
      { id: "step-expression", label: "Expression scopes" },
      { id: "step-formatting", label: "Value formatting" },
      { id: "step-distance", label: "Distance checkpoint" },
      { id: "step-force", label: "Final-force checkpoint" },
    ],
  },
  { id: "construct-reference", label: "Quick reference" },
];

const developmentServerCode = `npm run dev`;

const variableReference = [
  ["name", "Explanatory label", 'name: "Mass of Earth"'],
  ["default", "Starting value", "default: 5.972e24"],
  ["sigFigs", "Displayed significant figures", "sigFigs: 3"],
  ["precision", "Displayed decimal places", "precision: 0"],
  ["input", "Interactive input", 'input: "drag"'],
  ["range", "Minimum and maximum input values", "range: [0, 100]"],
  ["step", "Increment while dragging", "step: 0.1"],
];

const stepReference = [
  ["description", "Narration outside the formula", '"Square the distance"'],
  ["variable label", "Value attached to one variable", "m_1: vars.m_1"],
  [
    "expression label",
    "Annotation for an exact LaTeX substring",
    '"m_1 m_2": "Product"',
  ],
  [
    "formatted value",
    "A formatted number in a label",
    "latex(value).sigfigs(3)",
  ],
  ["null label", "Highlight an expression without text", '"m_1 m_2": null'],
];

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back for browsers that block the Clipboard API.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Could not copy code.");
  }
}

function InlineCode({ children }: { children: ReactNode }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const resetTimeout = useRef<number>();
  const text = String(children);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimeout.current);
    },
    [],
  );

  const handleCopy = async () => {
    window.clearTimeout(resetTimeout.current);

    try {
      await copyToClipboard(text);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    resetTimeout.current = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1600);
  };

  return (
    <span className="inline-code-shell">
      <button
        aria-label={`Copy ${text} to clipboard`}
        className="inline-code"
        data-copy-state={copyStatus}
        onClick={handleCopy}
        type="button"
      >
        <code>{children}</code>
        <span aria-live="polite" className="inline-code-tooltip" role="status">
          {copyStatus === "copied" ? (
            <>
              <Check aria-hidden="true" size={12} strokeWidth={2} />
              <span className="sr-only">Copied</span>
            </>
          ) : copyStatus === "error" ? (
            "Retry"
          ) : (
            "Copy"
          )}
        </span>
      </button>
    </span>
  );
}

function CodeBlock({
  children,
  language = "plain",
}: {
  children: string;
  language?: "plain" | "tsx";
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const resetTimeout = useRef<number>();

  useEffect(
    () => () => {
      window.clearTimeout(resetTimeout.current);
    },
    [],
  );

  const handleCopy = async () => {
    window.clearTimeout(resetTimeout.current);

    try {
      await copyToClipboard(children);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    resetTimeout.current = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2000);
  };

  const copied = copyStatus === "copied";

  return (
    <div className="code-block-shell">
      <button
        aria-label={
          copied
            ? "Code copied to clipboard"
            : copyStatus === "error"
              ? "Copy failed. Try again"
              : "Copy code to clipboard"
        }
        className="code-copy-button"
        onClick={handleCopy}
        title={
          copied ? "Copied" : copyStatus === "error" ? "Retry copy" : "Copy"
        }
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" size={13} strokeWidth={1.9} />
        ) : (
          <Copy aria-hidden="true" size={13} strokeWidth={1.9} />
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : copyStatus === "error" ? "Retry" : "Copy"}
        </span>
      </button>
      <pre className="code-block">
        <code>
          {language === "tsx" ? (
            <SyntaxHighlightedCode source={children} />
          ) : (
            children
          )}
        </code>
      </pre>
    </div>
  );
}

function DocsSidebar({
  hidden,
  onHide,
  page,
}: {
  hidden: boolean;
  onHide: () => void;
  page: DocsPage;
}) {
  const [expandedSections, setExpandedSections] = useState(
    () =>
      new Set(
        constructAnchors
          .filter((anchor) => "constructs" in anchor)
          .map((anchor) => anchor.id),
      ),
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSection = (id: string) => {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConstructLink = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (page !== "constructs") return;

    event.preventDefault();
    window.history.replaceState(
      null,
      "",
      `#/getting-started/constructs?section=${id}`,
    );
    scrollTo(id);
  };

  return (
    <aside
      aria-hidden={hidden}
      className={`docs-sidebar ${hidden ? "docs-sidebar-collapsed" : ""}`}
      id="docs-sidebar"
      ref={(node) => {
        node?.toggleAttribute("inert", hidden);
      }}
    >
      <div className="docs-sidebar-header">
        <a className="docs-brand" href="#/">
          <span
            aria-hidden="true"
            className="delta-logo-mark size-8 rounded-lg"
          >
            <img
              alt=""
              className="h-[18px] w-auto"
              src={assetUrl("delta-mark.svg")}
            />
          </span>
          <strong>Documentation</strong>
        </a>
        <button
          aria-controls="docs-sidebar"
          aria-expanded="true"
          aria-label="Hide sidebar"
          className="docs-sidebar-toggle docs-sidebar-static-toggle"
          onClick={onHide}
          title="Hide sidebar"
          type="button"
        >
          <PanelLeftClose aria-hidden="true" size={17} strokeWidth={1.75} />
        </button>
      </div>

      <nav className="-mx-5 mt-5 border-t border-slate-200 px-5 pt-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <p className="docs-nav-heading">Getting started</p>
        <div className="mt-1 space-y-1">
          {pageLinks.map((link) => (
            <a
              className={`docs-nav-link ${page === link.id ? "active" : ""}`}
              href={link.href}
              key={link.id}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-7">
          <a
            className={`docs-nav-heading docs-section-link ${
              page === "constructs" ? "active" : ""
            }`}
            href="#/getting-started/constructs"
          >
            Constructs
          </a>
          <div className="mt-1 space-y-1">
            {constructAnchors.map((anchor) => {
              const hasConstructs =
                "constructs" in anchor && Boolean(anchor.constructs);
              const expanded = expandedSections.has(anchor.id);
              const sublistId = `docs-nav-${anchor.id}`;

              return (
                <div className="docs-nav-group" key={anchor.id}>
                  {hasConstructs ? (
                    <div className="docs-nav-parent-row">
                      <a
                        className="docs-nav-link"
                        href={`#/getting-started/constructs?section=${anchor.id}`}
                        onClick={(event) =>
                          handleConstructLink(event, anchor.id)
                        }
                      >
                        {anchor.label}
                      </a>
                      <button
                        aria-controls={sublistId}
                        aria-expanded={expanded}
                        aria-label={`${
                          expanded ? "Collapse" : "Expand"
                        } ${anchor.label}`}
                        className="docs-nav-disclosure-toggle"
                        onClick={() => toggleSection(anchor.id)}
                        type="button"
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={expanded ? "" : "-rotate-90"}
                          size={15}
                          strokeWidth={1.75}
                        />
                      </button>
                    </div>
                  ) : (
                    <a
                      className="docs-nav-link"
                      href={`#/getting-started/constructs?section=${anchor.id}`}
                      onClick={(event) => handleConstructLink(event, anchor.id)}
                    >
                      {anchor.label}
                    </a>
                  )}
                  {hasConstructs && (
                    <div
                      className="docs-nav-sublist"
                      hidden={!expanded}
                      id={sublistId}
                    >
                      {anchor.constructs?.map((construct) => (
                        <a
                          className="docs-nav-sublink"
                          href={`#/getting-started/constructs?section=${construct.id}`}
                          key={construct.id}
                          onClick={(event) =>
                            handleConstructLink(event, construct.id)
                          }
                        >
                          {construct.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="docs-sidebar-footer">
        <div className="docs-sidebar-footer-links">
          <a
            className="docs-sidebar-footer-link"
            href="https://github.com/ericdai5/delta-dsl"
            rel="noreferrer"
            target="_blank"
            title="Source code on GitHub"
          >
            <Github aria-hidden="true" size={16} strokeWidth={1.75} />
            <span>GitHub</span>
          </a>
          <a
            className="docs-sidebar-footer-link"
            href={playgroundUrl}
          >
            <TreePalm aria-hidden="true" size={16} strokeWidth={1.75} />
            <span>Playground</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

function SidebarBoundaryToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pointerFrame = useRef<number>();

  useEffect(() => {
    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    const cancelPointerFrame = () => {
      if (pointerFrame.current === undefined) return;
      window.cancelAnimationFrame(pointerFrame.current);
      pointerFrame.current = undefined;
    };

    const hideToggle = () => {
      cancelPointerFrame();
      setVisible(false);
    };

    const trackPointer = (event: PointerEvent) => {
      const { clientX, clientY, pointerType } = event;
      cancelPointerFrame();

      pointerFrame.current = window.requestAnimationFrame(() => {
        pointerFrame.current = undefined;

        if (
          pointerType !== "mouse" ||
          window.innerWidth < 1024 ||
          !finePointerQuery.matches
        ) {
          setVisible(false);
          return;
        }

        const boundaryX = open ? desktopSidebarWidth : 0;
        if (Math.abs(clientX - boundaryX) > sidebarToggleProximity) {
          setVisible(false);
          return;
        }

        const maximumY = Math.max(
          sidebarToggleVerticalMargin,
          window.innerHeight - sidebarToggleVerticalMargin,
        );
        const toggleY = Math.min(
          Math.max(clientY, sidebarToggleVerticalMargin),
          maximumY,
        );

        buttonRef.current?.style.setProperty(
          "--docs-sidebar-toggle-y",
          `${toggleY}px`,
        );
        setVisible(true);
      });
    };

    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("blur", hideToggle);
    window.addEventListener("resize", hideToggle);
    finePointerQuery.addEventListener("change", hideToggle);
    document.documentElement.addEventListener("pointerleave", hideToggle);

    return () => {
      cancelPointerFrame();
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("blur", hideToggle);
      window.removeEventListener("resize", hideToggle);
      finePointerQuery.removeEventListener("change", hideToggle);
      document.documentElement.removeEventListener(
        "pointerleave",
        hideToggle,
      );
    };
  }, [open]);

  const label = open ? "Hide sidebar" : "Show sidebar";

  return (
    <button
      aria-controls="docs-sidebar"
      aria-expanded={open}
      aria-label={label}
      className={`docs-sidebar-toggle docs-sidebar-boundary-toggle ${
        visible ? "is-visible" : ""
      }`}
      onBlur={() => setVisible(false)}
      onClick={() => {
        setVisible(false);
        onToggle();
      }}
      onFocus={() => setVisible(true)}
      ref={buttonRef}
      title={label}
      type="button"
    >
      {open ? (
        <ChevronLeft aria-hidden="true" size={15} strokeWidth={1.75} />
      ) : (
        <ChevronRight aria-hidden="true" size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}

function DocsHeader({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="docs-page-header">
      <h1>{title}</h1>
      <div className="mt-5 max-w-3xl space-y-4 text-lg leading-8 text-slate-600">
        {children}
      </div>
    </header>
  );
}

function PageNavigation({
  previous,
  next,
}: {
  previous?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <nav className="page-navigation" aria-label="Documentation pages">
      {previous ? (
        <a href={previous.href}>
          <span>← Previous</span>
          <strong>{previous.label}</strong>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a className="text-right" href={next.href}>
          <span>Next →</span>
          <strong>{next.label}</strong>
        </a>
      )}
    </nav>
  );
}

function InstallationPage() {
  return (
    <>
      <DocsHeader title="Installation">
        <p>
          Delta is a React component library. Install it, load its generated
          stylesheet once, and then author formulas with ordinary TypeScript
          config objects.
        </p>
      </DocsHeader>

      <section className="docs-section">
        <h2>Install the package</h2>
        <p>
          Add Delta and its React peer dependencies to an existing React
          project.
        </p>
        <CodeBlock>npm install delta-dsl react react-dom</CodeBlock>
      </section>

      <section className="docs-section">
        <h2>Load the component styles</h2>
        <p>
          Import the stylesheet once from your application entry point. It
          contains the Formula, React Flow, labels, and step-control styles.
        </p>
        <CodeBlock language="tsx">{`import "delta-dsl/style.css";`}</CodeBlock>
      </section>

      <section className="docs-section">
        <h2>Start your app</h2>
        <p>
          Run your project&apos;s development server after installing Delta and
          importing its stylesheet.
        </p>
        <CodeBlock>{developmentServerCode}</CodeBlock>
        <div className="docs-note">
          If your project uses a different start command, use that command
          instead. Keep the Delta stylesheet imported by the entry point that
          renders your formulas.
        </div>
      </section>

      <PageNavigation
        next={{ href: "#/getting-started/config", label: "Config setup" }}
      />
    </>
  );
}

function ConfigSetupPage() {
  const steps = [
    ["1", "Define a config", "Start with formulas, variables, and semantics."],
    ["2", "Write the formula", "Add LaTeX and a unique id to formulas."],
    ["3", "Declare variables", "Match each key to an exact LaTeX token."],
    [
      "4",
      "Define semantics",
      "Read inputs and assign computed outputs through vars.",
    ],
    ["5", "Render it", "Place Formula inside Provider with the matching id."],
  ];

  return (
    <>
      <DocsHeader title="Config setup">
        <p>
          Build an interactive formula in five parts: define the config, write
          the LaTeX, declare its variables, add semantics, and render it. The
          example below creates <InlineCode>y = x + 1</InlineCode> and connects
          each layer through the same variable key.
        </p>
      </DocsHeader>

      <section className="docs-section">
        <h2>The five-step setup</h2>
        <div className="study-steps">
          {steps.map(([number, title, description]) => (
            <div className="study-step" key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-section">
        <h2>A complete config</h2>
        <CodeBlock language="tsx">
          {tutorialExamples["linear-config"].displaySource}
        </CodeBlock>
      </section>

      <section className="docs-section">
        <h2>Edit and preview the config</h2>
        <p>
          Edit the highlighted code between the locked delimiters; the
          surrounding code is read-only. Delta reparses the editable contents
          after every change and keeps the last valid preview visible while the
          syntax is incomplete. The preview renders with the
          <InlineCode>Provider</InlineCode> and{" "}
          <InlineCode>Formula</InlineCode> components.
        </p>
        <ConfigPlayground />
      </section>

      <section className="docs-section">
        <h2>One key connects all three layers</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>How the key x appears</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LaTeX</td>
                <td>
                  <InlineCode>x</InlineCode> in{" "}
                  <InlineCode>&quot;y = x + 1&quot;</InlineCode>
                </td>
              </tr>
              <tr>
                <td>Variables</td>
                <td>
                  <InlineCode>x: &#123; name, input, … &#125;</InlineCode>
                </td>
              </tr>
              <tr>
                <td>Semantics</td>
                <td>
                  <InlineCode>vars.x</InlineCode>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <PageNavigation
        previous={{
          href: "#/getting-started/installation",
          label: "Installation",
        }}
        next={{
          href: "#/getting-started/constructs",
          label: "Constructs",
        }}
      />
    </>
  );
}

function ConstructItem({ description, id, preset, title }: ConstructItemProps) {
  return (
    <article className="construct-item" id={id}>
      <h3>{title}</h3>
      <div className="construct-description">{description}</div>
      <SnippetPlayground preset={preset} title={title} />
    </article>
  );
}

function ConstructGuidePage() {
  return (
    <>
      <DocsHeader title="Constructs">
        <p>
          Build up an interactive formula one construct at a time. Start with
          formula and variable definitions, add computation and interactive
          inputs, then assemble a step-by-step walkthrough. Each example
          includes editable code and a live Delta preview.
        </p>
      </DocsHeader>

      <section className="construct-group" id="formula-constructs">
        <div className="construct-group-heading">
          <h2>Formulas and variable annotations</h2>
          <p>
            Define the formula first. Then annotate one variable, add the
            remaining exact LaTeX keys, and finish the static configuration
            with number formatting.
          </p>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="formula-entries"
            preset="formula"
            title="Formula entries and matching ids"
            description={
              <p>
                Start with only the formula entry. Give it a unique{" "}
                <InlineCode>id</InlineCode>, then use that same id in the
                rendered <InlineCode>Formula</InlineCode>. Variables and
                computation come later.
              </p>
            }
          />

          <ConstructItem
            id="names-and-values"
            preset="name-and-value"
            title="Annotate the first variable"
            description={
              <p>
                Add <InlineCode>m_2</InlineCode> first.{" "}
                <InlineCode>name</InlineCode> supplies its explanatory label,
                while <InlineCode>default</InlineCode> supplies the starting
                value. Every other token remains plain notation for now.
              </p>
            }
          />

          <ConstructItem
            id="latex-variable-keys"
            preset="variables"
            title="Add the remaining variables and LaTeX keys"
            description={
              <p>
                Keep the existing <InlineCode>m_2</InlineCode> annotation and
                add the remaining formula tokens. Keys must exactly match the
                formula: quote and double-escape LaTeX commands such as{" "}
                <InlineCode>\vec</InlineCode>, while subscripted keys such as{" "}
                <InlineCode>m_1</InlineCode> can be used directly.
              </p>
            }
          />

          <ConstructItem
            id="number-formatting"
            preset="number-formatting"
            title="Format displayed numbers"
            description={
              <p>
                With every variable declared, add{" "}
                <InlineCode>sigFigs</InlineCode> for significant figures and{" "}
                <InlineCode>precision</InlineCode> for decimal places. If both
                are present, <InlineCode>sigFigs</InlineCode> takes precedence.
              </p>
            }
          />
        </div>
      </section>

      <section className="construct-group" id="computation-constructs">
        <div className="construct-group-heading">
          <h2>Computation and interactive inputs</h2>
          <p>
            Continue from the completed variable configuration. Compute the
            output first, make one input draggable, then apply the same input
            construct to a second variable.
          </p>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="semantics"
            preset="semantics"
            title="Read and write values with semantics"
            description={
              <p>
                Add the first computation to the existing static formula. Read
                values from <InlineCode>vars</InlineCode>, then assign the
                computed force back to it. Use bracket notation for the LaTeX
                output key.
              </p>
            }
          />

          <ConstructItem
            id="drag-input"
            preset="drag-input"
            title="Make the first variable draggable"
            description={
              <p>
                Keep the computation unchanged and extend{" "}
                <InlineCode>m_2</InlineCode> with{" "}
                <InlineCode>input: &quot;drag&quot;</InlineCode>.{" "}
                <InlineCode>range</InlineCode> supplies its bounds and{" "}
                <InlineCode>step</InlineCode> supplies its increment.
              </p>
            }
          />

          <ConstructItem
            id="multiple-inputs"
            preset="multiple-inputs"
            title="Add a second interactive variable"
            description={
              <p>
                Preserve the draggable <InlineCode>m_2</InlineCode>, then add
                the same three input properties to <InlineCode>r</InlineCode>.
                The existing semantics function automatically reruns when
                either value changes.
              </p>
            }
          />

        </div>
      </section>

      <section className="construct-group" id="step-constructs">
        <div className="construct-group-heading">
          <h2>Step-by-step walkthroughs</h2>
          <p>
            Enable walkthrough mode and add its controls first. Then collect
            computation snapshots and progressively enrich them with
            descriptions, labels, and formatted values. Every{" "}
            <InlineCode>step()</InlineCode> call creates one snapshot.
          </p>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="step-enable"
            preset="step-enable"
            title="Enable stepping"
            description={
              <p>
                Set <InlineCode>stepping</InlineCode> to{" "}
                <InlineCode>true</InlineCode> before creating any snapshots.
                The semantics function still contains no{" "}
                <InlineCode>step()</InlineCode> calls at this stage.
              </p>
            }
          />

          <ConstructItem
            id="step-control"
            preset="step-control"
            title="Add the stepping UI"
            description={
              <p>
                Place <InlineCode>StepControl</InlineCode> inside the same
                provider before adding checkpoints. With no{" "}
                <InlineCode>step()</InlineCode> calls yet, the controls correctly
                show that there are no steps.
              </p>
            }
          />

          <ConstructItem
            id="step-first"
            preset="step-first"
            title="Collect the mass-product snapshot"
            description={
              <p>
                Call <InlineCode>step()</InlineCode> after a meaningful
                computation.
                Variable label keys show the values captured at that moment.
              </p>
            }
          />

          <ConstructItem
            id="step-description"
            preset="step-description"
            title="Descriptions and labels serve different roles"
            description={
              <p>
                Enrich the existing mass-product snapshot without adding
                another checkpoint. <InlineCode>description</InlineCode>{" "}
                narrates outside the formula, while{" "}
                <InlineCode>labels</InlineCode> attach values to it.
              </p>
            }
          />

          <ConstructItem
            id="step-expression"
            preset="step-expression"
            title="Label exact expression scopes"
            description={
              <p>
                A label key may be an exact LaTeX substring rather than a
                variable key. Use <InlineCode>m_1 m_2</InlineCode> to select and
                label that exact product expression.
              </p>
            }
          />

          <ConstructItem
            id="step-formatting"
            preset="step-formatting"
            title="Format computed values with latex()"
            description={
              <p>
                The helper produces mathematical label text with either
                significant figures or fixed decimal precision.
              </p>
            }
          />

          <ConstructItem
            id="step-distance"
            preset="step-distance"
            title="Add the distance-squared checkpoint"
            description={
              <p>
                Give the second checkpoint its own formatted narration and
                attach the captured radius value to <InlineCode>r</InlineCode>.
              </p>
            }
          />

          <ConstructItem
            id="step-force"
            preset="step-force"
            title="Add the final-force checkpoint"
            description={
              <p>
                The last checkpoint can combine narration, variable labels,
                expression labels, and differently formatted values.
              </p>
            }
          />

        </div>
      </section>

      <section className="construct-group" id="construct-reference">
        <div className="construct-group-heading">
          <h2>Quick reference</h2>
        </div>

        <h3 className="mb-3 text-lg font-medium">Variable properties</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Purpose</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {variableReference.map(([property, purpose, example]) => (
                <tr key={property}>
                  <td>
                    <InlineCode>{property}</InlineCode>
                  </td>
                  <td>{purpose}</td>
                  <td>
                    <InlineCode>{example}</InlineCode>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 mt-8 text-lg font-medium">Step contents</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Construct</th>
                <th>Purpose</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {stepReference.map(([construct, purpose, example]) => (
                <tr key={construct}>
                  <td>{construct}</td>
                  <td>{purpose}</td>
                  <td>
                    <InlineCode>{example}</InlineCode>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PageNavigation
        previous={{
          href: "#/getting-started/config",
          label: "Config setup",
        }}
      />
    </>
  );
}

export default function Docs({ page }: DocsProps) {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.localStorage.getItem("delta-docs-sidebar") !== "hidden",
  );

  useEffect(() => {
    window.localStorage.setItem(
      "delta-docs-sidebar",
      sidebarOpen ? "open" : "hidden",
    );
  }, [sidebarOpen]);

  useEffect(() => {
    if (page !== "constructs") return;

    const query = window.location.hash.split("?")[1];
    const section = new URLSearchParams(query).get("section");
    if (!section) return;

    window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView();
    });
  }, [page]);

  return (
    <div className={`docs-shell ${sidebarOpen ? "" : "docs-sidebar-hidden"}`}>
      <DocsSidebar
        hidden={!sidebarOpen}
        onHide={() => setSidebarOpen(false)}
        page={page}
      />
      <SidebarBoundaryToggle
        onToggle={() => setSidebarOpen((open) => !open)}
        open={sidebarOpen}
      />
      <main className="docs-main">
        {!sidebarOpen && (
          <button
            aria-controls="docs-sidebar"
            aria-expanded="false"
            aria-label="Show sidebar"
            className="docs-sidebar-restore docs-sidebar-static-restore"
            onClick={() => setSidebarOpen(true)}
            title="Show sidebar"
            type="button"
          >
            <PanelLeftOpen aria-hidden="true" size={18} strokeWidth={1.75} />
          </button>
        )}
        <div className="docs-article">
          {page === "installation" && <InstallationPage />}
          {page === "config" && <ConfigSetupPage />}
          {page === "constructs" && <ConstructGuidePage />}
        </div>
      </main>
    </div>
  );
}
