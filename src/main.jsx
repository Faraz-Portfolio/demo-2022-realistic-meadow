import { createRoot } from "react-dom/client";
import App from "./App";
import { UI } from "./UI";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <App />
    <UI />
  </>
);
