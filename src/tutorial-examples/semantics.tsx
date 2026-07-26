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
      default: 80,
      name: "Mass of Person",
      precision: 0,
    },
    r: {
      default: 6.371e6,
      name: "Earth's radius",
      sigFigs: 3,
    },
  },
  semantics: function ({ vars }) {
    /* @delta-edit:start */
    var product = vars.m_1 * vars.m_2;
    var squared = vars.r * vars.r;
    var force = (vars.G * product) / squared;
    vars["\\vec{F}"] = force;
    /* @delta-edit:end */
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
