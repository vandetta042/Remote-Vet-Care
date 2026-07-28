export default function AnimalIllustration({
    title = 'Friendly animal care',
    subtitle = 'A calm, supportive space for every animal.',
    species = 'Animal',
    imageSrc = null,
}) {
    return (
        <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-amber-200 via-orange-100 to-stone-50 shadow-lg">
            <div className="relative p-5">
                <div className="absolute right-5 top-5 rounded-full bg-white/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-stone-700">
                    {species}
                </div>

                <div className="relative mx-auto flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/30">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <svg
                            viewBox="0 0 480 360"
                            className="h-full w-full drop-shadow-[0_18px_30px_rgba(120,53,15,0.16)]"
                            role="img"
                            aria-label={title}
                        >
                        <defs>
                            <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fff7ed" />
                                <stop offset="100%" stopColor="#fdba74" />
                            </linearGradient>
                            <linearGradient id="fur" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fb923c" />
                                <stop offset="100%" stopColor="#7c2d12" />
                            </linearGradient>
                            <linearGradient id="blanket" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#f5f5f4" stopOpacity="0.65" />
                            </linearGradient>
                        </defs>

                        <rect x="20" y="30" width="440" height="300" rx="34" fill="url(#sunGlow)" />
                        <circle cx="360" cy="92" r="58" fill="#fff8dc" opacity="0.75" />
                        <circle cx="104" cy="92" r="20" fill="#fffdf7" opacity="0.9" />
                        <circle cx="130" cy="66" r="8" fill="#fed7aa" />
                        <circle cx="82" cy="132" r="10" fill="#ffedd5" />

                        <path
                            d="M88 243c52-37 104-54 152-54s97 17 152 54l-16 30c-44-24-85-37-136-37s-92 13-136 37z"
                            fill="url(#blanket)"
                        />

                        <ellipse cx="240" cy="198" rx="92" ry="74" fill="#fff7ed" />
                        <ellipse cx="240" cy="198" rx="76" ry="60" fill="#fffaf5" />
                        <ellipse cx="220" cy="188" rx="9" ry="13" fill="#7c2d12" />
                        <ellipse cx="260" cy="188" rx="9" ry="13" fill="#7c2d12" />
                        <path
                            d="M227 212c8 8 18 12 29 12s21-4 29-12"
                            fill="none"
                            stroke="#7c2d12"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />

                        <circle cx="172" cy="166" r="28" fill="url(#fur)" />
                        <circle cx="308" cy="166" r="28" fill="url(#fur)" />
                        <circle cx="166" cy="160" r="8" fill="#fff7ed" />
                        <circle cx="314" cy="160" r="8" fill="#fff7ed" />

                        <path
                            d="M156 138c-14 12-22 28-24 46l28 8c4-17 9-28 17-34z"
                            fill="#c2410c"
                        />
                        <path
                            d="M324 138c14 12 22 28 24 46l-28 8c-4-17-9-28-17-34z"
                            fill="#c2410c"
                        />

                        <path
                            d="M198 250c8 16 23 24 42 24s34-8 42-24"
                            fill="none"
                            stroke="#c2410c"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />

                        <g fill="#ffedd5" opacity="0.85">
                            <ellipse cx="136" cy="238" rx="12" ry="18" />
                            <ellipse cx="352" cy="238" rx="12" ry="18" />
                            <ellipse cx="162" cy="270" rx="10" ry="14" />
                            <ellipse cx="318" cy="270" rx="10" ry="14" />
                        </g>

                        <g fill="#fb923c" opacity="0.9">
                            <circle cx="84" cy="274" r="6" />
                            <circle cx="96" cy="286" r="4" />
                            <circle cx="396" cy="274" r="6" />
                            <circle cx="384" cy="286" r="4" />
                        </g>
                        </svg>
                    )}
                </div>

                <div className="mt-2 rounded-[1.5rem] bg-white/75 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                        {title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
}
