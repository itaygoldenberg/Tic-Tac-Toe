import { GamepadIcon } from "../../components/ui/icons";
import "./about.css";

export default function AboutPage() {
    return (
        <section className="page about-page">
            <h1 className="page__title">אודות</h1>

            <div className="about-page__emblem">
                <GamepadIcon className="about-page__icon" />
            </div>

            <p className="about-page__credit">פותח על ידי איתי גולדנברג</p>
            <hr className="about-page__divider" />
        </section>
    );
}
