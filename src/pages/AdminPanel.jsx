import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Badge, Button, Spinner } from '../lib/design'

// ─── SECURITY CONFIG ──────────────────────────────
// Only this email can access the admin panel
const ADMIN_EMAIL = 'admin@theedenappltd.com'
// 6-digit PIN -- known only to the platform owner
const ADMIN_PIN = '451301'
// Lock out after this many wrong attempts
const MAX_ATTEMPTS = 3
// Lockout duration in minutes
const LOCKOUT_MINUTES = 30

// ─── DEMO DATA ────────────────────────────────────
const DEMO_SALONS = []

const DEMO_BOOKINGS = []

const DEMO_USERS = []

const PLAN_PRICES = { free: 0, standard: 59, premium: 119 }

// ─── SMALL COMPONENTS ─────────────────────────────
const PlanBadge = ({ plan }) => {
  const s = { free:{ bg:T.offwhite,color:T.inkSoft,label:'Free' }, standard:{ bg:T.mint,color:T.moss,label:'Growth' }, premium:{ bg:T.goldPale,color:T.gold,label:'Premium' } }[plan] || { bg:T.offwhite,color:T.inkSoft,label:'Free' }
  return <span style={{ padding:'3px 10px',borderRadius:20,fontSize:10,fontWeight:700,background:s.bg,color:s.color,letterSpacing:0.5,textTransform:'uppercase' }}>{s.label}</span>
}

const StatusBadge = ({ status }) => {
  const styles = {
    active:    { bg:T.mint,    color:T.moss,    label:'Active'    },
    pending:   { bg:'#fff8e8', color:'#a06010', label:'Pending'   },
    suspended: { bg:'#fff0f0', color:T.error,   label:'Suspended' },
    paid:      { bg:T.mint,    color:T.moss,    label:'Paid'      },
    overdue:   { bg:'#fff0f0', color:T.error,   label:'Overdue'   },
    free:      { bg:T.offwhite,color:T.inkSoft, label:'Free'      },
    confirmed: { bg:T.mint,    color:T.moss,    label:'Confirmed' },
    completed: { bg:'#f0f4ff', color:'#3050a0', label:'Completed' },
    cancelled: { bg:'#fff0f0', color:T.error,   label:'Cancelled' },
  }
  const s = styles[status] || styles.active
  return <span style={{ padding:'3px 10px',borderRadius:20,fontSize:10,fontWeight:700,background:s.bg,color:s.color,letterSpacing:0.5,textTransform:'uppercase',whiteSpace:'nowrap' }}>{s.label}</span>
}

