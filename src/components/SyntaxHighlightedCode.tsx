import { Fragment, memo, useMemo, type ReactNode } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

function renderTokenStream(
  stream: Prism.TokenStream,
  keyPath = "token",
): ReactNode {
  if (typeof stream === "string") return stream;

  if (Array.isArray(stream)) {
    return stream.map((part, index) => (
      <Fragment key={`${keyPath}-${index}`}>
        {renderTokenStream(part, `${keyPath}-${index}`)}
      </Fragment>
    ));
  }

  const aliases = Array.isArray(stream.alias)
    ? stream.alias
    : stream.alias
      ? [stream.alias]
      : [];

  return (
    <span className={["token", stream.type, ...aliases].join(" ")}>
      {renderTokenStream(stream.content, `${keyPath}-content`)}
    </span>
  );
}

export const SyntaxHighlightedCode = memo(function SyntaxHighlightedCode({
  source,
}: {
  source: string;
}) {
  const tokens = useMemo(
    () => Prism.tokenize(source, Prism.languages.tsx),
    [source],
  );

  return <>{renderTokenStream(tokens)}</>;
});
