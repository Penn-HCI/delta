import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "line-labels",
      latex: "y = mx + b",
    },
  ],
  variables: {
    /* @delta-edit:start */
    m: { name: "Slope" },
    /* @delta-edit:end */
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="line-labels" />
    </Provider>
  );
}
