import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-starting-values",
      latex: "y = mx + b",
    },
  ],
  variables: {
    /* @delta-edit:start */
    m: { default: 2 },
    x: { default: 3 },
    b: { default: 1 },
    /* @delta-edit:end */
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="line-starting-values" />
    </Provider>
  );
}
