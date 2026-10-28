import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-step-labels",
      latex: "y = mx + b",
    },
  ],
  variables: {
    y: {},
    m: { default: 2 },
    x: { default: 3 },
    b: { default: 1 },
  },
  stepping: true,
  semantics: function ({ vars, step }) {
    /* @delta-edit:start */
    step({ labels: { x: vars.x } });
    /* @delta-edit:end */
    vars.y = vars.m * vars.x + vars.b;
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="line-step-labels" />
    </Provider>
  );
}
