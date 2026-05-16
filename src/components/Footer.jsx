import s from './Footer.module.css'
import csspsLogo from '../assets/cssps-logo.png'

const resources = [
  { label: 'Ghana Education Services', href: 'https://ges.gov.gh' },
  { label: 'Ghana TVET Service',        href: 'https://gtvetservice.gov.gh' },
  { label: 'Ministry Of Education',     href: 'https://moe.gov.gh' },
  { label: 'WAEC',                      href: 'https://waecgh.org' },
]

const helplines = ['020 733 7515', '054 154 8223']

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.4 1.22 2 2 0 012.38 0h3a2 2 0 012 1.72c.13 1 .37 1.98.72 2.9a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.18-1.18a2 2 0 012.11-.45c.92.35 1.9.59 2.9.72A2 2 0 0122 16.92z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.grid}>

        {/* Brand */}
        <div className={s.brand}>
          <div className={s.brandLogo}>
            <img src={csspsLogo} alt="CSSPS Logo" className={s.logoImg} />
            <div>
              <p className={s.brandName}>CSSPS</p>
              <p className={s.brandSub}>Computerised Schools<br/>Selection And Placement System</p>
            </div>
          </div>
          <p className={s.brandDesc}>
            CSSPS is a computerized platform designed to match graduating Junior High School
            students with Senior High Schools based on their academic performance, program
            preferences, and available vacancies.
          </p>
        </div>

        {/* Resources */}
        <div>
          <h3 className={s.sectionTitle}>Resources</h3>
          <div className={s.redBar} />
          <ul className={s.linkList}>
            {resources.map((r) => (
              <li key={r.label}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={s.resourceLink}>
                  <ArrowIcon /> {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Centre */}
        <div>
          <h3 className={s.sectionTitle}>Help Centre</h3>
          <div className={s.redBar} />
          <ul className={s.linkList}>
            {helplines.map((n) => (
              <li key={n} className={s.helpLine}>
                <PhoneIcon /> {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.bottomInner}>
          <span>© 2026 <span className={s.csspsRed}>CSSPS</span> • All Rights Reserved.</span>
          <span>Powered By COLDSIS</span>
        </div>
      </div>
    </footer>
  )
}