import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-number-formatting",
      latex: "y = mx + b",
    },
  ],
  variables: {
    /* @delta-edit:start */
    y: { precision: 1 },
    /* @delta-edit:end */
    m: { default: 2 },
    x: { default: 3 },
    b: { default: 1.2 },
  },
  semantics: function ({ vars }) {
    vars.y = vars.m * vars.x + vars.b;
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="line-number-formatting" />
    </Provider>
  );
}
