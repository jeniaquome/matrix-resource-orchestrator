'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = false, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-sm' },
    md: { icon: 40, text: 'text-base' },
    lg: { icon: 56, text: 'text-xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Solid background */}
        <rect x="2" y="2" width="44" height="44" rx="10" fill="#0F766E" />

        {/* Matrix grid pattern - interconnected nodes forming an M */}
        {/* Top row nodes */}
        <circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.95" />
        <circle cx="24" cy="12" r="2.5" fill="white" fillOpacity="0.95" />
        <circle cx="36" cy="12" r="2.5" fill="white" fillOpacity="0.95" />

        {/* Middle row nodes */}
        <circle cx="12" cy="24" r="2.5" fill="white" fillOpacity="0.95" />
        <circle cx="18" cy="18" r="2" fill="white" fillOpacity="0.7" />
        <circle cx="30" cy="18" r="2" fill="white" fillOpacity="0.7" />
        <circle cx="36" cy="24" r="2.5" fill="white" fillOpacity="0.95" />

        {/* Bottom row nodes */}
        <circle cx="12" cy="36" r="2.5" fill="white" fillOpacity="0.95" />
        <circle cx="24" cy="30" r="2" fill="white" fillOpacity="0.7" />
        <circle cx="36" cy="36" r="2.5" fill="white" fillOpacity="0.95" />

        {/* Connecting lines forming M shape */}
        <path
          d="M12 12 L12 36 M12 12 L18 18 L24 30 M36 12 L30 18 L24 30 M36 12 L36 36"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Horizontal connections */}
        <path
          d="M12 12 L24 12 M24 12 L36 12"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-slate-900 ${text} leading-tight`}>
            MRO
          </span>
          <span className="text-xs text-slate-500 leading-tight">
            Matrix Orchestrator
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="44" height="44" rx="10" fill="#0F766E" />

      <circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="24" cy="12" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="36" cy="12" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="12" cy="24" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="18" cy="18" r="2" fill="white" fillOpacity="0.7" />
      <circle cx="30" cy="18" r="2" fill="white" fillOpacity="0.7" />
      <circle cx="36" cy="24" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="12" cy="36" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="24" cy="30" r="2" fill="white" fillOpacity="0.7" />
      <circle cx="36" cy="36" r="2.5" fill="white" fillOpacity="0.95" />

      <path
        d="M12 12 L12 36 M12 12 L18 18 L24 30 M36 12 L30 18 L24 30 M36 12 L36 36"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12 L24 12 M24 12 L36 12"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
