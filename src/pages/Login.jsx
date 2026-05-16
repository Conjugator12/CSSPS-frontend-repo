import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import s from './Login.module.css'
import csspsLogo from '../assets/cssps-logo.png'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/hub'

  if (isAuthenticated) { navigate(from, { replace: true }); return null }

  const [form, setForm]       = useState({ index_number: '', pin: '' })
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.index_number || !form.pin) { setError('Please enter both your index number and PIN.'); return }
    setLoading(true)
    try {
      await login(form.index_number.trim(), form.pin)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid index number or PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      {/* Brand */}
      <div className={s.brand}>
        <img src={csspsLogo} alt="CSSPS Logo" />
        <h1>CSSPS Student Portal</h1>
        <p>Sign in to access your placement</p>
      </div>

      {/* Form card */}
      <div className={`card ${s.formCard}`}>
        <form onSubmit={onSubmit} className={s.form}>

          <div className={s.field}>
            <label className={s.label} htmlFor="index_number">Index Number</label>
            <input
              id="index_number"
              name="index_number"
              type="text"
              value={form.index_number}
              onChange={onChange}
              placeholder="e.g. 130501801025"
              className="input-field"
              maxLength={14}
              autoComplete="username"
            />
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="pin">PIN / Password</label>
            <div className={s.pinWrap}>
              <input
                id="pin"
                name="pin"
                type={showPin ? 'text' : 'password'}
                value={form.pin}
                onChange={onChange}
                placeholder="Enter your PIN"
                className="input-field"
                autoComplete="current-password"
              />
              <button type="button" className={s.eyeBtn} onClick={() => setShowPin((v) => !v)} aria-label={showPin ? 'Hide PIN' : 'Show PIN'}>
                {showPin
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}} aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className={`btn-primary ${s.submitBtn}`}>
            {loading && <span className="spinner" style={{width:15,height:15,borderTopColor:'#fff',borderColor:'rgba(255,255,255,0.3)'}} />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={s.help}>
          Having trouble?{' '}
          <a href="tel:0207337515">Call 020 733 7515</a>
        </p>
      </div>

      <Link to="/" className={s.back}>← Back to home</Link>
      <p className={s.footnote}>© 2026 – Powered by COLDSIS</p>
    </div>
  )
}
