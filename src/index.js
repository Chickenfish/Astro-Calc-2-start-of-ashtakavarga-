import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AstroDataProvider } from "./AstroDataContext"; // Import the provider
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AstroDataProvider>
      <App />
    </AstroDataProvider>
  </StrictMode>,
);
