import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "gravity",
      latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
    },
  ],
  variables: {
    "\\vec{F}": {
      name: "Gravitational Force",
      precision: 2,
    },
    G: {
      default: 6.674e-11,
      name: "Gravitational Constant",
      sigFigs: 3,
    },
    m_1: {
      default: 5.972e24,
      name: "Mass of Earth",
      sigFigs: 3,
    },
    m_2: {
      input: "drag",
      default: 80,
      range: [1, 200],
      step: 1,
      name: "Mass of Person",
      precision: 0,
    },
    r: {
      /* @delta-edit:start */
      input: "drag",
      default: 6.371e6,
      range: [1e6, 1e7],
      step: 1e4,
      name: "Earth's radius",
      sigFigs: 3,
      /* @delta-edit:end */
    },
  },
  semantics: function ({ vars }) {
    var product = vars.m_1 * vars.m_2;
    var squared = vars.r * vars.r;
    var force = (vars.G * product) / squared;
    vars["\\vec{F}"] = force;
  },
  fontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="gravity" />
    </Provider>
  );
}
