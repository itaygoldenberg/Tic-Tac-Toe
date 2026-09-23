import { Link } from "react-router-dom";
import NeonTitle from "../../components/ui/NeonTitle";
import { PlayIcon } from "../../components/ui/icons";
import DecorativeBoard from "./DecorativeBoard";
import "./home.css";

export default function HomePage() {
    return (
        <section className="page home-page">
            <header className="page__header">
                <NeonTitle />
                <p className="page__subtitle">משחק איקס־עיגול פשוט מול המחשב</p>
            </header>

            <DecorativeBoard />

            <Link to="/game" className="btn btn--primary">
                <span>התחל לשחק</span>
                <PlayIcon className="btn__icon" />
            </Link>
        </section>
    );
}