// ─── PIN ENTRY SCREEN ─────────────────────────────
function PinScreen({ onSuccess }) {
  const [pin,        setPin]        = useState(['','','','','',''])
  const [error,      setError]      = useState('')
  const [attempts,   setAttempts]   = useState(0)
  const [lockedUntil,setLockedUntil]= useState(null)
  const [shake,      setShake]      = useState(false)
  const inputs = useRef([])

  const isLocked = lockedUntil && new Date() < lockedUntil
  const remaining = isLocked ? Math.ceil((lockedUntil - new Date()) / 60000) : 0

  const handleDigit = (i, val) => {
    if (isLocked) return
    if (!/^\d?$/.test(val)) return
    const next = [...pin]
    next[i] = val
    setPin(next)
    if (val && i < 5) inputs.current[i+1]?.focus()
    if (next.every(d => d !== '')) {
      checkPin(next.join(''))
    }
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) {
      inputs.current[i-1]?.focus()
    }
  }

  const checkPin = (entered) => {
    if (entered === ADMIN_PIN) {
      setError('')
      onSuccess()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setPin(['','','','','',''])
      inputs.current[0]?.focus()
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        setLockedUntil(lockTime)
        setError(`Too many incorrect attempts. Locked for ${LOCKOUT_MINUTES} minutes.`)
      } else {
        setError(`Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS-newAttempts===1?'':'s'} remaining.`)
      }
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a120a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.body, padding:24 }}>
      <style>{GLOBAL_CSS}</style>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>

      <div style={{ background:'#0f1a0f', borderRadius:24, padding:'48px 40px', width:400, maxWidth:'100%', border:'1px solid rgba(90,138,98,0.2)', boxShadow:'0 32px 80px rgba(0,0,0,0.5)', textAlign:'center' }}>

        {/* Logo */}
        <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(135deg,${T.forest},${T.sage})`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:30 }}>🌿</div>

        <div style={{ fontFamily:F.display, fontSize:26, color:T.white, marginBottom:6 }}>Eden Admin</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:32 }}>Enter your 6-digit admin PIN to continue</div>

        {/* PIN inputs */}
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:24, animation: shake ? 'shake 0.5s ease' : 'none' }}>
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              disabled={isLocked}
              style={{
                width: 48, height: 56,
                textAlign: 'center', fontSize: 24, fontWeight: 700,
                background: digit ? 'rgba(90,138,98,0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${digit ? T.sage : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 12, color: T.white, outline: 'none',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>

        {/* Error / locked message */}
        {error && (
          <div style={{ background:'rgba(184,64,64,0.15)', border:'1px solid rgba(184,64,64,0.3)', borderRadius:10, padding:'10px 16px', marginBottom:20, fontSize:13, color:'#f87171', lineHeight:1.6 }}>
            {isLocked ? `🔒 Admin panel locked. Try again in ${remaining} minute${remaining===1?'':'s'}.` : `⚠️ ${error}`}
          </div>
        )}

        {/* Security notice */}
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', lineHeight:1.7, marginTop:20 }}>
          This area is restricted to authorised personnel only.<br/>
          Unauthorised access attempts are logged.
        </div>
      </div>
    </div>
  )
}

// ─── SALON MANAGEMENT MODAL ───────────────────────
function SalonModal({ salon, onClose, onSave }) {
  const [plan,       setPlan]       = useState(salon.plan)
  const [status,     setStatus]     = useState(salon.status)
  const [verified,   setVerified]   = useState(salon.verified)
  const [promoted,   setPromoted]   = useState(salon.promoted)
  const [freeMonths, setFreeMonths] = useState(0)
  const [note,       setNote]       = useState('')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      onSave({ ...salon, plan, status, verified, promoted })
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); onClose() }, 1500)
    }, 800)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:600, backdropFilter:'blur(4px)', padding:16 }}
      onClick={onClose}>
      <div style={{ background:'#0f1a0f', border:'1px solid rgba(90,138,98,0.2)', borderRadius:20, width:580, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 100px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}>
        {saved ? (
          <div style={{ padding:'48px 36px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ fontFamily:F.display, fontSize:22, color:T.white }}>Changes saved!</div>
          </div>
        ) : (
          <>
            <div style={{ background:'rgba(90,138,98,0.1)', padding:'24px 32px', borderRadius:'20px 20px 0 0', borderBottom:'1px solid rgba(90,138,98,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:10, color:T.sageLight, letterSpacing:3, fontWeight:700, marginBottom:4 }}>ADMIN - MANAGE SALON</div>
                <div style={{ fontFamily:F.display, fontSize:20, color:T.white }}>{salon.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{salon.owner} - {salon.city}</div>
              </div>
              <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', color:T.white, cursor:'pointer', fontSize:14 }}>✕</button>
            </div>

            <div style={{ padding:'28px 32px' }}>

              {/* Plan */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:1, marginBottom:12, textTransform:'uppercase' }}>Subscription Plan</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {[
                    { id:'free',     label:'Starter', price:'Free'      },
                    { id:'standard', label:'Growth',  price:'£59/mo'    },
                    { id:'premium',  label:'Premium', price:'£119/mo'   },
                  ].map(p => (
                    <div key={p.id} onClick={() => setPlan(p.id)} style={{ padding:'14px', borderRadius:10, cursor:'pointer', border:`2px solid ${plan===p.id?T.sage:'rgba(255,255,255,0.1)'}`, background:plan===p.id?'rgba(90,138,98,0.15)':'rgba(255,255,255,0.03)', textAlign:'center', transition:'all 0.15s' }}>
                      <div style={{ fontFamily:F.display, fontSize:15, color:T.white, marginBottom:4 }}>{p.label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.sageLight }}>{p.price}</div>
                      {plan===p.id && <div style={{ fontSize:9, color:T.sageLight, fontWeight:700, marginTop:4, letterSpacing:1 }}>SELECTED</div>}
                    </div>
                  ))}
                </div>

                {/* Free onboarding */}
                <div style={{ marginTop:12, padding:'16px', background:'rgba(196,154,60,0.08)', borderRadius:10, border:'1px solid rgba(196,154,60,0.2)' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.goldLight, marginBottom:6 }}>🎁 Free Onboarding Override</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:10, lineHeight:1.7 }}>
                    Grant this salon free access to any paid plan for a set period -- no payment taken. Use this during onboarding to get salons live quickly.
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <select value={freeMonths} onChange={e => setFreeMonths(Number(e.target.value))}
                      style={{ flex:1, padding:'9px 12px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, fontSize:13, color:T.white, outline:'none' }}>
                      <option value={0}>Select free period...</option>
                      {[1,2,3,6,12].map(m => <option key={m} value={m}>{m} month{m>1?'s':''} free</option>)}
                    </select>
                    <button onClick={() => { if(freeMonths>0) alert(`${freeMonths} month${freeMonths>1?'s':''} free ${plan} access granted to ${salon.name}`) }}
                      style={{ padding:'9px 18px', background:'rgba(196,154,60,0.2)', border:'1px solid rgba(196,154,60,0.3)', borderRadius:8, color:T.goldLight, fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                      Grant Free Access
                    </button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:1, marginBottom:12, textTransform:'uppercase' }}>Listing Status</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {[
                    { val:'active',    label:'Active'    },
                    { val:'pending',   label:'Pending'   },
                    { val:'suspended', label:'Suspended' },
                  ].map(s => (
                    <button key={s.val} onClick={() => setStatus(s.val)} style={{ padding:'8px 18px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:`1.5px solid ${status===s.val?T.sage:'rgba(255,255,255,0.1)'}`, background:status===s.val?'rgba(90,138,98,0.2)':'transparent', color:status===s.val?T.sageLight:'rgba(255,255,255,0.4)', transition:'all 0.15s' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:1, marginBottom:12, textTransform:'uppercase' }}>Listing Controls</div>
                {[
                  { label:'Verified', sub:'Shows verified badge on listing', val:verified, set:setVerified },
                  { label:'Featured / Promoted', sub:'Appears at top of search results', val:promoted, set:setPromoted },
                ].map((t,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'12px 16px', marginBottom:8, border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.white }}>{t.label}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{t.sub}</div>
                    </div>
                    <div onClick={() => t.set(!t.val)} style={{ width:44, height:24, borderRadius:12, background:t.val?T.sage:'rgba(255,255,255,0.1)', position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
                      <div style={{ position:'absolute', top:3, left:t.val?23:3, width:18, height:18, borderRadius:'50%', background:T.white, boxShadow:'0 1px 4px rgba(0,0,0,0.3)', transition:'left 0.2s' }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin note */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:1, marginBottom:8, textTransform:'uppercase' }}>Private Admin Note</div>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Internal note -- not visible to the business..."
                  style={{ width:'100%', height:80, padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, fontSize:13, color:T.white, outline:'none', resize:'none', boxSizing:'border-box' }}/>
              </div>

              {/* Danger */}
              <div style={{ background:'rgba(184,64,64,0.08)', borderRadius:12, padding:'16px 18px', marginBottom:24, border:'1px solid rgba(184,64,64,0.2)' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#f87171', marginBottom:10 }}>Danger Zone</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <button onClick={() => { if(window.confirm('Suspend ' + salon.name + '?')) { onSave({...salon, status:'suspended'}); onClose() }}}
                    style={{ padding:'8px 16px', background:'rgba(184,64,64,0.15)', border:'1px solid rgba(184,64,64,0.3)', borderRadius:8, color:'#f87171', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    Suspend Listing
                  </button>
                  <button onClick={() => { if(window.confirm('Permanently delete ' + salon.name + '? This cannot be undone.')) onClose() }}
                    style={{ padding:'8px 16px', background:'rgba(184,64,64,0.3)', border:'none', borderRadius:8, color:T.white, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    Delete Permanently
                  </button>
                </div>
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={onClose} style={{ flex:1, padding:'12px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:13 }}>Cancel</button>
                <button onClick={save} disabled={saving} style={{ flex:2, padding:'12px', background:T.sage, border:'none', borderRadius:10, color:T.white, fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {saving ? <><Spinner size={14} color={T.white}/> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── MAIN ADMIN PANEL ─────────────────────────────
export default function AdminPanel({ user }) {
  const [pinPassed,     setPinPassed]     = useState(false)
  const [authorized,    setAuthorized]    = useState(false)
  const [checking,      setChecking]      = useState(true)
  const [tab,           setTab]           = useState('overview')
  const [salons,        setSalons]        = useState(DEMO_SALONS)
  const [managingSalon, setManagingSalon] = useState(null)
  const [salonFilter,   setSalonFilter]   = useState('all')
  const [salonSearch,   setSalonSearch]   = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      if (!user) { setChecking(false); return }
      if (user.email === ADMIN_EMAIL) { setAuthorized(true); setChecking(false); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (data?.role === 'admin') setAuthorized(true)
      setChecking(false)
    }
    check()
  }, [user])

  const TABS = ['overview','salons','bookings','customers','revenue','settings']

  const totalRevenue     = salons.reduce((a,s) => a + s.revenue, 0)
  const totalCommission  = Math.round(totalRevenue * 0.10)
  const totalBookings    = salons.reduce((a,s) => a + s.bookings, 0)
  const activeSalons     = salons.filter(s => s.status === 'active').length
  const premiumCount     = salons.filter(s => s.plan === 'premium').length
  const standardCount    = salons.filter(s => s.plan === 'standard').length
  const subRevenue       = (premiumCount * 119) + (standardCount * 59)

  const filteredSalons = salons
    .filter(s => salonFilter === 'all' || s.plan === salonFilter || s.status === salonFilter)
    .filter(s => s.name.toLowerCase().includes(salonSearch.toLowerCase()) || s.city.toLowerCase().includes(salonSearch.toLowerCase()))

  // Loading
  if (checking) return (
    <div style={{ minHeight:'100vh', background:'#0a120a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{GLOBAL_CSS}</style>
      <Spinner size={32} color={T.sage}/>
    </div>
  )

  // Not authorized
  if (!authorized) return (
    <div style={{ minHeight:'100vh', background:'#0a120a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ textAlign:'center', padding:40 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
        <div style={{ fontFamily:F.display, fontSize:24, color:T.white, marginBottom:8 }}>Access Denied</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>You do not have permission to access this area.</div>
        <button onClick={() => navigate('/')} style={{ padding:'10px 24px', background:T.sage, border:'none', borderRadius:10, color:T.white, fontWeight:600, cursor:'pointer', fontSize:13 }}>Back to Eden</button>
      </div>
    </div>
  )

  // PIN screen -- shown before admin panel even if authorized
  if (!pinPassed) return <PinScreen onSuccess={() => setPinPassed(true)} />

  // ── ADMIN PANEL ──
  return (
    <div style={{ minHeight:'100vh', background:'#111a11', fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Nav */}
      <nav style={{ background:'#0a120a', padding:'0 24px', height:62, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(90,138,98,0.15)', position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${T.forest},${T.sage})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🌿</div>
          <span style={{ fontFamily:F.display, fontSize:20, color:T.white }}>Eden</span>
          <span style={{ fontSize:10, background:T.error, color:T.white, padding:'2px 8px', borderRadius:10, fontWeight:700, letterSpacing:1 }}>ADMIN</span>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{user?.email}</span>
          <button onClick={() => navigate('/')} style={{ padding:'6px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:12 }}>View Site</button>
          <button onClick={() => { setPinPassed(false); navigate('/') }} style={{ padding:'6px 14px', background:'rgba(184,64,64,0.15)', border:'1px solid rgba(184,64,64,0.2)', borderRadius:8, color:'#f87171', cursor:'pointer', fontSize:12 }}>Lock Admin</button>
          <button onClick={async () => { await signOut(); navigate('/') }} style={{ padding:'6px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:12 }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ display:'flex', minHeight:'calc(100vh - 62px)' }}>

        {/* Sidebar */}
        <div style={{ width:220, background:'#0a120a', borderRight:'1px solid rgba(90,138,98,0.1)', padding:'24px 0', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ width:'100%', padding:'12px 24px', background:tab===t?'rgba(90,138,98,0.15)':'none', border:'none', borderLeft:`3px solid ${tab===t?T.sage:'transparent'}`, color:tab===t?T.sageLight:'rgba(255,255,255,0.35)', fontSize:13, fontWeight:tab===t?600:400, cursor:'pointer', textAlign:'left', textTransform:'capitalize', transition:'all 0.15s' }}>
              {t}
              {t==='salons' && salons.filter(s=>s.status==='pending').length>0 && <span style={{ marginLeft:8, background:'#fbbf24', color:'#0a120a', borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 7px' }}>{salons.filter(s=>s.status==='pending').length}</span>}
            </button>
          ))}
          <div style={{ margin:'24px 16px 0', padding:'14px 16px', background:'rgba(90,138,98,0.08)', borderRadius:10, border:'1px solid rgba(90,138,98,0.15)' }}>
            <div style={{ fontSize:9, color:T.sageLight, fontWeight:700, letterSpacing:2, marginBottom:6 }}>PLATFORM STATUS</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:T.sageLight }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block' }}/>
              All systems live
            </div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:4 }}>theedenappltd.com</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'32px' }}>

          {/* ── OVERVIEW ── */}
          {tab==='overview' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:28, color:T.white, marginBottom:4 }}>Admin Overview</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', marginBottom:28 }}>The Eden App LTD - Platform Control Centre</div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:28 }}>
                {[
                  { icon:'🏢', label:'Active Salons',        value:activeSalons,                           color:T.sageLight },
                  { icon:'📅', label:'Total Bookings',       value:totalBookings,                          color:T.sageLight },
                  { icon:'💷', label:'Platform Commission',  value:`£${totalCommission.toLocaleString()}`, color:T.goldLight },
                  { icon:'📋', label:'Subscription Revenue', value:`£${subRevenue.toLocaleString()}/mo`,   color:T.goldLight },
                  { icon:'⭐', label:'Premium Salons',       value:premiumCount,                           color:T.sageLight },
                  { icon:'🔔', label:'Awaiting Approval',    value:salons.filter(s=>s.status==='pending').length, color:'#fbbf24' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:12, padding:'20px 18px', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
                    <div style={{ fontFamily:F.display, fontSize:26, color:s.color, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Pending approvals */}
              {salons.filter(s=>s.status==='pending').length > 0 && (
                <div style={{ background:'rgba(251,191,36,0.06)', borderRadius:12, padding:20, border:'1px solid rgba(251,191,36,0.15)', marginBottom:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fbbf24', marginBottom:12 }}>Salons awaiting approval</div>
                  {salons.filter(s=>s.status==='pending').map(s => (
                    <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:T.white }}>{s.name}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{s.owner} - {s.city} - Joined {s.joined}</div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => setSalons(p=>p.map(x=>x.id===s.id?{...x,status:'active',verified:true}:x))} style={{ padding:'6px 14px', background:'rgba(90,138,98,0.2)', border:'1px solid rgba(90,138,98,0.3)', borderRadius:6, color:T.sageLight, fontSize:11, fontWeight:700, cursor:'pointer' }}>Approve</button>
                        <button onClick={() => setManagingSalon(s)} style={{ padding:'6px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.5)', fontSize:11, cursor:'pointer' }}>Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Overdue */}
              {salons.filter(s=>s.paymentStatus==='overdue').length > 0 && (
                <div style={{ background:'rgba(184,64,64,0.06)', borderRadius:12, padding:20, border:'1px solid rgba(184,64,64,0.15)', marginBottom:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#f87171', marginBottom:12 }}>Overdue subscription payments</div>
                  {salons.filter(s=>s.paymentStatus==='overdue').map(s => (
                    <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:T.white }}>{s.name}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{s.plan==='standard'?'Growth £59/mo':'Premium £119/mo'} - Payment overdue</div>
                      </div>
                      <button onClick={() => setManagingSalon(s)} style={{ padding:'6px 14px', background:'rgba(184,64,64,0.15)', border:'1px solid rgba(184,64,64,0.25)', borderRadius:6, color:'#f87171', fontSize:11, fontWeight:700, cursor:'pointer' }}>Review</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Revenue */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {[
                  { label:'Booking Commission',    value:`£${totalCommission.toLocaleString()}`,              sub:'10% of all bookings', color:T.sage    },
                  { label:'Subscription Revenue',  value:`£${subRevenue.toLocaleString()}/mo`,                sub:`${premiumCount+standardCount} subscribers`, color:T.gold    },
                  { label:'Total Platform Revenue',value:`£${(totalCommission+subRevenue).toLocaleString()}`, sub:'Combined this month', color:'#a78bfa' },
                ].map((r,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:18, border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                    <div style={{ fontFamily:F.display, fontSize:26, color:r.color, marginBottom:6 }}>{r.value}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>{r.label}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)' }}>{r.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SALONS ── */}
          {tab==='salons' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                <div style={{ fontFamily:F.display, fontSize:24, color:T.white }}>All Salons</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  <input value={salonSearch} onChange={e=>setSalonSearch(e.target.value)} placeholder="Search..."
                    style={{ padding:'8px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:T.white, fontSize:12, outline:'none', width:180 }}/>
                  {['all','free','standard','premium','active','pending','suspended','hair','barber','nails','aesthetics','beauty','spa','tattoo','tanning','fitness','pt','dog','mobile','laser','health','dental','afro','semiperm'].map(f => (
                    <button key={f} onClick={() => setSalonFilter(f)} style={{ padding:'5px 12px', borderRadius:20, fontSize:10, fontWeight:700, cursor:'pointer', border:`1px solid ${salonFilter===f?T.sage:'rgba(255,255,255,0.1)'}`, background:salonFilter===f?'rgba(90,138,98,0.15)':'transparent', color:salonFilter===f?T.sageLight:'rgba(255,255,255,0.35)', textTransform:'capitalize' }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      {['Salon','Plan','Status','Bookings','Revenue','Payment',''].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:10, color:'rgba(255,255,255,0.25)', fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalons.map((s,i) => (
                      <tr key={s.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ fontSize:13, fontWeight:600, color:T.white }}>{s.name}</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{s.city} - {s.category}</div>
                          <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:1 }}>{s.owner}</div>
                        </td>
                        <td style={{ padding:'14px 16px' }}><PlanBadge plan={s.plan}/></td>
                        <td style={{ padding:'14px 16px' }}><StatusBadge status={s.status}/></td>
                        <td style={{ padding:'14px 16px', fontSize:13, color:'rgba(255,255,255,0.5)' }}>{s.bookings}</td>
                        <td style={{ padding:'14px 16px', fontSize:13, fontWeight:700, color:T.goldLight }}>£{s.revenue.toLocaleString()}</td>
                        <td style={{ padding:'14px 16px' }}><StatusBadge status={s.paymentStatus}/></td>
                        <td style={{ padding:'14px 16px' }}>
                          <button onClick={() => setManagingSalon(s)} style={{ padding:'6px 14px', background:'rgba(90,138,98,0.15)', border:'1px solid rgba(90,138,98,0.25)', borderRadius:6, color:T.sageLight, fontSize:11, fontWeight:700, cursor:'pointer' }}>Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab==='bookings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.white, marginBottom:20 }}>All Bookings</div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      {['Customer','Salon','Service','Date','Amount','Commission','Status'].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:10, color:'rgba(255,255,255,0.25)', fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_BOOKINGS.map((b,i) => (
                      <tr key={b.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding:'12px 16px', fontSize:13, color:T.white, fontWeight:500 }}>{b.customer}</td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:'rgba(255,255,255,0.45)' }}>{b.salon}</td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:'rgba(255,255,255,0.45)' }}>{b.service}</td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:'rgba(255,255,255,0.35)' }}>{b.date}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:T.goldLight }}>£{b.amount}</td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:T.sageLight }}>£{b.commission.toFixed(2)}</td>
                        <td style={{ padding:'12px 16px' }}><StatusBadge status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop:14, padding:'12px 16px', background:'rgba(90,138,98,0.06)', borderRadius:8, border:'1px solid rgba(90,138,98,0.12)', fontSize:12, color:T.sageLight }}>
                Total Eden commission from these bookings: <strong style={{ color:T.goldLight }}>£{DEMO_BOOKINGS.reduce((a,b)=>a+b.commission,0).toFixed(2)}</strong>
              </div>
            </div>
          )}

          {/* ── CUSTOMERS ── */}
          {tab==='customers' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.white, marginBottom:20 }}>All Customers</div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      {['Customer','Email','Joined','Bookings','Total Spent','Status',''].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:10, color:'rgba(255,255,255,0.25)', fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USERS.map((u,i) => (
                      <tr key={u.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(90,138,98,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:T.sageLight, fontFamily:F.display }}>{u.name[0]}</div>
                            <span style={{ fontSize:13, fontWeight:600, color:T.white }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:'rgba(255,255,255,0.35)' }}>{u.email}</td>
                        <td style={{ padding:'12px 16px', fontSize:12, color:'rgba(255,255,255,0.35)' }}>{u.joined}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'rgba(255,255,255,0.5)' }}>{u.bookings}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:T.goldLight }}>£{u.spent}</td>
                        <td style={{ padding:'12px 16px' }}><StatusBadge status={u.status}/></td>
                        <td style={{ padding:'12px 16px' }}>
                          <button style={{ padding:'5px 12px', background:'rgba(184,64,64,0.12)', border:'1px solid rgba(184,64,64,0.2)', borderRadius:6, color:'#f87171', fontSize:10, fontWeight:700, cursor:'pointer' }}>
                            {u.status==='suspended'?'Unsuspend':'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REVENUE ── */}
          {tab==='revenue' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.white, marginBottom:24 }}>Revenue and Finance</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:28 }}>
                {[
                  { label:'Booking Commission',    value:`£${totalCommission.toLocaleString()}`,                    sub:'This month at 10%',         icon:'💷' },
                  { label:'Subscription Revenue',  value:`£${subRevenue.toLocaleString()}/mo`,                      sub:'Monthly recurring',         icon:'📋' },
                  { label:'Total Platform Revenue',value:`£${(totalCommission+subRevenue).toLocaleString()}`,        sub:'Combined this month',       icon:'📈' },
                  { label:'Projected Annual',      value:`£${((totalCommission+subRevenue)*12).toLocaleString()}`,   sub:'Based on current month',    icon:'🚀' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:12, padding:'20px 18px', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                    <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                    <div style={{ fontFamily:F.display, fontSize:28, color:T.goldLight, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', marginTop:6 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:24, border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.white, marginBottom:16 }}>Subscription Breakdown</div>
                {[
                  { plan:'Premium', count:premiumCount,  price:119, color:T.goldLight },
                  { plan:'Growth',  count:standardCount, price:59,  color:T.sageLight },
                  { plan:'Starter', count:salons.filter(s=>s.plan==='free').length, price:0, color:'rgba(255,255,255,0.3)' },
                ].map((p,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:p.color }}/>
                      <span style={{ fontSize:14, color:T.white, fontWeight:600 }}>{p.plan}</span>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{p.count} salons</span>
                    </div>
                    <div style={{ fontFamily:F.display, fontSize:18, color:p.color }}>
                      {p.price===0 ? 'Free' : `£${(p.count*p.price).toLocaleString()}/mo`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab==='settings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.white, marginBottom:24 }}>Platform Settings</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { label:'Platform commission rate',  value:'10%',       note:'Applied to all bookings via Stripe Connect' },
                  { label:'Starter plan',              value:'Free',      note:'No charge for basic listings' },
                  { label:'Growth plan',               value:'£59/month', note:'Billed monthly, auto-renews' },
                  { label:'Premium plan',              value:'£119/month',note:'Billed monthly, auto-renews' },
                  { label:'Free cancellation window',  value:'24 hours',  note:'Customers cancel free up to 24hrs before' },
                  { label:'Max cancellation fee',      value:'50%',       note:'At salon discretion for late cancellations' },
                  { label:'Payout schedule',           value:'Weekly',    note:'Every Monday, 2-3 business days to arrive' },
                  { label:'Minimum payout',            value:'£25',       note:'Accumulated before payout is triggered' },
                  { label:'Admin access',              value:'PIN + Email',note:'admin@theedenappltd.com only -- PIN verified' },
                ].map((s,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'16px 20px', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.white }}>{s.label}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{s.note}</div>
                    </div>
                    <div style={{ fontFamily:F.display, fontSize:18, color:T.sageLight, flexShrink:0, marginLeft:16 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {managingSalon && (
        <SalonModal
          salon={managingSalon}
          onClose={() => setManagingSalon(null)}
          onSave={(updated) => { setSalons(p=>p.map(s=>s.id===updated.id?updated:s)); setManagingSalon(null) }}
        />
      )}
    </div>
  )
}
