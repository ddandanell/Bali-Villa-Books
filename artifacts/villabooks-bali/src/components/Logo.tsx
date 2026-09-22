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
  iconClassName = "w-8 h-8 sm:w-10 sm:h-10",
  textClassName = "",
  onDark = false,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      <LogoIcon className={iconClassName} onDark={onDark} />
      {variant === "full" && (
        <span
          className={`font-serif text-lg sm:text-2xl font-medium tracking-tight leading-none ${
            onDark ? "text-primary-foreground" : "text-primary"
          } ${textClassName}`}
        >
          Bali <span className="italic text-secondary">Accounting</span>
        </span>
      )}
    </span>
  );
}

export function LogoIcon({ className = "w-10 h-10", onDark = false }: { className?: string; onDark?: boolean }) {
  const bgFill = onDark ? "#08201C" : "#0B2B26"; // primary color variations
  
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-hidden="true"
      role="img"
    >
      <rect width="256" height="256" rx="64" fill={bgFill} />
      <path
        d="M70 148 L128 88 L186 148"
        stroke="#C86749" 
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="128" cy="68" r="10" fill="#C86749" />
      <line x1="80" y1="176" x2="176" y2="176" stroke="#F9F8F6" strokeWidth="12" strokeLinecap="round" />
      <line x1="80" y1="204" x2="176" y2="204" stroke="#F9F8F6" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}