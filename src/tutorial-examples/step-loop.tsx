import { Formula, Provider, StepControl, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "data-values",
      latex: "X",
    },
  ],
  variables: {
    X: {
      default: [10, 20, 30],
      name: "Data values",
    },
  },
  stepping: true,
  semantics: function ({ vars, step }) {
    /* @delta-edit:start */
    var xValues = vars.X;
    for (var i = 0; i < xValues.length; i++) {
      var xi = xValues[i];
      step({
        description: "Process value " + xi,
        labels: { X: xValues },
      });
    }
    /* @delta-edit:end */
  },
  fontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <div style={{ marginBottom: "24px" }}>
        <StepControl />
      </div>
      <Formula id="data-values" />
    </Provider>
  );
}
