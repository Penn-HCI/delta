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
    "\\vec{F}": { name: "Force" },
    m_1: { name: "Mass of Earth" },
    m_2: { name: "Mass of person" },
    /* @delta-edit:end */
  },
  fontSize: 2.5,
  labelFontSize: 1.5,
};

export default function Example() {
  return (
    <Provider config={config}>
      <Formula id="gravity" />
    </Provider>
  );
}
