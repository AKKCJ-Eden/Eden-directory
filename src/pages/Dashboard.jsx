import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Badge, Button, Spinner, Input, Modal } from '../lib/design'

// Duration options
const DURATIONS = [
  { val:15,  label:'15 min' },
  { val:30,  label:'30 min' },
  { val:45,  label:'45 min' },
  { val:60,  label:'1 hour' },
  { val:75,  label:'1h 15m' },
  { val:90,  label:'1h 30m' },
  { val:120, label:'2 hours' },
  { val:150, label:'2h 30m' },
  { val:180, label:'3 hours' },
  { val:240, label:'4 hours' },
  { val:300, label:'5 hours' },
]

// Format duration helper
function fmtDur(d) {
  if (d < 60) return d + ' min'
  var h = Math.floor(d / 60), m = d % 60
  return m > 0 ? (h + 'h ' + m + 'm') : (h + ' hour' + (h > 1 ? 's' : ''))
}

// Status styles
const SS = {
  confirmed:  { bg:T.mint,    color:T.moss,    border:T.sagePale, label:'Confirmed'  },
  pending:    { bg:'#fff8e8', color:'#a06010', border:'#f0d890',  label:'Pending'    },
  completed:  { bg:'#f0f4ff', color:'#3050a0', border:'#d0d8f8',  label:'Completed'  },
  cancelled:  { bg:'#fff0f0', color:T.error,   border:'#f0c0c0',  label:'Cancelled'  },
  no_show:    { bg:'#fff0f0', color:T.error,   border:'#f0c0c0',  label:'No Show'    },
}

// Revenue chart placeholder
const REVENUE = [
  { label:'Jan', v:0 },
  { label:'Feb', v:0 },
  { label:'Mar', v:0 },
  { label:'Apr', v:0 },
  { label:'May', v:0 },
  { label:'Jun', v:0 },
]

// ---- STATUS BADGE ----
function StatusBadge({ status }) {
  var s = SS[status] || SS.confirmed
  return (
    <span style={{
      padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700,
      background:s.bg, color:s.color, letterSpacing:0.5,
      textTransform:'uppercase', whiteSpace:'nowrap',
      border:'1px solid ' + s.border,
    }}>
      {s.label}
    </span>
  )
}

// ---- PLAN BADGE ----
function PlanBadge({ plan }) {
  var styles = {
    free:     { bg:T.offwhite, color:T.inkSoft, label:'Starter'  },
    standard: { bg:T.mint,     color:T.moss,    label:'Growth'   },
    premium:  { bg:T.goldPale, color:T.gold,    label:'Premium'  },
  }
  var s = styles[plan] || styles.free
  return (
    <span style={{
      padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700,
      background:s.bg, color:s.color, letterSpacing:0.5, textTransform:'uppercase',
    }}>
      {s.label}
    </span>
  )
}

