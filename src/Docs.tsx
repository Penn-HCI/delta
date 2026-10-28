import {
  Check,
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

import { ScrollControls } from "./components/ScrollControls";
import {
  ExamplePreview,
  SnippetPlayground,
  type PlaygroundPreset,
} from "./components/TutorialPlaygrounds";
import { SyntaxHighlightedCode } from "./components/SyntaxHighlightedCode";
import { assetUrl, playgroundUrl } from "./site";
import { tutorialExamples } from "./tutorial-examples";

type DocsNavLink = { id: string; label: string; href: string };

type ConstructItemProps = {
  description: ReactNode;
  id: string;
  preset: PlaygroundPreset;
  title: string;
};

const desktopSidebarWidth = 260;
const sidebarToggleProximity = 72;
const sidebarToggleVerticalMargin = 28;
// Hiding the sidebar is switched off for now; set to true to bring the controls back.
const sidebarCollapseEnabled = false;

const pageLinks: DocsNavLink[] = [
  {
    id: "overview",
    label: "Overview",
    href: "#/getting-started/overview",
  },
  {
    id: "quick-start",
    label: "Quick start",
    href: "#/getting-started/quick-start",
  },
];

// The sidebar lists the reference's groups, not each entry, so it reads as
// an outline of one page rather than a set of pages.
const referenceLinks: DocsNavLink[] = [
  { id: "variable-constructs", label: "Variables" },
  { id: "value-constructs", label: "Values and computation" },
  { id: "input-constructs", label: "Interactive inputs" },
  { id: "step-constructs", label: "Walkthroughs" },
  { id: "construct-reference", label: "Quick reference" },
].map((group) => ({
  ...group,
  href: `#/getting-started/language-reference?section=${group.id}`,
}));

// The sidebar is flat: captions name the groups, and every link sits at one level.
const navGroups = [
  { caption: "Getting started", links: pageLinks },
  { caption: "Language reference", links: referenceLinks },
];

// Sections in page order, for highlighting the link being read. The
// reference's intro has no link, so nothing is highlighted while it leads.
const spiedSections = [
  ...pageLinks.map((link) => link.id),
  "language-reference",
  ...referenceLinks.map((link) => link.id),
];

const createProjectCode = `npm create vite@latest my-delta-app -- --template react-ts
cd my-delta-app`;

// delta-dsl's peers require React 18, but new Vite projects start on React 19.
const installCode = `# install React 18
npm install react@18 react-dom@18 @types/react@18 @types/react-dom@18
# install Delta
npm install delta-dsl`;

// The copy button leaves the comment lines out: zsh, the default macOS shell,
// doesn't treat a pasted "#" line as a comment.
const installCommands = installCode.replace(/^#.*\n/gm, "");

const developmentServerCode = `npm run dev`;

const variableReference = [
  ["name", "Explanatory label", 'name: "Mass of Earth"'],
  ["default", "Initial value", "default: 5.972e24"],
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
  copyText = children,
  fullHeight = false,
  language = "plain",
}: {
  children: string;
  copyText?: string;
  fullHeight?: boolean;
  language?: "plain" | "tsx";
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const resetTimeout = useRef<number>();
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimeout.current);
    },
    [],
  );

  const handleCopy = async () => {
    window.clearTimeout(resetTimeout.current);

    try {
      await copyToClipboard(copyText);
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
        className="code-icon-button code-copy-button"
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
      <pre
        className={fullHeight ? "code-block code-block-full" : "code-block"}
        ref={codeRef}
      >
        <code>
          {language === "tsx" ? (
            <SyntaxHighlightedCode source={children} />
          ) : (
            children
          )}
        </code>
      </pre>
      <ScrollControls label="code" target={codeRef} />
    </div>
  );
}

