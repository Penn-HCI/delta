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
    },
    G: {
      default: 6.674e-11,
      name: "Gravitational Constant",
    },
    m_1: {
      default: 5.972e24,
      name: "Mass of Earth",
    },
    m_2: {
      /* @delta-edit:start */
      default: 80,
      name: "Mass of Person",
      /* @delta-edit:end */
    },
    r: {
      default: 6.371e6,
      name: "Earth's radius",
    },
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
