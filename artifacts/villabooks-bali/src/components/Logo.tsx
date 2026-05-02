interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  /** Theme of surrounding surface — affects text color when using `currentColor` is undesirable */
  onDark?: boolean;
}

/**
 * Bali Accounting brand logo.
 * - Icon: rounded-square mark with a stylized villa roofline + sun + ledger lines
 * - Full: icon + wordmark
 */
export function Logo({
  variant = "full",
  className = "",
  iconClassName = "w-8 h-8 sm:w-9 sm:h-9",
  textClassName = "",
  onDark = true,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <LogoIcon className={iconClassName} />
      {variant === "full" && (
        <span
          className={`font-serif text-base sm:text-xl font-bold tracking-tight leading-none ${
            onDark ? "text-white" : "text-primary"
          } ${textClassName}`}
        >
          Bali <span className="text-secondary">Accounting</span>
        </span>
      )}
    </span>
  );
}

export function LogoIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-hidden="true"
      role="img"
    >
      <rect width="256" height="256" rx="56" fill="#0b1f1c" />
      <path
        d="M70 148 L128 88 L186 148"
        stroke="#e6b31a"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="128" cy="68" r="8" fill="#e6b31a" />
      <line x1="80" y1="176" x2="176" y2="176" stroke="#f5e9d3" strokeWidth="10" strokeLinecap="round" />
      <line x1="80" y1="200" x2="176" y2="200" stroke="#f5e9d3" strokeWidth="10" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
