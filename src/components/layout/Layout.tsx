import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export default function Layout() {
    return (
        <div className="app-shell">
            <div className="app-panel">
                <Navigation />
                <main className="app-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
