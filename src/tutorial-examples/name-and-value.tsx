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
    m_2: {
      default: 80,
      name: "Mass of Person",
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
