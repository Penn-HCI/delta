import { lazy, Suspense, useEffect, useState } from "react";

import { OperatorAsciiBackground } from "./components/OperatorAsciiBackground";
import { UnderConstruction } from "./components/UnderConstruction";
import { VideoModal } from "./components/VideoModal";
import { ZoomableImage } from "./components/ZoomableImage";
import {
  assetUrl,
  playgroundUrl,
  showNumberBackground,
  underConstruction,
} from "./site";

const Docs = lazy(() => import("./Docs"));

type Route = "home" | "docs";

const abstract =
  "Many important mathematical ideas are described with formulas, but formulas can be difficult to understand. This has prompted some authors to embed formulas in interactive explanations that relate symbols to text, computation, and visualizations. However, implementing such designs with standard tools is difficult and time-consuming. To lower the threshold and raise the ceiling of formula explanations, we design and implement Delta, a TypeScript-embedded domain-specific language for creating interactive formula explanations. Delta gives authors the ability to turn formulas into calculators, explain them with step-by-step walkthroughs, and link symbols to nearby text and visual descriptions. It is designed to integrate with LaTeX math in web-based writing contexts, with a React-based runtime that handles necessary state management. In a controlled study, participants edited a simple interactive formula spec more quickly and easily with Delta than with a custom React baseline. In an observational study, participants largely found the language's constructs intuitive after an hour of continuous use.";

// Entries are links, or open the demo video. Entries with neither are listed
// with a "Soon" tag instead of a dead link.
const resourceLinks: Array<{
  label: string;
  href?: string;
  opensVideo?: boolean;
}> = [
  { label: "Getting started", href: "#/getting-started/overview" },
  { label: "Read the paper", href: assetUrl("paper.pdf") },
  { label: "Watch the demo video", opensVideo: true },
  { label: "Go to Playground", href: playgroundUrl },
  {
    label: "Supplemental materials",
    href: "https://github.com/ericdai5/delta-supplemental-materials",
  },
];

// The shaft stops short of the tip so its square cap doesn't blunt the point.
function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      fill="none"
      height={22}
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      width={22}
    >
      <path d="M5 12h13" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ResourceLinks({ onOpenVideo }: { onOpenVideo: () => void }) {
  const [highlight, setHighlight] = useState({
    top: 0,
    height: 0,
    visible: false,
    glide: false,
  });

  const moveTo = (link: HTMLElement) =>
    setHighlight((current) => ({
      top: link.offsetTop,
      height: link.offsetHeight,
      visible: true,
      // Glide only between links; a fresh hover should appear in place.
      glide: current.visible,
    }));

  const hide = () =>
    setHighlight((current) => ({ ...current, visible: false }));

  return (
    <nav
      aria-label="Project links"
      className="resource-links mb-8 lg:col-start-2 lg:row-start-2 lg:mb-0 lg:mt-2.5"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide();
      }}
      onMouseLeave={hide}
    >
      <span
        aria-hidden="true"
        className="resource-link-highlight"
        data-glide={highlight.glide}
        data-visible={highlight.visible}
        style={{
          height: highlight.height,
          transform: `translateY(${highlight.top}px)`,
        }}
      />
      {resourceLinks.map(({ label, href, opensVideo }) =>
        opensVideo ? (
          <button
            className="resource-link resource-link-button"
            key={label}
            onClick={onOpenVideo}
            onFocus={(event) => moveTo(event.currentTarget)}
            onMouseEnter={(event) => moveTo(event.currentTarget)}
            type="button"
          >
            <ArrowIcon />
            {label}
          </button>
        ) : href ? (
          <a
            className="resource-link"
            href={href}
            key={label}
            onFocus={(event) => moveTo(event.currentTarget)}
            onMouseEnter={(event) => moveTo(event.currentTarget)}
          >
            <ArrowIcon />
            {label}
          </a>
        ) : (
          <span
            className="resource-link resource-link-pending"
            key={label}
            onMouseEnter={hide}
          >
            <ArrowIcon />
            <span>
              {label} <span className="resource-link-soon">Soon</span>
            </span>
          </span>
        ),
      )}
    </nav>
  );
}

function getRoute(): Route {
  const path = window.location.hash.slice(1).split("?")[0];

  // The docs are one page; it scrolls to the section named in the path.
  if (path === "/getting-started" || path.startsWith("/getting-started/")) {
    return "docs";
  }
  return "home";
}

function useRoute() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const update = () => {
      const next = getRoute();
      setRoute(next);
      if (next === "home") window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return route;
}

function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-content site-width">
          <div className="py-4 sm:py-5">
            <h1 className="home-title">
              Delta: A DSL for enlivening typeset formulas with interactive
              explanations
            </h1>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="abstract-heading"
        className="site-width pb-8 pt-4 sm:pb-10 sm:pt-6"
      >
        <div className="grid gap-x-16 text-left lg:grid-cols-[minmax(0,44rem)_14rem] lg:justify-between">
          {/* First in the DOM so phones show the links above the abstract. */}
          <ResourceLinks onOpenVideo={() => setIsVideoOpen(true)} />
          <h2 className="section-title" id="abstract-heading">
            Abstract
          </h2>
          <p className="mt-3 text-base leading-8 text-slate-700 lg:col-start-1 lg:row-start-2">
            {abstract}
          </p>
        </div>
      </section>

      <section>
        <div className="site-width pb-16 pt-4 sm:pb-20 sm:pt-6">
          <ZoomableImage
            alt="Eight interactive formulas authored with Delta, from a kinetic energy calculator to a gradient descent walkthrough with a linked graph"
            height={2220}
            src={assetUrl("images/homepage.png")}
            width={6059}
          />
        </div>
      </section>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        src={assetUrl("videos/delta-demo.mp4")}
        title="Delta demo video"
      />
    </main>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="site-width py-7 text-center text-base text-slate-600">
        Eric Dai · Zain Khan · Jeff Tao · Marti Hearst · Andrew Head
      </div>
    </footer>
  );
}

export default function App() {
  const route = useRoute();

  if (underConstruction) return <UnderConstruction />;

  if (route !== "home") {
    return (
      <Suspense
        fallback={<div className="p-8 text-slate-500">Loading docs…</div>}
      >
        <Docs />
      </Suspense>
    );
  }

  return (
    <div className="home-shell flex min-h-screen flex-col">
      {showNumberBackground && <OperatorAsciiBackground />}
      <HomePage />
      <Footer />
    </div>
  );
}