// ---- CANCELLATION FEE MODAL ----
function CancellationFeeModal({ booking, onClose, onDecision }) {
  var [decision, setDecision] = useState(null)
  var [saving, setSaving] = useState(false)
  var feeAmount = (booking.amount * 0.5).toFixed(2)

  var confirm = function() {
    if (!decision) return
    setSaving(true)
    setTimeout(function() {
      onDecision(decision)
      setSaving(false)
      onClose()
    }, 800)
  }

  return (
    <Modal open onClose={onClose} width={480}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:10, color:T.error, letterSpacing:2, fontWeight:700, marginBottom:4 }}>CANCELLATION FEE DECISION</div>
        <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:16 }}>Late Cancellation</div>
        <div style={{ background:T.offwhite, borderRadius:10, padding:'14px 16px', marginBottom:16, border:'1px solid ' + T.border }}>
          <div style={{ fontSize:12, color:T.inkSoft, marginBottom:4 }}>Booking</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{booking.service}</div>
          <div style={{ fontSize:12, color:T.inkSoft }}>{booking.client} - {booking.date}</div>
          <div style={{ fontSize:13, fontWeight:700, color:T.sage, marginTop:4 }}>Original price: {booking.amount}</div>
        </div>
        {booking.cancelReason && (
          <div style={{ background:'#fff8e8', borderRadius:8, padding:'10px 14px', marginBottom:16, border:'1px solid #f0d890' }}>
            <div style={{ fontSize:11, color:'#a06010', fontWeight:700, marginBottom:2 }}>REASON GIVEN</div>
            <div style={{ fontSize:13, color:T.ink }}>{booking.cancelReason}</div>
          </div>
        )}
        <div style={{ fontSize:12, color:T.inkSoft, marginBottom:12 }}>Choose how to handle this cancellation:</div>
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          <div onClick={function() { setDecision('charge') }} style={{
            flex:1, padding:14, borderRadius:10, cursor:'pointer',
            border:'2px solid ' + (decision === 'charge' ? T.error : '#f0c0c0'),
            background: decision === 'charge' ? '#fff0f0' : T.white, textAlign:'center',
          }}>
            <div style={{ fontWeight:700, color:T.error, marginBottom:4 }}>Apply Fee</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{feeAmount}</div>
            <div style={{ fontSize:11, color:T.inkSoft }}>50% of booking value</div>
          </div>
          <div onClick={function() { setDecision('waive') }} style={{
            flex:1, padding:14, borderRadius:10, cursor:'pointer',
            border:'2px solid ' + (decision === 'waive' ? T.sage : T.border),
            background: decision === 'waive' ? T.mint : T.white, textAlign:'center',
          }}>
            <div style={{ fontWeight:700, color:T.moss, marginBottom:4 }}>Waive Fee</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>No charge</div>
            <div style={{ fontSize:11, color:T.inkSoft }}>Goodwill gesture</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={confirm} disabled={!decision || saving} style={{ flex:1, justifyContent:'center' }}>
            {saving ? 'Saving...' : 'Confirm Decision'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ---- MANAGE BOOKING MODAL ----
function ManageBookingModal({ booking, onClose, onSave, onCancelFee }) {
  var [date,     setDate]     = useState(booking.date || '')
  var [time,     setTime]     = useState(booking.time || '')
  var [duration, setDuration] = useState(booking.duration || 60)
  var [status,   setStatus]   = useState(booking.status || 'confirmed')
  var [notes,    setNotes]    = useState(booking.notes || '')
  var [notify,   setNotify]   = useState(true)
  var [saving,   setSaving]   = useState(false)

  var save = function() {
    setSaving(true)
    setTimeout(function() {
      onSave({ ...booking, date, time, duration, status, notes })
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open onClose={onClose} width={520}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>MANAGE BOOKING</div>
        <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:4 }}>{booking.service}</div>
        <div style={{ fontSize:13, color:T.inkSoft, marginBottom:20 }}>{booking.client}</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>DATE</div>
            <input type="date" value={date} onChange={function(e) { setDate(e.target.value) }}
              style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>TIME</div>
            <input type="time" value={time} onChange={function(e) { setTime(e.target.value) }}
              style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>DURATION</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {DURATIONS.map(function(d) {
              return (
                <button key={d.val} onClick={function() { setDuration(d.val) }} style={{
                  padding:'5px 12px', borderRadius:6, fontSize:11, cursor:'pointer',
                  border:'1.5px solid ' + (duration === d.val ? T.forest : T.border),
                  background: duration === d.val ? T.mint : T.white,
                  color: duration === d.val ? T.forest : T.inkMid,
                  fontWeight: duration === d.val ? 700 : 400,
                }}>
                  {d.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>STATUS</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {['confirmed','pending','completed','cancelled','no_show'].map(function(s) {
              return (
                <button key={s} onClick={function() { setStatus(s) }} style={{
                  padding:'5px 12px', borderRadius:6, fontSize:11, cursor:'pointer',
                  border:'1.5px solid ' + (status === s ? T.forest : T.border),
                  background: status === s ? T.mint : T.white,
                  color: status === s ? T.forest : T.inkMid,
                  fontWeight: status === s ? 700 : 400,
                  textTransform:'capitalize',
                }}>
                  {s.replace('_', ' ')}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>INTERNAL NOTES</div>
          <textarea value={notes} onChange={function(e) { setNotes(e.target.value) }}
            placeholder="Private notes about this booking..."
            style={{ width:'100%', height:70, padding:'10px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' }}/>
        </div>

        {booking.cancelReason && booking.feeStatus === 'pending' && (
          <div style={{ background:'#fff0f0', borderRadius:10, padding:'12px 16px', marginBottom:16, border:'1px solid #f0c0c0' }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.error, marginBottom:6 }}>Late cancellation - fee decision required</div>
            <div style={{ fontSize:12, color:T.inkSoft, marginBottom:8 }}>Reason: {booking.cancelReason}</div>
            <Button variant="danger" size="sm" onClick={function() { onCancelFee(booking); onClose() }}>
              Review Cancellation Fee
            </Button>
          </div>
        )}

        <div style={{ display:'flex', gap:10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving} style={{ flex:1, justifyContent:'center' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ---- SERVICE MODAL ----
function ServiceModal({ service, onClose, onSave }) {
  var [name,     setName]     = useState(service ? service.name     : '')
  var [category, setCategory] = useState(service ? service.category : 'Cuts')
  var [price,    setPrice]    = useState(service ? service.price    : '')
  var [duration, setDuration] = useState(service ? service.duration : 60)
  var [popular,  setPopular]  = useState(service ? service.popular  : false)
  var [active,   setActive]   = useState(service ? service.active   : true)
  var [saving,   setSaving]   = useState(false)
  var isNew = !service

  var save = function() {
    if (!name || !price) return
    setSaving(true)
    setTimeout(function() {
      onSave({ id: service ? service.id : Date.now(), name, category, price:parseFloat(price), duration, popular, active })
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open onClose={onClose} width={480}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>
          {isNew ? 'ADD TREATMENT' : 'EDIT TREATMENT'}
        </div>
        <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:20 }}>
          {isNew ? 'Add New Treatment' : 'Edit Treatment'}
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>TREATMENT NAME</div>
          <input value={name} onChange={function(e) { setName(e.target.value) }}
            placeholder="e.g. Full Balayage, Skin Fade, Gel Nails..."
            style={{ width:'100%', padding:'10px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>CATEGORY</div>
            <select value={category} onChange={function(e) { setCategory(e.target.value) }}
              style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none' }}>
              {['Cuts','Colour','Treatments','Styling','Occasions','Nails','Aesthetics','Other'].map(function(c) {
                return <option key={c} value={c}>{c}</option>
              })}
            </select>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>PRICE</div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:T.inkSoft, fontSize:13 }}>GBP</span>
              <input type="number" value={price} onChange={function(e) { setPrice(e.target.value) }}
                placeholder="0.00"
                style={{ width:'100%', padding:'9px 12px 9px 44px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
            </div>
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:8 }}>DURATION</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {DURATIONS.map(function(d) {
              return (
                <button key={d.val} onClick={function() { setDuration(d.val) }} style={{
                  padding:'5px 12px', borderRadius:6, fontSize:11, cursor:'pointer',
                  border:'1.5px solid ' + (duration === d.val ? T.forest : T.border),
                  background: duration === d.val ? T.mint : T.white,
                  color: duration === d.val ? T.forest : T.inkMid,
                  fontWeight: duration === d.val ? 700 : 400,
                }}>
                  {d.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          <div onClick={function() { setPopular(!popular) }} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'8px 14px', borderRadius:8, background: popular ? T.mint : T.offwhite, border:'1px solid ' + (popular ? T.sage : T.border) }}>
            <div style={{ width:16, height:16, borderRadius:4, background: popular ? T.sage : T.border, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {popular && <span style={{ color:T.white, fontSize:10 }}>ok</span>}
            </div>
            <span style={{ fontSize:12, color: popular ? T.forest : T.inkSoft, fontWeight:600 }}>Popular Treatment</span>
          </div>
          <div onClick={function() { setActive(!active) }} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'8px 14px', borderRadius:8, background: active ? T.mint : T.offwhite, border:'1px solid ' + (active ? T.sage : T.border) }}>
            <div style={{ width:32, height:18, borderRadius:10, background: active ? T.sage : T.border, position:'relative', flexShrink:0 }}>
              <div style={{ position:'absolute', top:2, left: active ? 16 : 2, width:14, height:14, borderRadius:'50%', background:T.white, transition:'left 0.2s' }}/>
            </div>
            <span style={{ fontSize:12, color: active ? T.forest : T.inkSoft, fontWeight:600 }}>{active ? 'Active' : 'Paused'}</span>
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!name || !price || saving} style={{ flex:1, justifyContent:'center' }}>
            {saving ? 'Saving...' : (isNew ? 'Add Treatment' : 'Save Changes')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ---- MAIN DASHBOARD ----
export default function Dashboard({ user }) {
  var [tab,              setTab]              = useState('overview')
  var [profile,          setProfile]          = useState(null)
  var [salon,            setSalon]            = useState(null)
  var [loading,          setLoading]          = useState(true)
  var [bookings,         setBookings]         = useState([])
  var [services,         setServices]         = useState([])
  var [managingBooking,  setManagingBooking]  = useState(null)
  var [cancelFeeBooking, setCancelFeeBooking] = useState(null)
  var [editingService,   setEditingService]   = useState(null)
  var [filterStatus,     setFilterStatus]     = useState('all')
  var navigate = useNavigate()

  useEffect(function() { loadData() }, [])

  var loadData = async function() {
    setLoading(true)
    var prof = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof.data)
    var sal = await supabase.from('salons').select('*').eq('owner_id', user.id).single()
    setSalon(sal.data)
    if (sal.data) {
      var bk = await supabase.from('bookings').select('*').eq('salon_id', sal.data.id).order('booking_date', { ascending:false })
      if (bk.data) setBookings(bk.data)
      var sv = await supabase.from('services').select('*').eq('salon_id', sal.data.id).order('created_at')
      if (sv.data) setServices(sv.data)
    }
    setLoading(false)
  }

  var plan = salon ? (salon.plan || 'free') : 'free'
  var planLevel = plan === 'premium' ? 3 : plan === 'standard' ? 2 : 1

  var canAccess = function(feature) {
    var req = { bookings:1, services:1, overview:1, payments:1, settings:1, calendar:2, analytics:2, clients:2, gallery:2, reviews:2, notifications:2, offers:3 }
    return planLevel >= (req[feature] || 1)
  }

  var pendingCount = bookings.filter(function(b) { return b.status === 'pending' }).length
  var feeCount = bookings.filter(function(b) { return b.cancelReason && b.feeStatus === 'pending' }).length
  var totalRevenue = bookings.filter(function(b) { return b.status === 'completed' }).reduce(function(a, b) { return a + b.amount }, 0)
  var maxR = Math.max.apply(null, REVENUE.map(function(r) { return r.v }))

  var TABS = ['overview','bookings','services','calendar','clients','offers','gallery','reviews','analytics','notifications','payments','settings']

  var updateBooking = function(updated) {
    setBookings(function(prev) { return prev.map(function(b) { return b.id === updated.id ? updated : b }) })
  }

  var saveService = function(s) {
    setServices(function(prev) {
      var exists = prev.find(function(x) { return x.id === s.id })
      return exists ? prev.map(function(x) { return x.id === s.id ? s : x }) : [...prev, s]
    })
  }

  var filteredBookings = bookings.filter(function(b) {
    return filterStatus === 'all' || b.status === filterStatus
  })

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:T.cream, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.body }}>
        <style>{GLOBAL_CSS}</style>
        <Spinner size={32}/>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>

      <nav style={{ background:T.forest, padding:'0 24px', height:62, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontSize:16, color:T.white }}>E</div>
          <span style={{ fontFamily:F.display, fontSize:20, color:T.white }}>Eden</span>
          <span style={{ fontSize:10, background:'rgba(255,255,255,0.15)', color:T.white, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>BUSINESS</span>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{user.email}</span>
          <button onClick={function() { navigate('/') }} style={{ padding:'6px 14px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:T.white, cursor:'pointer', fontSize:12 }}>View Site</button>
          <button onClick={async function() { await signOut(); navigate('/') }} style={{ padding:'6px 14px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:T.white, cursor:'pointer', fontSize:12 }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ display:'flex', minHeight:'calc(100vh - 62px)' }}>

        <div style={{ width:200, background:T.white, borderRight:'1px solid ' + T.border, padding:'20px 0', flexShrink:0 }}>
          {TABS.map(function(t) {
            var locked = !canAccess(t)
            return (
              <button key={t} onClick={function() { if (!locked) setTab(t) }} style={{
                width:'100%', padding:'11px 20px',
                background: tab === t ? T.mint : 'none',
                border:'none', borderLeft:'3px solid ' + (tab === t ? T.forest : 'transparent'),
                color: locked ? T.inkFaint : (tab === t ? T.forest : T.inkSoft),
                fontSize:13, fontWeight: tab === t ? 700 : 400,
                cursor: locked ? 'not-allowed' : 'pointer',
                textAlign:'left', textTransform:'capitalize', transition:'all 0.15s',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                opacity: locked ? 0.5 : 1,
              }}>
                <span>{t}</span>
                <span>
                  {locked && '  lock'}
                  {t === 'bookings' && !locked && pendingCount > 0 && (
                    <span style={{ background:T.gold, color:T.white, borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 6px', marginLeft:4 }}>{pendingCount}</span>
                  )}
                  {t === 'bookings' && !locked && feeCount > 0 && (
                    <span style={{ background:T.error, color:T.white, borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 6px', marginLeft:4 }}>fee</span>
                  )}
                </span>
              </button>
            )
          })}
          <div style={{ margin:'20px 12px 0', padding:'12px', background:T.offwhite, borderRadius:8, border:'1px solid ' + T.border }}>
            <div style={{ fontSize:9, color:T.inkFaint, fontWeight:700, letterSpacing:2, marginBottom:4 }}>YOUR PLAN</div>
            <PlanBadge plan={plan}/>
            <button onClick={function() { setTab('payments') }} style={{ display:'block', fontSize:10, color:T.sage, background:'none', border:'none', cursor:'pointer', padding:0, marginTop:6 }}>Manage plan</button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'28px' }}>

          {tab === 'overview' && (
            <div>
              <div style={{ fontFamily:F.display, fontSize:26, color:T.forest, marginBottom:4 }}>
                {salon ? ('Welcome back, ' + (salon.name || 'your salon')) : 'Welcome to Eden'}
              </div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>
                {salon ? ("Here's your business at a glance") : 'Get started by listing your business'}
              </div>

              {!salon && (
                <div style={{ background:T.white, borderRadius:14, padding:28, marginBottom:24, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:8 }}>List Your Business</div>
                  <div style={{ fontSize:14, color:T.inkSoft, marginBottom:20, maxWidth:400, margin:'0 auto 20px' }}>
                    You do not have a salon listed yet. Register your business to start taking bookings through Eden.
                  </div>
                  <Button variant="primary" onClick={function() { navigate('/list-business') }}>
                    List Your Business
                  </Button>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:24 }}>
                {[
                  { label:'This Month Revenue', value:'GBP ' + totalRevenue.toLocaleString() },
                  { label:'Total Bookings',      value:bookings.length                        },
                  { label:'Pending Bookings',    value:pendingCount                           },
                  { label:'Active Services',     value:services.filter(function(s) { return s.active }).length },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background:T.white, borderRadius:12, padding:'18px 16px', border:'1px solid ' + T.border }}>
                      <div style={{ fontFamily:F.display, fontSize:28, color:T.forest, lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:11, color:T.inkSoft, marginTop:6 }}>{s.label}</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background:T.white, borderRadius:12, padding:20, border:'1px solid ' + T.border }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:16 }}>Revenue - Last 6 Months</div>
                <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:120 }}>
                  {REVENUE.map(function(r) {
                    return (
                      <div key={r.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div style={{ fontSize:9, color:T.inkFaint }}>GBP{(r.v/1000).toFixed(1)}k</div>
                        <div style={{ width:'100%', background:T.forest, borderRadius:'4px 4px 0 0', height: Math.round((r.v / maxR) * 90) + 'px' }}/>
                        <div style={{ fontSize:9, color:T.inkSoft }}>{r.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'bookings' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>Bookings</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {['all','confirmed','pending','completed','cancelled'].map(function(s) {
                    return (
                      <button key={s} onClick={function() { setFilterStatus(s) }} style={{
                        padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer',
                        border:'1.5px solid ' + (filterStatus === s ? T.forest : T.border),
                        background: filterStatus === s ? T.mint : T.white,
                        color: filterStatus === s ? T.forest : T.inkSoft,
                        textTransform:'capitalize',
                      }}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              {feeCount > 0 && (
                <div style={{ background:'#fff0f0', borderRadius:10, padding:'12px 16px', marginBottom:16, border:'1px solid #f0c0c0' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.error, marginBottom:4 }}>
                    {feeCount} cancellation{feeCount > 1 ? 's' : ''} requiring fee decision
                  </div>
                  <div style={{ fontSize:12, color:T.inkSoft }}>Review each booking and decide whether to apply or waive the cancellation fee.</div>
                </div>
              )}

              <div style={{ background:T.white, borderRadius:12, border:'1px solid ' + T.border, overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid ' + T.border, background:T.offwhite }}>
                      {['Client','Service','Date','Time','Duration','Amount','Status',''].map(function(h) {
                        return <th key={h} style={{ textAlign:'left', padding:'10px 14px', fontSize:10, color:T.inkSoft, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{h}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(function(b, i) {
                      return (
                        <tr key={b.id} style={{ borderBottom:'1px solid ' + T.border, background: i % 2 === 0 ? T.white : T.offwhite }}>
                          <td style={{ padding:'12px 14px' }}>
                            <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{b.client}</div>
                            <div style={{ fontSize:11, color:T.inkSoft }}>{b.email}</div>
                          </td>
                          <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{b.service}</td>
                          <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{b.date}</td>
                          <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{b.time}</td>
                          <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{fmtDur(b.duration)}</td>
                          <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:T.forest }}>GBP{b.amount}</td>
                          <td style={{ padding:'12px 14px' }}><StatusBadge status={b.status}/></td>
                          <td style={{ padding:'12px 14px' }}>
                            <button onClick={function() { setManagingBooking(b) }} style={{ padding:'5px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:6, color:T.inkMid, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                              Manage
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredBookings.length === 0 && (
                  <div style={{ padding:32, textAlign:'center', color:T.inkSoft, fontSize:14 }}>No bookings found</div>
                )}
              </div>
            </div>
          )}

          {tab === 'services' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:4 }}>Services and Treatments</div>
                  <div style={{ fontSize:13, color:T.inkSoft }}>Manage your treatments, prices and estimated durations</div>
                </div>
                <Button variant="primary" onClick={function() { setEditingService({}) }}>+ Add Treatment</Button>
              </div>

              <div style={{ background:'#f0f8f0', borderRadius:8, padding:'10px 14px', marginBottom:16, border:'1px solid ' + T.sagePale, fontSize:12, color:T.sage }}>
                The duration you set here is shown to customers when they book - it helps them plan their day. You can always adjust the duration of individual appointments from the Bookings tab.
              </div>

              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                {['All','Active','Paused'].map(function(f) {
                  return (
                    <button key={f} style={{ padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', border:'1.5px solid ' + T.border, background:T.white, color:T.inkSoft }}>
                      {f} ({f === 'All' ? services.length : f === 'Active' ? services.filter(function(s) { return s.active }).length : services.filter(function(s) { return !s.active }).length})
                    </button>
                  )
                })}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {services.map(function(s) {
                  return (
                    <div key={s.id} style={{ background:T.white, borderRadius:10, padding:'16px 20px', border:'1px solid ' + T.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{ fontFamily:F.display, fontSize:16, color:T.forest }}>{s.name}</span>
                          {s.popular && <span style={{ fontSize:9, background:T.goldPale, color:T.gold, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>POPULAR</span>}
                          {!s.active && <span style={{ fontSize:9, background:T.offwhite, color:T.inkFaint, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>PAUSED</span>}
                        </div>
                        <div style={{ fontSize:12, color:T.inkSoft }}>{s.category} - {fmtDur(s.duration)}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <span style={{ fontFamily:F.display, fontSize:20, color:T.forest }}>GBP{s.price}</span>
                        <button onClick={function() { setEditingService(s) }} style={{ padding:'6px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:6, color:T.inkMid, fontSize:11, fontWeight:600, cursor:'pointer' }}>Edit</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:4 }}>Payments</div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>Manage your subscription and payment settings</div>

              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border, marginBottom:20 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:16 }}>Current Plan</div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <PlanBadge plan={plan}/>
                  <span style={{ fontSize:14, color:T.inkSoft }}>
                    {plan === 'free' ? 'Free forever' : plan === 'standard' ? 'GBP59 per month' : 'GBP119 per month'}
                  </span>
                </div>
                {plan === 'free' && (
                  <div style={{ display:'flex', gap:12 }}>
                    <Button variant="primary" onClick={function() { alert('Stripe checkout coming soon') }}>Upgrade to Growth - GBP59/mo</Button>
                    <Button variant="secondary" onClick={function() { alert('Stripe checkout coming soon') }}>Upgrade to Premium - GBP119/mo</Button>
                  </div>
                )}
              </div>

              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:8 }}>Stripe Connect</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16 }}>Connect your Stripe account to receive booking payments directly.</div>
                <Button variant="primary" onClick={function() { window.open('https://stripe.com/connect', '_blank') }}>Connect with Stripe</Button>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:20 }}>Settings</div>
              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border }}>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[
                    { label:'Business Name',    value: salon ? salon.name     : 'Not set' },
                    { label:'Email Address',    value: salon ? salon.email    : user.email },
                    { label:'Phone Number',     value: salon ? salon.phone    : 'Not set' },
                    { label:'Address',          value: salon ? salon.address_line1 : 'Not set' },
                    { label:'City',             value: salon ? salon.city     : 'Not set' },
                    { label:'Postcode',         value: salon ? salon.postcode : 'Not set' },
                  ].map(function(s, i) {
                    return (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid ' + T.border }}>
                        <div style={{ fontSize:13, color:T.inkSoft }}>{s.label}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{s.value}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {['calendar','clients','offers','gallery','reviews','analytics','notifications'].map(function(t) {
            if (tab !== t) return null
            if (!canAccess(t)) {
              return (
                <div key={t} style={{ background:T.white, borderRadius:12, padding:40, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:16 }}>lock</div>
                  <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:8, textTransform:'capitalize' }}>{t}</div>
                  <div style={{ fontSize:14, color:T.inkSoft, marginBottom:20 }}>
                    This feature is available on {t === 'offers' ? 'Premium' : 'Growth'} plan and above.
                  </div>
                  <Button variant="primary" onClick={function() { setTab('payments') }}>Upgrade Plan</Button>
                </div>
              )
            }
            return (
              <div key={t} style={{ background:T.white, borderRadius:12, padding:32, border:'1px solid ' + T.border, textAlign:'center' }}>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:8, textTransform:'capitalize' }}>{t}</div>
                <div style={{ fontSize:14, color:T.inkSoft }}>This section is coming soon. Your data will appear here once connected.</div>
              </div>
            )
          })}

        </div>
      </div>

      {managingBooking && (
        <ManageBookingModal
          booking={managingBooking}
          onClose={function() { setManagingBooking(null) }}
          onSave={function(u) { updateBooking(u); setManagingBooking(null) }}
          onCancelFee={function(b) { setManagingBooking(null); setCancelFeeBooking(b) }}
        />
      )}

      {cancelFeeBooking && (
        <CancellationFeeModal
          booking={cancelFeeBooking}
          onClose={function() { setCancelFeeBooking(null) }}
          onDecision={function(d) {
            updateBooking({ ...cancelFeeBooking, feeStatus: d === 'charge' ? 'charged' : 'waived' })
            setCancelFeeBooking(null)
          }}
        />
      )}

      {editingService !== null && (
        <ServiceModal
          service={editingService && editingService.id ? editingService : null}
          onClose={function() { setEditingService(null) }}
          onSave={function(s) { saveService(s); setEditingService(null) }}
        />
      )}

    </div>
  )
}
