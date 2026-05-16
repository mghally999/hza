export function Logo({ className = '', mark = false }: { className?: string; mark?: boolean }) {
  if (mark) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hza-grad" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#1A4F9E" />
            <stop offset="100%" stopColor="#0B2150" />
          </linearGradient>
          <linearGradient id="hza-gold" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#F4D580" />
            <stop offset="100%" stopColor="#D4A017" />
          </linearGradient>
        </defs>
        {/* Outer ring evoking the target */}
        <circle cx="32" cy="32" r="29" stroke="url(#hza-grad)" strokeWidth="2.5" fill="#FAF6EC" />
        <circle cx="32" cy="32" r="20" stroke="url(#hza-gold)" strokeWidth="2" fill="none" opacity="0.6" />
        {/* H Z A monogram */}
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontFamily="ui-serif, Georgia"
          fontWeight="800"
          fontSize="22"
          fill="url(#hza-grad)"
          letterSpacing="-0.04em"
        >
          HZA
        </text>
        {/* Arrow accent */}
        <path d="M 46 22 L 56 17 L 53 24 Z" fill="url(#hza-gold)" />
        <path d="M 46 22 L 52 20" stroke="url(#hza-gold)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo mark className="h-9 w-9" />
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-wider text-navy">HZA</span>
        <span className="text-[9px] font-semibold tracking-[0.18em] text-navy/60 uppercase">
          Alhadf Alzaki
        </span>
      </div>
    </div>
  );
}
