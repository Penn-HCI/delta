import { assetUrl } from "../site";
import { OperatorAsciiBackground } from "./OperatorAsciiBackground";

export function UnderConstruction() {
  return (
    <div className="home-shell flex min-h-screen flex-col">
      <OperatorAsciiBackground />
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <div className="flex items-center gap-4">
          <div className="delta-logo-mark size-10 rounded-xl">
            <img
              alt=""
              aria-hidden="true"
              className="h-[23px] w-auto"
              src={assetUrl("delta-mark.svg")}
            />
          </div>
          <span className="text-4xl tracking-tight text-slate-950">Delta</span>
        </div>
        <h1 className="mt-8 text-3xl leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Under construction
        </h1>
        <p className="mt-5 max-w-md text-balance text-base leading-7 text-slate-600">
          This site is still being built. Please check back soon.
        </p>
      </main>
    </div>
  );
}
