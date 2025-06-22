import { createRoot } from "react-dom/client";
import App from "./App";
import Tag from "./Tag";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <App />
    <Tag />
  </>
);
