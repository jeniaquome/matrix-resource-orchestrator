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
        {/* Background gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="50%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#logoGradient)" />

        {/* Matrix grid pattern - interconnected nodes forming an M */}
        {/* Top row nodes */}
        <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="24" cy="12" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="36" cy="12" r="3" fill="white" fillOpacity="0.9" />

        {/* Middle row nodes */}
        <circle cx="12" cy="24" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="18" cy="18" r="2.5" fill="url(#accentGradient)" />
        <circle cx="30" cy="18" r="2.5" fill="url(#accentGradient)" />
        <circle cx="36" cy="24" r="3" fill="white" fillOpacity="0.9" />

        {/* Bottom row nodes */}
        <circle cx="12" cy="36" r="3" fill="white" fillOpacity="0.9" />
        <circle cx="24" cy="30" r="2.5" fill="url(#accentGradient)" />
        <circle cx="36" cy="36" r="3" fill="white" fillOpacity="0.9" />

        {/* Connecting lines forming M shape */}
        <path
          d="M12 12 L12 36 M12 12 L18 18 L24 30 M36 12 L30 18 L24 30 M36 12 L36 36"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Horizontal connections */}
        <path
          d="M12 12 L24 12 M24 12 L36 12"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.4"
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
      <defs>
        <linearGradient id="logoGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="50%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#115E59" />
        </linearGradient>
        <linearGradient id="accentGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#logoGradientIcon)" />

      <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.9" />
      <circle cx="24" cy="12" r="3" fill="white" fillOpacity="0.9" />
      <circle cx="36" cy="12" r="3" fill="white" fillOpacity="0.9" />
      <circle cx="12" cy="24" r="3" fill="white" fillOpacity="0.9" />
      <circle cx="18" cy="18" r="2.5" fill="url(#accentGradientIcon)" />
      <circle cx="30" cy="18" r="2.5" fill="url(#accentGradientIcon)" />
      <circle cx="36" cy="24" r="3" fill="white" fillOpacity="0.9" />
      <circle cx="12" cy="36" r="3" fill="white" fillOpacity="0.9" />
      <circle cx="24" cy="30" r="2.5" fill="url(#accentGradientIcon)" />
      <circle cx="36" cy="36" r="3" fill="white" fillOpacity="0.9" />

      <path
        d="M12 12 L12 36 M12 12 L18 18 L24 30 M36 12 L30 18 L24 30 M36 12 L36 36"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12 L24 12 M24 12 L36 12"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
