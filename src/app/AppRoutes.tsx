import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../features/home/HomePage";
import GamePage from "../features/game/GamePage";
import AboutPage from "../features/about/AboutPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
