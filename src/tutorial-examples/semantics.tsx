import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-computed-values",
      latex: "y = mx + b",
    },
  ],
  variables: {
    y: {},
    m: { default: 2 },
    x: { default: 3 },
    b: { default: 1 },
  },
  /* @delta-edit:start */
  semantics: function ({ vars }) {
    vars.y = vars.m * vars.x + vars.b;
  },
  /* @delta-edit:end */
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="line-computed-values" />
    </Provider>
  );
}
