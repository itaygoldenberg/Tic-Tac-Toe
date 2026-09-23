import { SoundOffIcon, SoundOnIcon } from "../../components/ui/icons";

interface MuteButtonProps {
    isMuted: boolean;
    onToggle: () => void;
}

export default function MuteButton({ isMuted, onToggle }: MuteButtonProps) {
    return (
        <button
            type="button"
            className="icon-btn mute-btn"
            aria-label="השתק צלילים"
            aria-pressed={isMuted}
            title={isMuted ? "הפעל צלילים" : "השתק צלילים"}
            onClick={onToggle}
        >
            {isMuted ? <SoundOffIcon className="icon-btn__icon" /> : <SoundOnIcon className="icon-btn__icon" />}
        </button>
    );
}
