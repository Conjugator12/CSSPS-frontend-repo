import { useNavigate } from 'react-router-dom'
import s from './PublicNavbar.module.css'
import csspsLogo from '../assets/cssps-logo.png'

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  )
}

export default function PublicNavbar({ onCheckPlacement }) {
  const navigate = useNavigate()

  return (
    <nav className={s.nav}>
      <div className={s.inner}>
        <div className={s.logo}>
          <img src={csspsLogo} alt="CSSPS Logo" />
          <div className={s.logoText}>
            <p className={s.logoName}>CSSPS</p>
            <p className={s.logoSub}>Computerised Schools<br/>Selection And Placement System</p>
          </div>
        </div>

        <div className={s.pillGroup}>
          <button className={s.pillBtn} onClick={onCheckPlacement}>
            <StarIcon /> Check Placement
          </button>
          <button className={s.pillBtn} onClick={() => navigate('/login')}>
            <UserPlusIcon /> Self Placement
          </button>
        </div>
      </div>
    </nav>
  )
}
