/* ================= Icons and illustrations (inline SVG, language-neutral) ================= */
const I = {
  shield:'<path d="M12 3 20 6v6c0 5-3.5 8.3-8 9.5C7.5 20.3 4 17 4 12V6Z"/>',
  shieldok:'<path d="M12 3 20 6v6c0 5-3.5 8.3-8 9.5C7.5 20.3 4 17 4 12V6Z"/><path d="m9 12 2 2 4-4"/>',
  stop:'<path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9Z"/><path d="m15 9-6 6M9 9l6 6"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  user:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  chain:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  filecheck:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
  package:'<path d="M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
  eyeoff:'<path d="M9.9 4.2A10 10 0 0 1 12 4c7 0 10 8 10 8a13 13 0 0 1-1.7 2.7M6.6 6.6A13 13 0 0 0 2 12s3 8 10 8a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/>',
  qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  play:'<path d="m6 4 14 8-14 8Z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  chev:'<path d="m6 9 6 6 6-6"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  taka:'<circle cx="12" cy="12" r="10"/><path d="M9 7c1.5 0 2 .8 2 2v6.5a2 2 0 0 0 4 0M8 11h6"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  app:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  store:'<path d="M5 3 19 12 5 21Z"/>',
  wifi:'<path d="M5 12.9a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0M2 9.3a15 15 0 0 1 20 0M12 20h.01"/>',
  wifioff:'<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.3-1.7M12 20h.01"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  lifebuoy:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.9 4.9 4.3 4.3M14.8 14.8l4.3 4.3M14.8 9.2l4.3-4.3M4.9 19.1l4.3-4.3"/>',
  bulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>',
  star:'<path d="m12 2 3 7 7 .6-5.3 4.6L18.4 21 12 17.3 5.6 21l1.7-6.8L2 9.6 9 9Z"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  server:'<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0M12 17v4"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3"/>',
  mappin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 17v4M17 19h4"/>',
  sprout:'<path d="M7 20h10M12 20v-8"/><path d="M12 12C12 7 8.5 4 3 4c0 5.5 3.5 8 9 8Z"/><path d="M12 12c0-4.5 3-7 9-7 0 4.5-3 7-9 7Z"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M20 17v4H6.5A2.5 2.5 0 0 1 4 18.5"/>',
  terminal:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>'
};
const ico = (n, st) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"${st ? ` style="${st}"` : ""}>${I[n] || I.shield}</svg>`;
const SH = "M60 0 120 22v48c0 42-26 70-60 84C26 140 0 112 0 70V22Z";
const lines = (x, y, ws, c) => ws.map((w,i) => `<rect x="${x}" y="${y + i*10}" width="${w}" height="5" rx="2.5" fill="${c}"/>`).join("");
const DS = 'filter="drop-shadow(0 6px 10px rgba(3,105,161,.18))"';
const xBadge = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FF5A5F"/><path d="M${cx-r/2.4} ${cy-r/2.4}l${r/1.2} ${r/1.2}M${cx+r/2.4} ${cy-r/2.4}l${-r/1.2} ${r/1.2}" stroke="#fff" stroke-width="${Math.max(3, r/4)}" stroke-linecap="round"/>`;
const apkBox = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 26 56 0l56 26v70L56 122 0 96Z" fill="#FFC53D"/><path d="M0 26 56 52l56-26L56 0Z" fill="#FFD76E"/><path d="M56 52v70" stroke="#E0A620" stroke-width="3"/><text x="28" y="92" font-size="20" font-weight="800" fill="#0B2545" font-family="sans-serif" transform="skewY(24)">APK</text></g>`;
const ART = {
 hero1:`<svg class="ill" viewBox="0 0 520 420" aria-hidden="true"><defs><linearGradient id="h1g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0369A1"/></linearGradient></defs>
  <circle cx="265" cy="215" r="185" fill="#BAE6FD"/><circle cx="440" cy="70" r="34" fill="#FFC53D"/><circle cx="70" cy="340" r="18" fill="#7DD3FC"/>
  <rect x="165" y="36" width="196" height="352" rx="32" fill="#0B2545"/><rect x="177" y="54" width="172" height="318" rx="22" fill="#fff"/><rect x="236" y="42" width="54" height="6" rx="3" fill="#1E3A5F"/>
  <circle cx="204" cy="84" r="14" fill="#E0F2FE"/><text x="204" y="90" font-size="16" text-anchor="middle" fill="#0369A1" font-weight="800" font-family="sans-serif">?</text><rect x="224" y="76" width="84" height="7" rx="3.5" fill="#0B2545"/><rect x="224" y="89" width="54" height="6" rx="3" fill="#94A3B8"/>
  <rect x="189" y="112" width="124" height="36" rx="12" fill="#F0F9FF"/>${lines(199,120,[96,70],"#94A3B8")}
  <rect x="233" y="158" width="104" height="28" rx="12" fill="#0EA5E9"/>${lines(243,168,[70],"#E0F2FE")}
  <rect x="189" y="196" width="140" height="46" rx="12" fill="#FFE4E6" stroke="#FF5A5F" stroke-width="2.5"/>${lines(199,205,[110,84,60],"#FF5A5F")}
  <rect x="189" y="298" width="148" height="56" rx="16" fill="#FF5A5F"/><circle cx="212" cy="326" r="12" fill="#fff"/><path d="M207 321l10 10M217 321l-10 10" stroke="#FF5A5F" stroke-width="3" stroke-linecap="round"/>${lines(232,316,[90,62],"#fff")}
  <g transform="translate(330 150) scale(1.05)"><path d="${SH}" fill="url(#h1g)"/><path d="M34 74l18 18 36-40" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
  <g transform="translate(38 120)"><rect width="112" height="44" rx="22" fill="#fff" ${DS}/><text x="40" y="29" font-size="18" font-weight="800" fill="#0B2545" font-family="sans-serif" text-anchor="middle">PIN</text>${xBadge(86,22,12)}</g>
  <g transform="translate(58 236)"><rect width="112" height="44" rx="22" fill="#fff" ${DS}/><text x="40" y="29" font-size="18" font-weight="800" fill="#0B2545" font-family="sans-serif" text-anchor="middle">OTP</text>${xBadge(86,22,12)}</g></svg>`,
 apk:`<svg class="ill" viewBox="0 0 520 420" aria-hidden="true"><defs><linearGradient id="apg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0369A1"/></linearGradient></defs>
  <circle cx="260" cy="215" r="185" fill="#BAE6FD"/><circle cx="455" cy="330" r="24" fill="#FFC53D"/><circle cx="64" cy="96" r="16" fill="#7DD3FC"/>
  <rect x="150" y="36" width="196" height="352" rx="32" fill="#0B2545"/><rect x="162" y="54" width="172" height="318" rx="22" fill="#fff"/><rect x="221" y="42" width="54" height="6" rx="3" fill="#1E3A5F"/>
  ${apkBox(192, 78, 1)}
  <g transform="translate(176 222)"><rect width="144" height="30" rx="10" fill="#FFE4E6"/><circle cx="16" cy="15" r="7" fill="#FF5A5F"/>${lines(30,12,[96],"#FF5A5F")}
   <rect y="38" width="144" height="30" rx="10" fill="#FFE4E6"/><circle cx="16" cy="53" r="7" fill="#FF5A5F"/>${lines(30,50,[80],"#FF5A5F")}
   <rect y="76" width="144" height="30" rx="10" fill="#FEF3C7"/><circle cx="16" cy="91" r="7" fill="#D97706"/>${lines(30,88,[100],"#D97706")}</g>
  <g transform="translate(300 60)"><circle cx="70" cy="70" r="58" fill="#F0F9FF" stroke="#0B2545" stroke-width="11"/><path d="M112 112l44 44" stroke="#0B2545" stroke-width="18" stroke-linecap="round"/><path d="M70 42v36" stroke="#FF5A5F" stroke-width="12" stroke-linecap="round"/><circle cx="70" cy="96" r="7" fill="#FF5A5F"/></g>
  <g transform="translate(24 200)"><rect width="118" height="44" rx="22" fill="#fff" ${DS}/><text x="46" y="29" font-size="18" font-weight="800" fill="#0B2545" font-family="sans-serif" text-anchor="middle">SMS</text>${xBadge(92,22,12)}</g>
  <g transform="translate(380 250) scale(.62)"><path d="${SH}" fill="url(#apg)"/><path d="M34 74l18 18 36-40" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
 hero2:`<svg class="ill" viewBox="0 0 520 420" aria-hidden="true">
  <circle cx="260" cy="215" r="185" fill="#BAE6FD"/><circle cx="80" cy="80" r="26" fill="#FFC53D"/>
  <rect x="60" y="90" width="400" height="250" rx="22" fill="#fff" filter="drop-shadow(0 16px 24px rgba(3,105,161,.18))"/><path d="M60 134V112a22 22 0 0 1 22-22h356a22 22 0 0 1 22 22v22z" fill="#E0F2FE"/>
  <circle cx="86" cy="112" r="6" fill="#FF5A5F"/><circle cx="104" cy="112" r="6" fill="#FFC53D"/><circle cx="122" cy="112" r="6" fill="#22C55E"/>
  <rect x="142" y="100" width="296" height="24" rx="12" fill="#fff"/><text x="156" y="117" font-size="14" fill="#0B2545" font-family="monospace">nagad-bd-verify.help/login</text>
  <rect x="96" y="160" width="160" height="14" rx="7" fill="#CBD5E1"/><rect x="96" y="186" width="200" height="10" rx="5" fill="#E2E8F0"/><rect x="96" y="206" width="170" height="10" rx="5" fill="#E2E8F0"/>
  <rect x="96" y="236" width="150" height="34" rx="10" fill="#E0F2FE"/><rect x="96" y="284" width="110" height="34" rx="17" fill="#FF5A5F"/>
  <g transform="translate(282 150)"><circle cx="70" cy="70" r="66" fill="#F0F9FF" stroke="#0B2545" stroke-width="12"/><path d="M118 118l52 52" stroke="#0B2545" stroke-width="20" stroke-linecap="round"/>
   <text x="70" y="62" font-size="18" text-anchor="middle" fill="#0369A1" font-family="monospace" font-weight="700">.help</text>${xBadge(70,94,17)}</g>
  <g transform="translate(372 30)"><path d="M20 0v44a18 18 0 1 1-18-18" stroke="#0B2545" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M2 26l-6 10h12z" fill="#0B2545"/></g></svg>`,
 hero3:`<svg class="ill" viewBox="0 0 520 420" aria-hidden="true"><defs><linearGradient id="h3g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs>
  <circle cx="260" cy="215" r="185" fill="#BAE6FD"/><circle cx="450" cy="330" r="22" fill="#FFC53D"/>
  <path d="M200 170v-44a60 60 0 0 1 120 0v44" stroke="#0B2545" stroke-width="22" fill="none" stroke-linecap="round"/>
  <rect x="160" y="160" width="200" height="170" rx="30" fill="url(#h3g)"/>
  <g fill="#fff"><circle cx="208" cy="245" r="13"/><circle cx="244" cy="245" r="13"/><circle cx="280" cy="245" r="13"/><circle cx="316" cy="245" r="13"/></g>
  <rect x="198" y="282" width="124" height="10" rx="5" fill="#7DD3FC"/>
  <g transform="translate(24 70)"><rect width="150" height="64" rx="20" fill="#fff" ${DS}/><path d="M26 63l-4 18 20-18z" fill="#fff"/>${lines(20,22,[100,70],"#FF5A5F")}${xBadge(142,8,16)}</g>
  <g transform="translate(350 60)"><rect width="150" height="64" rx="20" fill="#fff" ${DS}/><path d="M124 63l4 18-20-18z" fill="#fff"/>${lines(20,22,[100,70],"#16A34A")}<circle cx="142" cy="8" r="16" fill="#22C55E"/><path d="M134 8l6 6 10-11" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
 hero4:`<svg class="ill" viewBox="0 0 520 420" aria-hidden="true"><defs><linearGradient id="h4g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0369A1"/></linearGradient></defs>
  <circle cx="260" cy="215" r="185" fill="#BAE6FD"/>
  <rect x="180" y="50" width="160" height="320" rx="28" fill="#0B2545"/><rect x="192" y="68" width="136" height="286" rx="18" fill="#F0F9FF"/>
  <g transform="translate(215 130) scale(.75)"><path d="${SH}" fill="url(#h4g)"/><rect x="36" y="64" width="48" height="40" rx="8" fill="#fff"/><path d="M46 64v-10a14 14 0 0 1 28 0v10" stroke="#fff" stroke-width="8" fill="none"/></g>
  <rect x="210" y="270" width="100" height="10" rx="5" fill="#BAE6FD"/><rect x="226" y="290" width="68" height="8" rx="4" fill="#BAE6FD"/>
  <g transform="translate(370 70)"><path d="M88 70H30a30 30 0 1 1 28-40h8a20 20 0 1 1 22 40Z" fill="#fff"/><path d="M8 8l92 72" stroke="#FF5A5F" stroke-width="9" stroke-linecap="round"/></g>
  <g transform="translate(40 250)"><rect width="110" height="70" rx="16" fill="#fff" ${DS}/><path d="M26 24h58M26 40h40" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/><path d="M20 58l70-48" stroke="#FF5A5F" stroke-width="7" stroke-linecap="round"/></g></svg>`,
 filedrop:`<svg class="ill" viewBox="0 0 220 140" aria-hidden="true"><circle cx="110" cy="72" r="62" fill="#BAE6FD"/><rect x="58" y="22" width="70" height="92" rx="10" fill="#fff" ${DS}/><path d="M108 22v20h20" fill="#E0F2FE"/>${lines(70,56,[46,36,42],"#94A3B8")}${apkBox(120, 44, .55)}<g transform="translate(146 88)"><circle r="20" fill="#0EA5E9"/><path d="M-8 0l6 6 11-12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
 linktool:`<svg class="ill" viewBox="0 0 230 110" aria-hidden="true"><circle cx="115" cy="56" r="50" fill="#BAE6FD"/><rect x="24" y="30" width="182" height="40" rx="20" fill="#fff" ${DS}/><circle cx="46" cy="50" r="10" fill="#E0F2FE"/><path d="M42 50a4 4 0 0 0 6 .3l2-2a4 4 0 0 0-6-6" stroke="#0369A1" stroke-width="2.5" fill="none" stroke-linecap="round"/>${lines(64,47,[92],"#94A3B8")}<g transform="translate(170 58)"><circle r="18" fill="#F0F9FF" stroke="#0B2545" stroke-width="5"/><path d="M13 13l14 14" stroke="#0B2545" stroke-width="7" stroke-linecap="round"/></g></svg>`,
 net:`<svg class="ill" viewBox="0 0 240 150" aria-hidden="true"><circle cx="120" cy="80" r="66" fill="#BAE6FD"/><rect x="64" y="96" width="112" height="30" rx="10" fill="#0B2545"/><circle cx="84" cy="111" r="4" fill="#22C55E"/><circle cx="98" cy="111" r="4" fill="#FFC53D"/><path d="M92 96 80 70M148 96l12-26" stroke="#0B2545" stroke-width="6" stroke-linecap="round"/><path d="M84 58a50 50 0 0 1 72 0M96 70a32 32 0 0 1 48 0M108 82a14 14 0 0 1 24 0" stroke="#0EA5E9" stroke-width="6" fill="none" stroke-linecap="round"/><g transform="translate(176 30)"><rect width="52" height="26" rx="13" fill="#fff" ${DS}/><text x="26" y="18" font-size="11" font-weight="800" text-anchor="middle" fill="#0369A1" font-family="sans-serif">DNS</text></g></svg>`,
 call:`<svg class="ill" viewBox="0 0 320 190" aria-hidden="true"><circle cx="160" cy="100" r="80" fill="#BAE6FD"/><circle cx="130" cy="78" r="26" fill="#0B2545"/><path d="M84 170c4-40 24-60 46-60s42 20 46 60z" fill="#0369A1"/><path d="M100 78a30 30 0 0 1 60 0" stroke="#FFC53D" stroke-width="7" fill="none"/><rect x="94" y="74" width="12" height="20" rx="5" fill="#FFC53D"/><path d="M100 94q4 14 20 14" stroke="#FFC53D" stroke-width="4" fill="none"/>
  <g transform="translate(186 30)"><rect width="104" height="40" rx="12" fill="#fff" ${DS}/><text x="52" y="26" font-size="13" font-weight="800" text-anchor="middle" fill="#0369A1" font-family="sans-serif">OFFICE?</text></g>
  <g transform="translate(206 96)"><rect width="74" height="40" rx="12" fill="#FF5A5F"/><text x="37" y="26" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">OTP?</text></g></svg>`,
 hook:`<svg class="ill" viewBox="0 0 320 190" aria-hidden="true"><circle cx="160" cy="100" r="80" fill="#BAE6FD"/><rect x="60" y="54" width="200" height="104" rx="14" fill="#fff" ${DS}/><path d="M60 78V68a14 14 0 0 1 14-14h172a14 14 0 0 1 14 14v10z" fill="#E0F2FE"/><rect x="74" y="61" width="150" height="10" rx="5" fill="#fff"/>${lines(78,92,[120,90,104],"#CBD5E1")}<rect x="78" y="128" width="70" height="20" rx="10" fill="#0EA5E9"/>
  <path d="M232 0v96a20 20 0 1 1-20-20" stroke="#0B2545" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M212 76l-8 12h16z" fill="#0B2545"/>${xBadge(254,150,18)}</svg>`,
 family:`<svg class="ill" viewBox="0 0 320 190" aria-hidden="true"><circle cx="160" cy="100" r="80" fill="#BAE6FD"/><g transform="translate(58 40)"><rect width="140" height="50" rx="16" fill="#fff" ${DS}/><path d="M20 49l-4 14 16-14z" fill="#fff"/>${lines(18,16,[90,64],"#94A3B8")}<path d="M122 14c-4-6-14-4-12 4 1 4 12 12 12 12s11-8 12-12c2-8-8-10-12-4z" fill="#FF5A5F"/></g>
  <g transform="translate(120 104)"><rect width="140" height="50" rx="16" fill="#0EA5E9"/><path d="M120 49l4 14-16-14z" fill="#0EA5E9"/><text x="70" y="34" font-size="22" font-weight="800" fill="#fff" font-family="sans-serif" text-anchor="middle">৳ ৳ ৳</text></g>
  <circle cx="262" cy="56" r="20" fill="#FFC53D"/><text x="262" y="64" font-size="22" font-weight="800" text-anchor="middle" fill="#0B2545" font-family="sans-serif">?</text></svg>`,
 fakeapp:`<svg class="ill" viewBox="0 0 320 190" aria-hidden="true"><circle cx="160" cy="100" r="80" fill="#BAE6FD"/><rect x="104" y="22" width="92" height="156" rx="16" fill="#0B2545"/><rect x="112" y="34" width="76" height="132" rx="10" fill="#fff"/>${apkBox(126, 52, .44)}<rect x="122" y="118" width="56" height="16" rx="8" fill="#FF5A5F"/><rect x="122" y="140" width="40" height="8" rx="4" fill="#CBD5E1"/><g transform="translate(212 40)"><rect width="84" height="36" rx="12" fill="#fff" ${DS}/><text x="42" y="23" font-size="12" font-weight="800" text-anchor="middle" fill="#E5383B" font-family="sans-serif">UPDATE!</text></g>${xBadge(206,146,16)}</svg>`,
 job:`<svg class="ill" viewBox="0 0 320 190" aria-hidden="true"><circle cx="160" cy="100" r="80" fill="#BAE6FD"/><rect x="96" y="76" width="128" height="86" rx="14" fill="#0369A1"/><path d="M136 76v-14a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v14" stroke="#0B2545" stroke-width="8" fill="none"/><rect x="96" y="104" width="128" height="10" fill="#0B2545"/><rect x="150" y="98" width="20" height="22" rx="4" fill="#FFC53D"/>
  <g transform="translate(222 34)"><circle cx="26" cy="26" r="26" fill="#FFC53D"/><text x="26" y="35" font-size="26" font-weight="800" text-anchor="middle" fill="#0B2545" font-family="sans-serif">৳</text></g><g transform="translate(46 44)"><rect width="64" height="30" rx="10" fill="#FF5A5F"/><text x="32" y="21" font-size="13" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">FEE</text></g></svg>`,
 noshare:`<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="72" fill="#BAE6FD"/><path d="M130 76v-16a30 30 0 0 1 60 0v16" stroke="#0B2545" stroke-width="12" fill="none"/><rect x="112" y="72" width="96" height="76" rx="16" fill="#0EA5E9"/><g fill="#fff"><circle cx="136" cy="110" r="7"/><circle cx="154" cy="110" r="7"/><circle cx="172" cy="110" r="7"/><circle cx="190" cy="110" r="7"/></g>${xBadge(222,58,22)}</svg>`,
 callback:`<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="72" fill="#BAE6FD"/><rect x="86" y="60" width="120" height="76" rx="12" fill="#0369A1"/><rect x="86" y="78" width="120" height="14" fill="#0B2545"/><rect x="98" y="106" width="46" height="8" rx="4" fill="#7DD3FC"/><rect x="98" y="120" width="30" height="6" rx="3" fill="#7DD3FC"/><g transform="translate(186 52)"><circle cx="30" cy="30" r="30" fill="#22C55E"/><path d="M42 38v5a3 3 0 0 1-3.3 3A30 30 0 0 1 16 22.3 3 3 0 0 1 19 19h5a3 3 0 0 1 3 2.6l.8 3.4-3 2.4a18 18 0 0 0 6.8 6.8l2.4-3 3.4.8A3 3 0 0 1 42 38z" fill="#fff"/></g></svg>`,
 useapp:`<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="72" fill="#BAE6FD"/><rect x="118" y="24" width="84" height="136" rx="16" fill="#0B2545"/><rect x="126" y="36" width="68" height="112" rx="10" fill="#fff"/><rect x="134" y="48" width="22" height="22" rx="6" fill="#0EA5E9"/><rect x="164" y="48" width="22" height="22" rx="6" fill="#38BDF8"/><rect x="134" y="78" width="22" height="22" rx="6" fill="#FFC53D"/><rect x="164" y="78" width="22" height="22" rx="6" fill="#22C55E"/><circle cx="240" cy="54" r="24" fill="#fff" ${DS}/><path d="M232 58a6 6 0 0 0 8.5.4l4-4a6 6 0 0 0-8.5-8.5" stroke="#7C3AED" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M224 38l32 32" stroke="#FF5A5F" stroke-width="5" stroke-linecap="round"/></svg>`,
 report:`<svg class="ill" viewBox="0 0 320 170" aria-hidden="true"><circle cx="160" cy="88" r="72" fill="#BAE6FD"/><rect x="112" y="36" width="96" height="120" rx="12" fill="#fff" ${DS}/>${lines(126,56,[68,50,60,40],"#94A3B8")}<rect x="126" y="108" width="68" height="30" rx="8" fill="#E0F2FE"/><g transform="translate(196 90)"><circle cx="30" cy="30" r="30" fill="#FF5A5F"/><text x="30" y="38" font-size="20" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">999</text></g></svg>`,
 privacy:`<svg class="ill" viewBox="0 0 360 300" aria-hidden="true"><defs><linearGradient id="pvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0369A1"/></linearGradient></defs><circle cx="180" cy="150" r="130" fill="#BAE6FD"/><rect x="120" y="30" width="120" height="240" rx="24" fill="#0B2545"/><rect x="130" y="46" width="100" height="208" rx="14" fill="#fff"/><g transform="translate(135 90) scale(.75)"><path d="${SH}" fill="url(#pvg)"/><path d="M34 74l18 18 36-40" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><g transform="translate(252 50)"><circle cx="30" cy="30" r="30" fill="#fff"/><path d="M38 40H22a10 10 0 1 1 9-13h3a7 7 0 1 1 4 13Z" fill="none" stroke="#0369A1" stroke-width="4"/><path d="M14 16l32 28" stroke="#FF5A5F" stroke-width="6" stroke-linecap="round"/></g><g transform="translate(40 190)"><circle cx="30" cy="30" r="30" fill="#FFC53D"/><rect x="18" y="28" width="24" height="18" rx="4" fill="#0B2545"/><path d="M22 28v-5a8 8 0 0 1 16 0v5" stroke="#0B2545" stroke-width="4" fill="none"/></g></svg>`,
 qr:`<svg class="ill" viewBox="0 0 200 150" aria-hidden="true"><rect x="40" y="10" width="120" height="120" rx="16" fill="#fff" stroke="#BAE6FD" stroke-width="4"/><g fill="#0B2545"><rect x="56" y="26" width="30" height="30" rx="4"/><rect x="114" y="26" width="30" height="30" rx="4"/><rect x="56" y="84" width="30" height="30" rx="4"/><rect x="100" y="84" width="10" height="10"/><rect x="118" y="96" width="10" height="10"/><rect x="134" y="84" width="10" height="10"/><rect x="104" y="108" width="10" height="10"/><rect x="134" y="108" width="10" height="10"/></g><g fill="#fff"><rect x="63" y="33" width="16" height="16" rx="2"/><rect x="121" y="33" width="16" height="16" rx="2"/><rect x="63" y="91" width="16" height="16" rx="2"/></g><rect x="30" y="66" width="140" height="6" rx="3" fill="#0EA5E9" opacity=".8"/></svg>`
};
function verdictArt(v){
  const inner = v === "high" ? `<path d="M40 50l40 40M80 50l-40 40" stroke="#E5383B" stroke-width="12" stroke-linecap="round"/>`
    : v === "verify" ? `<path d="M60 40v34" stroke="#D97706" stroke-width="12" stroke-linecap="round"/><circle cx="60" cy="96" r="7" fill="#D97706"/>`
    : v === "low" ? `<path d="M34 74l18 18 36-40" stroke="#16A34A" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<text x="60" y="100" font-size="60" font-weight="800" text-anchor="middle" fill="#64748B" font-family="sans-serif">?</text>`;
  return `<svg viewBox="0 0 120 154" style="width:100%;height:auto;display:block" aria-hidden="true"><path d="${SH}" fill="#fff"/>${inner}</svg>`;
}

/* friendly shield mascot for the assistant */
function mascot(cls){ return `<svg class="${cls || ""}" viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="msg${cls || "x"}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DD3FC"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs><path d="M60 4 112 22v44c0 38-24 62-52 70C32 128 8 104 8 66V22Z" fill="url(#msg${cls || "x"})" stroke="#fff" stroke-width="5"/><ellipse cx="42" cy="62" rx="11" ry="13" fill="#fff"/><ellipse cx="78" cy="62" rx="11" ry="13" fill="#fff"/><circle cx="44" cy="65" r="6" fill="#0B2545"/><circle cx="80" cy="65" r="6" fill="#0B2545"/><circle cx="46" cy="62" r="2" fill="#fff"/><circle cx="82" cy="62" r="2" fill="#fff"/><path d="M44 90q16 14 32 0" stroke="#0B2545" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="30" cy="84" r="6" fill="#FB7185" opacity=".7"/><circle cx="90" cy="84" r="6" fill="#FB7185" opacity=".7"/></svg>`; }
