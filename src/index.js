import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import { createApolloClient } from "./services/apollo/client";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App client={createApolloClient()} />
  </React.StrictMode>
);

reportWebVitals();
