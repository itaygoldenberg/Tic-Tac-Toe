import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./index.css";

// Vite's base ("/" or e.g. "/Tic-Tac-Toe/" on GitHub Pages) becomes the router's basename.
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter basename={ROUTER_BASENAME}>
            <App />
        </BrowserRouter>
    </StrictMode>
);
