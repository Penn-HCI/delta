import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  /* @delta-edit:start */
  formulas: [
    {
      id: "linear-formula",
      latex: "y = x + 1",
    },
  ],
  variables: {
    y: {
      name: "Y Value",
    },
    x: {
      input: "drag",
      default: 3,
      range: [-10, 10],
      step: 0.5,
      name: "X Value",
    },
  },
  semantics: function ({ vars }) {
    vars.y = vars.x + 1;
  },
  /* @delta-edit:end */
};

function App() {
  return (
    <Provider config={config}>
      <Formula
        id="linear-formula"
        style={{ height: "300px", width: "700px" }}
      />
    </Provider>
  );
}

export default App;
