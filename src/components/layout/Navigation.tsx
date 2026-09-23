import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/", label: "בית" },
    { to: "/game", label: "משחק" },
    { to: "/about", label: "אודות" }
] as const;

export default function Navigation() {
    return (
        <nav className="nav" aria-label="ניווט ראשי">
            <ul className="nav__list">
                {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                        <NavLink to={item.to} end className="nav__link">
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
