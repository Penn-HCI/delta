import "delta-dsl/style.css";
import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  /* @delta-edit:start */
  formulas: [
    {
      id: "kinetic-energy",
      latex: "K = \\frac{1}{2}mv^2",
    },
  ],
  variables: {
    K: {
      name: "Kinetic Energy",
      precision: 1,
    },
    m: {
      name: "Mass",
      default: 5,
      input: "drag",
      range: [0, 20],
      step: 0.5,
    },
    v: {
      name: "Velocity",
      default: 2,
      input: "drag",
      range: [0, 10],
      step: 0.1,
    },
  },
  semantics: function ({ vars }) {
    vars.K = 0.5 * vars.m * Math.pow(vars.v, 2);
  },
  /* @delta-edit:end */
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function App() {
  return (
    <Provider config={config}>
      <Formula id="kinetic-energy" />
    </Provider>
  );
}
