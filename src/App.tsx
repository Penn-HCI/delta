import { lazy, Suspense, useEffect, useState } from "react";

import { OperatorAsciiBackground } from "./components/OperatorAsciiBackground";
import { assetUrl, playgroundUrl } from "./site";

const Docs = lazy(() => import("./Docs"));

type Route = "home" | "installation" | "config" | "constructs";

const abstract =
  "Mathematical formulas can be difficult to understand, prompting ambitious tutorial authors to add interactive cues to help explain them. However, creating such visualizations is difficult and time-consuming using standard tools. To lower the threshold and raise the ceiling of formula explanations, we design and implement a domain-specific language for interactive formula explanation called Delta. It gives authors new facilities to imbue formulas with computability, explain them with step-by-step walkthroughs, and link manipulation across formulas, texts, and visuals. It is designed to integrate with LaTeX math in web-based writing contexts, with a runtime that handles necessary state management. The DSL's constructs are grounded in a review of formulas in public, polished interactive math texts. In two studies, we show that the DSL makes authoring of simple interactive formulas faster and easier and examine the fit of the language's numerous constructs to the task.";

function getRoute(): Route {
  const path = window.location.hash.slice(1).split("?")[0];

  if (path === "/getting-started/config") return "config";
  if (path === "/getting-started/constructs") return "constructs";
  if (path === "/getting-started" || path === "/getting-started/installation") {
    return "installation";
  }
  return "home";
}

function useRoute() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const update = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return route;
}

function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <OperatorAsciiBackground />
        <div className="hero-content site-width flex flex-col items-center py-20 text-center sm:py-28">
          <div className="flex items-center gap-4">
            <div className="delta-logo-mark size-10 rounded-xl">
              <img
                alt=""
                aria-hidden="true"
                className="h-[23px] w-auto"
                src={assetUrl("delta-mark.svg")}
              />
            </div>
            <span className="text-4xl font-regular tracking-tight text-slate-950">
              Delta
            </span>
          </div>
          <h1 className="mt-8 max-w-3xl text-3xl font-regular leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            A DSL for enlivening typeset formulas with interactive explanations.
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a className="button-primary" href="#/getting-started/installation">
              Getting Started
            </a>
            <a className="button-secondary" href={playgroundUrl}>
              Go to Playground
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="site-width py-10 sm:py-14">
          <img
            alt="Examples of interactive formulas authored with Delta"
            className="w-full rounded-2xl border border-slate-200 bg-white"
            src={assetUrl("images/teaser.png")}
          />
        </div>
      </section>

      <section className="site-width py-16 sm:py-20">
        <p className="mx-auto max-w-[640px] text-left text-base leading-8 text-slate-700">
          {abstract}
        </p>
      </section>

      <section className="site-width grid gap-4 pb-20 sm:grid-cols-2">
        <a className="link-card" href="#/getting-started/installation">
          <span className="eyebrow">Documentation</span>
          <strong>Learn Delta in three pages</strong>
          <span>
            Install the library, assemble a config, then explore every study
            construct. →
          </span>
        </a>
        <a className="link-card" href={playgroundUrl}>
          <span className="eyebrow">Sandbox</span>
          <strong>Explore the full Formula Editor</strong>
          <span>Open the permanent playground and try complete configs. ↗</span>
        </a>
        <a className="link-card" href={assetUrl("paper.pdf")}>
          <span className="eyebrow">Paper</span>
          <strong>Read the Delta research paper</strong>
          <span>Open the full paper as a PDF. →</span>
        </a>
        <article className="link-card">
          <span className="eyebrow">Study Materials</span>
          <strong>Explore the usability study materials</strong>
          <span>Tasks, guides, and supporting resources from the study.</span>
        </article>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200">
      <div className="site-width py-7 text-center text-base text-slate-600">
        Eric Dai · Zain Khan · Jeff Tao · Marti Hearst · Andrew Head
      </div>
    </footer>
  );
}

export default function App() {
  const route = useRoute();

  if (route !== "home") {
    return (
      <Suspense
        fallback={<div className="p-8 text-slate-500">Loading docs…</div>}
      >
        <Docs page={route} />
      </Suspense>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomePage />
      <Footer />
    </div>
  );
}
