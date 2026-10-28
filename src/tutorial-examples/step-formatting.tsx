import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-formatted-values",
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
  semantics: function ({ vars, step, latex }) {
    var product = vars.m * vars.x;
    /* @delta-edit:start */
    step({ labels: { mx: latex(product).precision(1) } });
    /* @delta-edit:end */
    vars.y = product + vars.b;
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="line-formatted-values" />
    </Provider>
  );
}
