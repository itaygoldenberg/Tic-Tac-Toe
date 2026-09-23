interface IconProps {
    className?: string;
}

export function PlayIcon({ className }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
        </svg>
    );
}

export function GamepadIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 18h24c8.8 0 14 6 15.4 15.6l1.4 9.6c.9 6-6.4 9.8-10.8 5.6L42 41H22l-8 7.8c-4.4 4.2-11.7.4-10.8-5.6l1.4-9.6C6 24 11.2 18 20 18z" />
            <path d="M18 27v10M13 32h10" />
            <circle cx="44" cy="28" r="1.8" fill="currentColor" />
            <circle cx="50" cy="33" r="1.8" fill="currentColor" />
            <circle cx="44" cy="38" r="1.8" fill="currentColor" />
            <circle cx="38" cy="33" r="1.8" fill="currentColor" />
        </svg>
    );
}
