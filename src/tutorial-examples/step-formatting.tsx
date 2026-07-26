import { Formula, Provider, StepControl, type Config } from "delta-dsl";

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
      precision: 0,
      input: "drag",
      range: [1, 200],
      step: 1,
    },
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
    r: {
      default: 6.371e6,
      name: "Earth's radius",
      sigFigs: 3,
      input: "drag",
      range: [1e6, 1e7],
      step: 1e4,
    },
  },
  stepping: true,
  semantics: function ({ vars, step, latex }) {
    var product = vars.m_1 * vars.m_2;
    step({
      description: "Multiply the two masses",
      /* @delta-edit:start */
      labels: {
        m_1: vars.m_1,
        m_2: vars.m_2,
        "m_1 m_2": latex(product).sigfigs(3),
      },
      /* @delta-edit:end */
    });

    var squared = vars.r * vars.r;
    var force = (vars.G * product) / squared;
    vars["\\vec{F}"] = force;
  },
  fontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <div style={{ marginBottom: "24px" }}>
        <StepControl />
      </div>
      <Formula id="gravity" />
    </Provider>
  );
}
