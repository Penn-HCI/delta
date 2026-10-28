import { Formula, Provider, StepControl, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-step-controls",
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
    var product = vars.m * vars.x;
    step({
      description: "Multiply the slope by x",
      labels: { mx: product },
    });
    step({
      description: "Add the intercept",
      labels: { b: vars.b },
    });
    vars.y = product + vars.b;
    step({
      description: "The sum is y",
      labels: { y: vars.y },
    });
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <div style={{ marginBottom: "24px" }}>
        {/* @delta-edit:start */}
        <StepControl />
        {/* @delta-edit:end */}
      </div>
      <Formula id="line-step-controls" />
    </Provider>
  );
}
