import { Formula, Provider, type Config } from "delta-dsl";

const config: Config = {
  formulas: [
    {
      id: "gravity",
      latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
    },
  ],
  variables: {
    m_2: {
      default: 80,
      name: "Mass of Person",
    },
    /* @delta-edit:start */
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
    r: {
      default: 6.371e6,
      name: "Earth's radius",
    },
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
