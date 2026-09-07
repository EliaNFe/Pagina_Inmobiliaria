export default function HomeBotanical({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 180 450" fill="none" stroke="currentColor" strokeWidth=".85" aria-hidden="true">
    <path d="M134 450C105 326 91 197 73 23M111 328C76 294 46 242 16 171M95 220C120 175 143 120 155 54M121 381C145 351 158 321 173 278" />
    {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${74 + i * 6} ${37 + i * 52}) rotate(-8)`}><path d="M0 31C-22 19-29 0-26-21C-7-9 1 9 0 31ZM0 36C17 17 26-3 20-21C4-7-2 16 0 36" /><path d="M0 31-22-14M0 36 18-13" /></g>)}
    {[0, 1, 2].map(i => <g key={i} transform={`translate(${24 + i * 19} ${195 + i * 37}) rotate(-30)`}><path d="M0 26C-20 13-23-3-21-18C-6-7 0 8 0 26ZM1 28C19 15 24 0 20-15C6-5 0 10 1 28" /></g>)}
    <path d="M145 351C130 324 136 306 142 289C153 311 153 329 145 351ZM153 332C169 319 177 303 174 283C157 293 151 314 153 332" />
  </svg>
}
