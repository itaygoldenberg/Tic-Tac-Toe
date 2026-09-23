import { RestartIcon } from "../../components/ui/icons";

export default function NewGameButton({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" className="btn btn--secondary" onClick={onClick}>
            <span>משחק חדש</span>
            <RestartIcon className="btn__icon" />
        </button>
    );
}
