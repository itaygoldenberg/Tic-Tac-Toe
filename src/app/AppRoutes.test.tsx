import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AppRoutes from "./AppRoutes";

function renderAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
        </MemoryRouter>
    );
}

function getNavLink(name: string) {
    const nav = screen.getByRole("navigation", { name: "ניווט ראשי" });
    const links = Array.from(nav.querySelectorAll("a"));
    const link = links.find((element) => element.textContent === name);
    if (!link) throw new Error(`Nav link "${name}" not found`);
    return link;
}

describe("screens", () => {
    it("renders the home screen at /", () => {
        renderAt("/");

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("איקס עיגול");
        expect(screen.getByText("משחק איקס־עיגול פשוט מול המחשב")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "התחל לשחק" })).toHaveAttribute("href", "/game");
    });

    it("renders the game screen with an empty 3×3 board at /game", () => {
        renderAt("/game");

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("איקס עיגול");
        const board = screen.getByRole("group", { name: "לוח המשחק" });
        const cells = board.querySelectorAll("button");
        expect(cells).toHaveLength(9);
        cells.forEach((cell) => expect(cell).toBeEmptyDOMElement());
    });

    it("renders the about screen at /about", () => {
        renderAt("/about");

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("אודות");
        expect(screen.getByText("פותח על ידי איתי גולדנברג")).toBeInTheDocument();
    });

    it("redirects unknown routes to the home screen", () => {
        renderAt("/does-not-exist");

        expect(screen.getByText("משחק איקס־עיגול פשוט מול המחשב")).toBeInTheDocument();
    });
});

describe("navigation", () => {
    it.each([
        ["/", "בית"],
        ["/game", "משחק"],
        ["/about", "אודות"]
    ])("shows all three links on %s and marks %s as active", (path, activeLabel) => {
        renderAt(path);

        for (const label of ["בית", "משחק", "אודות"]) {
            const link = getNavLink(label);
            if (label === activeLabel) {
                expect(link).toHaveAttribute("aria-current", "page");
            } else {
                expect(link).not.toHaveAttribute("aria-current");
            }
        }
    });

    it("moves between all screens through the menu", () => {
        renderAt("/");

        fireEvent.click(getNavLink("משחק"));
        expect(screen.getByRole("group", { name: "לוח המשחק" })).toBeInTheDocument();

        fireEvent.click(getNavLink("אודות"));
        expect(screen.getByText("פותח על ידי איתי גולדנברג")).toBeInTheDocument();

        fireEvent.click(getNavLink("בית"));
        expect(screen.getByText("משחק איקס־עיגול פשוט מול המחשב")).toBeInTheDocument();
    });

    it("goes to the game screen from the start button", () => {
        renderAt("/");

        fireEvent.click(screen.getByRole("link", { name: "התחל לשחק" }));

        expect(screen.getByRole("group", { name: "לוח המשחק" })).toBeInTheDocument();
        expect(getNavLink("משחק")).toHaveAttribute("aria-current", "page");
    });
});
