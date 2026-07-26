import { Brain, Microscope, ScrollText, TreePalm } from "lucide-react";
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
        <div className="hero-content site-width flex flex-col items-center pb-10 pt-20 text-center sm:pb-12 sm:pt-28">
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
            A DSL for enlivening typeset formulas with interactive explanations
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

      <section>
        <div className="site-width pb-4 pt-4 sm:pb-6 sm:pt-6">
          <img
            alt="Examples of interactive formulas authored with Delta"
            className="w-full"
            src={assetUrl("images/homepage.png")}
          />
        </div>
      </section>

      <section className="site-width pb-16 pt-8 sm:pb-20 sm:pt-10">
        <p className="mx-auto max-w-[640px] text-left text-base leading-8 text-slate-700">
          {abstract}
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-[388px] grid-cols-2 gap-2 px-5 pb-20 lg:max-w-[768px] lg:grid-cols-4 lg:gap-4">
        <a className="link-card" href="#/getting-started/installation">
          <Brain
            aria-hidden="true"
            className="link-card-icon"
            size={32}
            strokeWidth={1.75}
          />
          <strong>Learn the basics of Delta</strong>
        </a>
        <a className="link-card" href={playgroundUrl}>
          <TreePalm
            aria-hidden="true"
            className="link-card-icon"
            size={32}
            strokeWidth={1.75}
          />
          <strong>Explore the playground</strong>
        </a>
        <a className="link-card" href={assetUrl("paper.pdf")}>
          <ScrollText
            aria-hidden="true"
            className="link-card-icon"
            size={32}
            strokeWidth={1.75}
          />
          <strong>Read the research paper</strong>
        </a>
        <article className="link-card">
          <Microscope
            aria-hidden="true"
            className="link-card-icon"
            size={32}
            strokeWidth={1.75}
          />
          <strong>Explore the study materials</strong>
        </article>
      </section>
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
    <div className="home-shell flex min-h-screen flex-col">
      <OperatorAsciiBackground />
      <HomePage />
      <Footer />
    </div>
  );
}
