import ReactDOM from "react-dom/client";

import "delta-dsl/style.css";
import "./index.css";
import App from "./App";
import { startAnalytics } from "./analytics";
import { redirectHashAddress } from "./routes";

// Old "#/" links move to their real path first, so the page and its page view
// both use it.
redirectHashAddress();
startAnalytics();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
