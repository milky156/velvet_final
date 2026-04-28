import React from "react";

export function BouquetHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cartoon florist holding a bouquet"
    >
      <defs>
        <linearGradient id="vv_bg" x1="60" y1="20" x2="460" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff0f6" />
          <stop offset="1" stopColor="#ffe3f0" />
        </linearGradient>
        <linearGradient id="vv_bouquet" x1="260" y1="70" x2="260" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff4fa3" />
          <stop offset="1" stopColor="#b81b63" />
        </linearGradient>
        <linearGradient id="vv_wrap" x1="290" y1="120" x2="240" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffaf5" />
          <stop offset="1" stopColor="#ffd1e6" />
        </linearGradient>
      </defs>

      <rect x="18" y="18" width="484" height="264" rx="26" fill="url(#vv_bg)" stroke="#ffb6d9" />

      <circle cx="170" cy="105" r="40" fill="#ffe5ef" stroke="#ffb6d9" />
      <path
        d="M154 106c10-16 30-18 40 0"
        stroke="#601b3c"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M160 112c6 10 18 12 24 0"
        stroke="#601b3c"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="155" cy="100" r="3.8" fill="#601b3c" />
      <circle cx="185" cy="100" r="3.8" fill="#601b3c" />

      <path
        d="M140 150c16-8 48-8 64 0 10 5 16 16 16 28v64c0 16-13 29-29 29h-38c-16 0-29-13-29-29v-64c0-12 6-23 16-28Z"
        fill="#ff6fb3"
        opacity="0.28"
      />
      <path
        d="M132 160c18-10 56-10 74 0 14 8 22 23 22 39v59c0 14-11 25-25 25h-43c-14 0-25-11-25-25v-59c0-16 8-31 22-39Z"
        fill="#fff"
        stroke="#ffb6d9"
      />

      <path
        d="M140 198c14-14 28-16 44-8 15 7 25 4 36-7"
        stroke="#b81b63"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <g transform="translate(240 60)">
        <path
          d="M48 162 6 100c-3-5 1-12 7-12h140c6 0 10 7 7 12l-42 62c-13 19-34 31-57 31s-44-12-57-31Z"
          fill="url(#vv_wrap)"
          stroke="#ffb6d9"
        />
        <path d="M26 96c16 20 42 32 70 32s54-12 70-32" stroke="#ffb6d9" strokeWidth="5" />
        <path d="M96 126l-16 56" stroke="#b81b63" strokeWidth="5" strokeLinecap="round" />
        <path d="M96 126l20 56" stroke="#b81b63" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M96 170c-10 0-18 6-18 14s8 14 18 14 18-6 18-14-8-14-18-14Z"
          fill="#ff4fa3"
          opacity="0.75"
        />

        <g>
          <circle cx="56" cy="56" r="22" fill="#ff4fa3" opacity="0.9" />
          <circle cx="56" cy="56" r="10" fill="#fff0f6" />
          <circle cx="100" cy="44" r="24" fill="#ff86bf" opacity="0.9" />
          <circle cx="100" cy="44" r="11" fill="#fff0f6" />
          <circle cx="144" cy="60" r="22" fill="#d81b73" opacity="0.9" />
          <circle cx="144" cy="60" r="10" fill="#fff0f6" />
          <circle cx="84" cy="78" r="22" fill="#ff4fa3" opacity="0.85" />
          <circle cx="84" cy="78" r="10" fill="#fff0f6" />
          <circle cx="120" cy="86" r="22" fill="#ff86bf" opacity="0.85" />
          <circle cx="120" cy="86" r="10" fill="#fff0f6" />
        </g>

        <g opacity="0.95">
          <path d="M26 74c14-18 36-28 60-28" stroke="#1f9d6a" strokeWidth="7" strokeLinecap="round" />
          <path d="M166 76c-10-18-30-30-54-32" stroke="#1f9d6a" strokeWidth="7" strokeLinecap="round" />
          <path d="M66 104c-10 16-28 26-48 26" stroke="#26b07a" strokeWidth="7" strokeLinecap="round" />
          <path d="M126 106c10 16 28 26 48 26" stroke="#26b07a" strokeWidth="7" strokeLinecap="round" />
        </g>
      </g>

      <path
        d="M201 182c22 8 44 24 64 44"
        stroke="#ffb6d9"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M220 176c10 6 22 14 32 24"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <circle cx="382" cy="92" r="7" fill="#ff4fa3" opacity="0.8" />
      <circle cx="414" cy="62" r="5" fill="#ff86bf" opacity="0.85" />
      <circle cx="446" cy="98" r="6" fill="#d81b73" opacity="0.8" />
    </svg>
  );
}

