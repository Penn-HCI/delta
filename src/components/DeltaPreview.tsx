import { useCallback, useEffect, useRef, useState } from "react";

import {
  Formula,
  Provider,
  StepControl,
  useStore,
  type Config,
} from "delta-dsl";

type DeltaPreviewProps = {
  config: Config;
  formulaId: string;
  formulaHeight?: number;
  showSteps?: boolean;
};

function RefreshStepLayout() {
  const store = useStore();

  useEffect(() => {
    if (!store?.computationStore) return;

    const timeout = window.setTimeout(() => store.reinitialize(), 500);
    return () => window.clearTimeout(timeout);
  }, [store?.computationStore, store?.reinitialize]);

  return null;
}

export default function DeltaPreview({
  config,
  formulaId,
  formulaHeight = 260,
  showSteps = false,
}: DeltaPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const handleError = useCallback((message: string | null) => {
    setError(message);
  }, []);

  useEffect(() => setError(null), [config]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldRender) return;
    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "500px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      data-delta-preview={formulaId}
      ref={containerRef}
    >
      {shouldRender ? (
        <>
          {error && (
            <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Provider config={config} onError={handleError}>
            <div className="p-4 sm:p-5">
              {showSteps && <RefreshStepLayout />}
              {showSteps && (
                <div className="mb-3">
                  <StepControl />
                </div>
              )}
              <Formula
                id={formulaId}
                style={{ width: "100%", height: formulaHeight }}
              />
            </div>
          </Provider>
        </>
      ) : (
        <div
          aria-label="Delta preview loading"
          className="flex items-center justify-center bg-slate-50 text-sm text-slate-400"
          style={{ height: formulaHeight + (showSteps ? 72 : 40) }}
        >
          Loading preview…
        </div>
      )}
    </div>
  );
}
