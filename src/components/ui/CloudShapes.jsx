export function TechCloud({ size, className }) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 64 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 31h-3.5a7.5 7.5 0 0 1-1-14.9 9 9 0 0 1 3.6-6.9 9 9 0 0 1 12.9 2A9.5 9.5 0 0 1 33 8.5a9.5 9.5 0 0 1 9 5.2 8 8 0 0 1 6.8 3.1A7.6 7.6 0 0 1 51 24a7 7 0 0 1-2 5A7.4 7.4 0 0 1 44 31H16z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 31h-3.5a7.5 7.5 0 0 1-1-14.9 9 9 0 0 1 3.6-6.9 9 9 0 0 1 12.9 2A9.5 9.5 0 0 1 33 8.5a9.5 9.5 0 0 1 9 5.2 8 8 0 0 1 6.8 3.1A7.6 7.6 0 0 1 51 24a7 7 0 0 1-2 5A7.4 7.4 0 0 1 44 31H16z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.5"
        strokeDasharray="1.5 2.5"
        strokeLinejoin="round"
        transform="scale(0.9) translate(3.2, 1.6)"
      />
      <circle cx="23" cy="10.5" r="1.3" fill="currentColor" opacity="0.7" />
      <circle cx="38.5" cy="9.5" r="1.3" fill="currentColor" opacity="0.7" />
      <circle cx="47" cy="16" r="1.1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function SoftCloud({ size, className }) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 64 40"
      className={className}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <ellipse cx="14" cy="28" rx="10" ry="7.5" />
        <ellipse cx="23" cy="23" rx="12" ry="9.5" />
        <ellipse cx="35" cy="18" rx="15" ry="12.5" />
        <ellipse cx="47" cy="24" rx="12" ry="9.5" />
        <ellipse cx="55" cy="28.5" rx="8.5" ry="6.5" />
        <rect x="12" y="24" width="44" height="11" rx="5.5" />
      </g>
      <g fill="#ffffff" opacity="0.14">
        <ellipse cx="30" cy="14" rx="9" ry="6" />
        <ellipse cx="18" cy="21" rx="5" ry="3.5" />
      </g>
      <g fill="#000000" opacity="0.1">
        <ellipse cx="35" cy="33" rx="20" ry="4" />
      </g>
    </svg>
  );
}
