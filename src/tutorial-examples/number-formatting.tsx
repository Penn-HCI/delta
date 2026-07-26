import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "gravity",
      latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
    },
  ],
  variables: {
    /* @delta-edit:start */
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
    /* @delta-edit:end */
  },
  semantics: function ({ vars }) {
    var force = (vars.G * vars.m_1 * vars.m_2) / (vars.r * vars.r);
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
