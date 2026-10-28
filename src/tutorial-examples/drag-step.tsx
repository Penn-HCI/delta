import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-drag-step",
      latex: "y = mx + b",
    },
  ],
  variables: {
    y: {},
    m: { default: 2 },
    /* @delta-edit:start */
    x: { default: 3, input: "drag", range: [0, 10], step: 0.5 },
    /* @delta-edit:end */
    b: { default: 1 },
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
      <Formula id="line-drag-step" />
    </Provider>
  );
}
