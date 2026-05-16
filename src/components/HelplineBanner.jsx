import s from './HelplineBanner.module.css'

export default function HelplineBanner() {
  return (
    <div className={s.banner}>
      <div className={s.inner}>
        <span className={s.badge}>
          {/* phone icon inline SVG so no extra dep needed */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.4 1.22 2 2 0 012.38 0h3a2 2 0 012 1.72c.13 1 .37 1.98.72 2.9a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.18-1.18a2 2 0 012.11-.45c.92.35 1.9.59 2.9.72A2 2 0 0122 16.92z"/>
          </svg>
          Helplines:
        </span>
        <span className={s.number}>054 154 8223</span>
        <span className={s.divider}>/</span>
        <span className={s.number}>020 733 7515</span>
      </div>
    </div>
  )
}