function DocsSidebar({
  activeSection,
  hidden,
  onHide,
}: {
  activeSection: string;
  hidden: boolean;
  onHide: () => void;
}) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Every link stays on this page: update the address, then scroll.
  const handleSectionLink = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    window.history.replaceState(
      null,
      "",
      event.currentTarget.getAttribute("href"),
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
        {sidebarCollapseEnabled && (
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
        )}
      </div>

      <nav className="-mx-5 mt-5 border-t border-slate-200 px-5 pb-6 pt-6 lg:-mx-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-6">
        {navGroups.map((group) => (
          <div className="docs-nav-group" key={group.caption}>
            <p className="docs-nav-caption">{group.caption}</p>
            <div className="docs-nav-list">
              {group.links.map((link) => (
                <a
                  className={`docs-nav-link ${
                    activeSection === link.id ? "active" : ""
                  }`}
                  href={link.href}
                  key={link.id}
                  onClick={(event) => handleSectionLink(event, link.id)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
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
      <h2>{title}</h2>
      <div className="docs-page-intro">
        {children}
      </div>
    </header>
  );
}

function OverviewPart() {
  return (
    <>
      <DocsHeader title="Overview">
        <p>
          Delta is a language for creating interactive, augmented math
          formulas. You write a formula, create a TypeScript spec, and Delta
          renders a live interactive version of the formula.
        </p>
        <p>
          The language is meant to support the creation of interactive math
          explanations in web-based tutorials, textbooks, and explainers.
        </p>
        <p>
          The language supports many forms of interaction. Augmented formulas
          can behave like calculators, where readers drag a variable&apos;s
          value and other variables are computed, or as a walkthrough, where a
          user can step through a calculation one operation at a time. The
          language and an accompanying components library provide additional
          support for linking and keeping graphs and other content in sync with
          the formula.
        </p>
      </DocsHeader>
    </>
  );
}

function QuickStartPart() {
  return (
    <>
      <DocsHeader title="Quick start">
        <p>
          Follow these steps to create a new project containing a simple
          augmented formula.
        </p>
      </DocsHeader>

      <section className="docs-section">
        <h3>Create a project</h3>
        <CodeBlock>{createProjectCode}</CodeBlock>
      </section>

      <section className="docs-section">
        <h3>Install Delta</h3>
        <p>
          Delta requires React 18, but new Vite projects load React 19, so
          revert the React version before continuing.
        </p>
        <CodeBlock copyText={installCommands}>{installCode}</CodeBlock>
      </section>

      <section className="docs-section">
        <h3>Create a &quot;hello world&quot; app</h3>
        <p>
          Replace <InlineCode>src/App.tsx</InlineCode> with this file. Keep the
          stylesheet import at the top; it is required to render formulas
          properly.
        </p>
        <CodeBlock fullHeight language="tsx">
          {tutorialExamples["hello-world"].displaySource}
        </CodeBlock>
      </section>

      <section className="docs-section">
        <h3>Run it</h3>
        <p>Start the development server and open the address it prints.</p>
        <CodeBlock>{developmentServerCode}</CodeBlock>
        <p>
          This renders an interactive kinetic energy formula. In this formula,
          you can drag the mass or velocity values up or down and see how
          different values of the two parameters map to different amounts of
          kinetic energy.
        </p>
        <div className="docs-example-preview">
          <ExamplePreview preset="hello-world" />
        </div>
      </section>

      <section className="docs-section">
        <h3>The parts of the file</h3>
        <p>To make the formula your own, edit three parts of the config.</p>
        <ul className="docs-list">
          <li>
            <InlineCode>formulas</InlineCode> holds the LaTeX, with an{" "}
            <InlineCode>id</InlineCode> that the{" "}
            <InlineCode>Formula</InlineCode> component refers to.
          </li>
          <li>
            <InlineCode>variables</InlineCode> describes the symbols readers see
            or drag. Each key matches a symbol in the LaTeX exactly, here{" "}
            <InlineCode>K</InlineCode>, <InlineCode>m</InlineCode>, and{" "}
            <InlineCode>v</InlineCode>.
          </li>
          <li>
            <InlineCode>semantics</InlineCode> computes the outputs. It reads
            the inputs as <InlineCode>vars.m</InlineCode> and{" "}
            <InlineCode>vars.v</InlineCode>, sets{" "}
            <InlineCode>vars.K</InlineCode>, and reruns whenever an input
            changes.
          </li>
        </ul>
      </section>
    </>
  );
}

function ConstructItem({ description, id, preset, title }: ConstructItemProps) {
  return (
    <article className="construct-item" id={id}>
      <h4>{title}</h4>
      <div className="construct-description">{description}</div>
      <SnippetPlayground preset={preset} title={title} />
    </article>
  );
}

function LanguageReferencePart() {
  return (
    <>
      <DocsHeader title="Language reference">
        <p>
          Below we describe some of the core elements of the Delta language.
          Each element is covered with an editable, runnable example
          demonstrating its use.
        </p>
        <p>Note that Delta specifications are split into three sections:</p>
        <ul className="docs-list">
          <li>
            <InlineCode>formulas</InlineCode> contains the LaTeX for formulas
            and assigns the formulas IDs.
          </li>
          <li>
            <InlineCode>variables</InlineCode> describes how to augment
            variables in the formula. Each top-level key corresponds to one
            variable, and each value to a list of properties for augmenting the
            variable.
          </li>
          <li>
            <InlineCode>semantics</InlineCode> describes how to compute output
            values in a formula based on input values. It can be extended to
            create variable walkthroughs and to sample points for linked
            graphs.
          </li>
        </ul>
      </DocsHeader>

      <section className="construct-group" id="variable-constructs">
        <div className="construct-group-heading">
          <h3>Variables</h3>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="name"
            preset="name"
            title="Labels"
            description={
              <p>
                <InlineCode>name</InlineCode> attaches a label to a variable.
                Labels can be any string.
              </p>
            }
          />

          <ConstructItem
            id="variable-keys"
            preset="variable-keys"
            title="Variable keys"
            description={
              <p>
                Each key in <InlineCode>variables</InlineCode> is a reference to
                a variable from the LaTeX, and it must match the LaTeX exactly.
                Simple variables (e.g., <InlineCode>x</InlineCode>,{" "}
                <InlineCode>m_1</InlineCode>) can be referred to without
                quotes. Variables that contain LaTeX commands, such as{" "}
                <InlineCode>{"\\vec{F}"}</InlineCode>, must be quoted with
                backslashes escaped.
              </p>
            }
          />
        </div>
      </section>

      <section className="construct-group" id="value-constructs">
        <div className="construct-group-heading">
          <h3>Values and computation</h3>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="default-values"
            preset="default-values"
            title="Initial values"
            description={
              <p>
                <InlineCode>default</InlineCode> assigns a variable an initial
                value. Delta shows this value in a label next to the variable.
              </p>
            }
          />

          <ConstructItem
            id="semantics"
            preset="semantics"
            title="Computed values"
            description={
              <p>
                <InlineCode>semantics</InlineCode> function computes output
                variable values based on values from input values.{" "}
                <InlineCode>semantics</InlineCode> should be declared as a
                JavaScript function. The function takes a{" "}
                <InlineCode>vars</InlineCode> object as input, where there is a
                key for each variable. Each variable can be read or written
                using that key. Note that for values to be shown for a variable,
                they must be declared in the <InlineCode>variables</InlineCode>{" "}
                spec, as done for <InlineCode>{"y: {}"}</InlineCode>.
              </p>
            }
          />

          <ConstructItem
            id="number-formatting"
            preset="number-formatting"
            title="Number formatting"
            description={
              <p>
                <InlineCode>precision</InlineCode> sets how many decimal places
                are shown for a variable value. Use{" "}
                <InlineCode>sigFigs</InlineCode> instead to set the number of
                significant figures shown. If both are set,{" "}
                <InlineCode>sigFigs</InlineCode> takes precedence.
              </p>
            }
          />
        </div>
      </section>

      <section className="construct-group" id="input-constructs">
        <div className="construct-group-heading">
          <h3>Interactive inputs</h3>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="drag-input"
            preset="drag-input"
            title="Draggable values"
            description={
              <p>
                Set <InlineCode>input: &quot;drag&quot;</InlineCode> for a
                variable to let a reader set its values by dragging a value up
                or down.
              </p>
            }
          />

          <ConstructItem
            id="drag-range"
            preset="drag-range"
            title="Drag range"
            description={
              <p>
                <InlineCode>range</InlineCode> bounds the values that a variable
                can be set to.
              </p>
            }
          />

          <ConstructItem
            id="drag-step"
            preset="drag-step"
            title="Drag step"
            description={
              <p>
                <InlineCode>step</InlineCode> sets the increment of change as a
                value is dragged.
              </p>
            }
          />
        </div>
      </section>

      <section className="construct-group" id="step-constructs">
        <div className="construct-group-heading">
          <h3>Walkthroughs</h3>
        </div>

        <div className="construct-list">
          <ConstructItem
            id="walkthrough"
            preset="walkthrough"
            title="An example walkthrough"
            description={
              <>
                <p>
                  A formula can be turned into a walkthrough by adding three
                  elements. First, set the flag{" "}
                  <InlineCode>stepping: true</InlineCode>. Then, add a{" "}
                  <InlineCode>StepControl</InlineCode> inside the{" "}
                  <InlineCode>Provider</InlineCode> (see next example). Finally,
                  add at least one <InlineCode>step()</InlineCode> call in{" "}
                  <InlineCode>semantics</InlineCode> to define a step of the
                  walkthrough.
                </p>
                <p>
                  You can add an unbounded number of steps. Steps pause the
                  execution of the <InlineCode>semantics</InlineCode> function to
                  show one step of computation in the formula. Each step can
                  take several parameters, including a{" "}
                  <InlineCode>description</InlineCode> message that is shown
                  above the formula, and <InlineCode>labels</InlineCode> that
                  describe values of variables and expressions. Here is an
                  example of all the pieces working together. The later examples
                  describe each piece on its own.
                </p>
              </>
            }
          />

          <ConstructItem
            id="step-control"
            preset="step-control"
            title="Step controls"
            description={
              <p>
                <InlineCode>StepControl</InlineCode> is a React Component that
                adds a control panel for moving through the steps in a formula
                walkthrough. Place it inside the same Delta{" "}
                <InlineCode>Provider</InlineCode> as the formula.
              </p>
            }
          />

          <ConstructItem
            id="step-description"
            preset="step-description"
            title="Step descriptions"
            description={
              <p>
                <InlineCode>description</InlineCode> is a narrative message
                shown above the formula during a step.
              </p>
            }
          />

          <ConstructItem
            id="step-labels"
            preset="step-labels"
            title="Labels"
            description={
              <p>
                <InlineCode>labels</InlineCode> show messages in the margins of
                variables when a step is reached. They can include text,
                computed values, or a mixture. Each key in{" "}
                <InlineCode>labels</InlineCode> is a variable key, following the
                rules described in the variables section of this language
                reference. One can label composite expressions at the level
                above variables (for instance, try adding a label for{" "}
                <InlineCode>mx</InlineCode>).
              </p>
            }
          />

          <ConstructItem
            id="step-formatting"
            preset="step-formatting"
            title="Formatted values"
            description={
              <p>
                To format numbers in labels in walkthroughs, use{" "}
                <InlineCode>latex()</InlineCode> to apply LaTeX typesetting, and
                chain calls to <InlineCode>.precision()</InlineCode> and{" "}
                <InlineCode>.sigfigs()</InlineCode> to set the precision of
                numbers.
              </p>
            }
          />
        </div>
      </section>

      <section className="construct-group" id="construct-reference">
        <div className="construct-group-heading">
          <h3>Quick reference</h3>
        </div>

        <h4 className="docs-table-heading">Variable properties</h4>
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

        <h4 className="docs-table-heading">Step contents</h4>
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

      <div className="docs-section">
        <p>
          This language reference describes some of the most common language
          constructs. See the{" "}
          <a className="docs-link" href={playgroundUrl}>
            playground
          </a>{" "}
          for yet more examples that show how you can replace variables with
          dynamic SVGs, create sets of related formulas, and connect
          interactive formulas up to interactive charts.
        </p>
      </div>
    </>
  );
}

// Older addresses: Installation and Config setup became the quick start, and
// Constructs became the language reference.
const legacySectionIds: Record<string, string> = {
  installation: "quick-start",
  config: "quick-start",
  constructs: "language-reference",
  "formula-constructs": "variable-constructs",
  "computation-constructs": "value-constructs",
};

// The section a docs address points at: "?section=" wins, then the path.
function getTargetId() {
  const [path, query] = window.location.hash.slice(1).split("?");
  if (!path.startsWith("/getting-started")) return null;

  const id =
    new URLSearchParams(query).get("section") ||
    path.split("/")[2] ||
    "overview";
  return legacySectionIds[id] ?? id;
}

export default function Docs() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      !sidebarCollapseEnabled ||
      window.localStorage.getItem("delta-docs-sidebar") !== "hidden",
  );
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!sidebarCollapseEnabled) return;
    window.localStorage.setItem(
      "delta-docs-sidebar",
      sidebarOpen ? "open" : "hidden",
    );
  }, [sidebarOpen]);

  // Jump to the section in the address on load and on back/forward.
  useEffect(() => {
    const scrollToTarget = () => {
      const id = getTargetId();
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    };

    const frame = window.requestAnimationFrame(scrollToTarget);
    window.addEventListener("hashchange", scrollToTarget);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToTarget);
    };
  }, []);

  // Highlight the sidebar link for the section currently being read.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = spiedSections[0];
      for (const id of spiedSections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= window.innerHeight * 0.3) current = id;
      }
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className={`docs-shell ${sidebarOpen ? "" : "docs-sidebar-hidden"}`}>
      <DocsSidebar
        activeSection={activeSection}
        hidden={!sidebarOpen}
        onHide={() => setSidebarOpen(false)}
      />
      {sidebarCollapseEnabled && (
        <SidebarBoundaryToggle
          onToggle={() => setSidebarOpen((open) => !open)}
          open={sidebarOpen}
        />
      )}
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
          <h1 className="sr-only">Delta documentation</h1>
          <section className="docs-part" id="overview">
            <OverviewPart />
          </section>
          <section className="docs-part" id="quick-start">
            <QuickStartPart />
          </section>
          <section className="docs-part" id="language-reference">
            <LanguageReferencePart />
          </section>
        </div>
      </main>
    </div>
  );
}
