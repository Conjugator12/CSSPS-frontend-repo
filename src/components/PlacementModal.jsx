import { useState } from 'react'
import { checkPlacementPublic } from '../services/api'
import s from './PlacementModal.module.css'

const rows = [
  ['Candidate Name', 'candidate_name'],
  ['Index Number',   'index_number'],
  ['SHS Placed',     'school_name'],
  ['Programme',      'programme'],
  ['Residency',      'residency'],
  ['SHS District',   'district'],
  ['SHS Region',     'region'],
]

export default function PlacementModal({ onClose }) {
  const [indexNumber, setIndexNumber] = useState('')
  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!indexNumber.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await checkPlacementPublic(indexNumber.trim())
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'No placement found for this index number.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>

        {/* Header */}
        <div className={s.header}>
          <div>
            <p className={s.headerTitle}>Check Placement</p>
            <p className={s.headerSub}>Enter your BECE index number</p>
          </div>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className={s.body}>
          <form onSubmit={handleCheck} className={s.searchRow}>
            <input
              type="text"
              value={indexNumber}
              onChange={(e) => setIndexNumber(e.target.value)}
              placeholder="e.g. 130501801025"
              className={`input-field ${s.searchInput}`}
              maxLength={14}
            />
            <button type="submit" className={s.searchBtn} disabled={loading || !indexNumber.trim()}>
              {loading
                ? <span className="spinner" style={{ width:15, height:15, borderTopColor:'#fff', borderColor:'rgba(255,255,255,0.3)' }} />
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              }
              Check
            </button>
          </form>

          {error && (
            <div className="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}} aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {result && (
            <div className={s.resultCard}>
              <div className={s.resultHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Placement Found
              </div>
              {rows.map(([label, key]) => (
                <div key={label} className={s.row}>
                  <span className={s.rowLabel}>{label}</span>
                  <span className={s.rowValue}>{result[key] || '—'}</span>
                </div>
              ))}
              <button className={s.printBtn} onClick={() => window.print()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print Placement Slip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
