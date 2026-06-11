import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Button, Spinner, Modal } from '../lib/design'
import {
  EdenLogo, IconChart, IconCalendar, IconUser, IconSettings,
  IconBell, IconPhoto, IconReview, IconCard, IconLock,
  IconCheck, IconClose, IconClock, IconStar, IconSearch
} from '../lib/icons'

//  DURATION OPTIONS 
const DURATIONS = [
  { val:15,  label:'15 min'  },
  { val:30,  label:'30 min'  },
  { val:45,  label:'45 min'  },
  { val:60,  label:'1 hour'  },
  { val:75,  label:'1h 15m'  },
  { val:90,  label:'1h 30m'  },
  { val:120, label:'2 hours' },
  { val:150, label:'2h 30m'  },
  { val:180, label:'3 hours' },
  { val:240, label:'4 hours' },
  { val:300, label:'5 hours' },
]

function fmtDur(d) {
  if (!d) return ''
  if (d < 60) return d + ' min'
  var h = Math.floor(d / 60), m = d % 60
  return m > 0 ? (h + 'h ' + m + 'm') : (h + ' hour' + (h > 1 ? 's' : ''))
}

//  STATUS STYLES 
var SS = {
  confirmed: { bg:T.mint,    color:T.moss,    border:T.sagePale, label:'Confirmed' },
  pending:   { bg:'#fff8e8', color:'#a06010', border:'#f0d890',  label:'Pending'   },
  completed: { bg:'#f0f4ff', color:'#3050a0', border:'#d0d8f8',  label:'Completed' },
  cancelled: { bg:'#fff0f0', color:T.error,   border:'#f0c0c0',  label:'Cancelled' },
  no_show:   { bg:'#fff0f0', color:T.error,   border:'#f0c0c0',  label:'No Show'   },
}

//  REVENUE CHART DATA 
var REVENUE = [
  { label:'Jan', v:0 }, { label:'Feb', v:0 }, { label:'Mar', v:0 },
  { label:'Apr', v:0 }, { label:'May', v:0 }, { label:'Jun', v:0 },
]

//  STATUS BADGE 
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

//  PLAN BADGE 
function PlanBadge({ plan }) {
  var styles = {
    free:     { bg:T.offwhite, color:T.inkSoft, label:'Starter' },
    standard: { bg:T.mint,     color:T.moss,    label:'Growth'  },
    premium:  { bg:T.goldPale, color:T.gold,    label:'Premium' },
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

//  TOGGLE SWITCH 
function Toggle({ value, onChange, label, sub }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:T.offwhite, borderRadius:10, padding:'12px 16px', border:'1px solid ' + T.border }}>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:T.inkFaint, marginTop:2 }}>{sub}</div>}
      </div>
      <div onClick={function() { onChange(!value) }} style={{ width:44, height:24, borderRadius:12, background:value ? T.sage : T.border, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
        <div style={{ position:'absolute', top:3, left:value ? 23 : 3, width:18, height:18, borderRadius:'50%', background:T.white, boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
      </div>
    </div>
  )
}

//  CANCELLATION FEE MODAL 
function CancellationFeeModal({ booking, onClose, onDecision }) {
  var [decision, setDecision] = useState(null)
  var [saving, setSaving] = useState(false)
  var feeAmount = ((booking.amount || 0) * 0.5).toFixed(2)

  var confirm = function() {
    if (!decision) return
    setSaving(true)
    setTimeout(function() { onDecision(decision); setSaving(false); onClose() }, 800)
  }

  return (
    <Modal open onClose={onClose} width={480}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:10, color:T.error, letterSpacing:2, fontWeight:700, marginBottom:4 }}>CANCELLATION FEE DECISION</div>
        <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:16 }}>Late Cancellation</div>
        <div style={{ background:T.offwhite, borderRadius:10, padding:'14px 16px', marginBottom:16, border:'1px solid ' + T.border }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{booking.service_name || booking.service}</div>
          <div style={{ fontSize:12, color:T.inkSoft }}>{booking.customer_name || booking.client} - {booking.booking_date || booking.date}</div>
          <div style={{ fontSize:13, fontWeight:700, color:T.sage, marginTop:4 }}>Original price: GBP {booking.amount}</div>
        </div>
        {booking.cancellation_reason && (
          <div style={{ background:'#fff8e8', borderRadius:8, padding:'10px 14px', marginBottom:16, border:'1px solid #f0d890' }}>
            <div style={{ fontSize:11, color:'#a06010', fontWeight:700, marginBottom:2 }}>REASON GIVEN</div>
            <div style={{ fontSize:13, color:T.ink }}>{booking.cancellation_reason}</div>
          </div>
        )}
        <div style={{ fontSize:12, color:T.inkSoft, marginBottom:12 }}>Choose how to handle this cancellation:</div>
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          <div onClick={function() { setDecision('charge') }} style={{ flex:1, padding:14, borderRadius:10, cursor:'pointer', border:'2px solid ' + (decision === 'charge' ? T.error : '#f0c0c0'), background:decision === 'charge' ? '#fff0f0' : T.white, textAlign:'center' }}>
            <div style={{ fontWeight:700, color:T.error, marginBottom:4 }}>Apply Fee</div>
            <div style={{ fontSize:20, fontWeight:700, color:T.ink, fontFamily:F.display }}>GBP {feeAmount}</div>
            <div style={{ fontSize:11, color:T.inkSoft }}>50% of booking value</div>
          </div>
          <div onClick={function() { setDecision('waive') }} style={{ flex:1, padding:14, borderRadius:10, cursor:'pointer', border:'2px solid ' + (decision === 'waive' ? T.sage : T.border), background:decision === 'waive' ? T.mint : T.white, textAlign:'center' }}>
            <div style={{ fontWeight:700, color:T.moss, marginBottom:4 }}>Waive Fee</div>
            <div style={{ fontSize:20, fontWeight:700, color:T.ink, fontFamily:F.display }}>No charge</div>
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

//  MANAGE BOOKING MODAL 
function ManageBookingModal({ booking, onClose, onSave, onCancelFee }) {
  var [date,     setDate]     = useState(booking.booking_date || booking.date || '')
  var [time,     setTime]     = useState(booking.booking_time || booking.time || '')
  var [duration, setDuration] = useState(booking.duration || 60)
  var [status,   setStatus]   = useState(booking.status || 'confirmed')
  var [notes,    setNotes]    = useState(booking.internal_notes || booking.notes || '')
  var [notify,   setNotify]   = useState(true)
  var [saving,   setSaving]   = useState(false)
  var name = booking.customer_name || booking.client || ''
  var service = booking.service_name || booking.service || ''
  var hasFee = (booking.cancellation_reason || booking.cancelReason) && (booking.fee_status === 'pending' || booking.feeStatus === 'pending')

  var save = function() {
    setSaving(true)
    setTimeout(function() {
      onSave({ ...booking, booking_date:date, booking_time:time, duration, status, internal_notes:notes })
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open onClose={onClose} width={540}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>MANAGE BOOKING</div>
            <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:2 }}>{service}</div>
            <div style={{ fontSize:13, color:T.inkSoft }}>{name}</div>
          </div>
          <StatusBadge status={status}/>
        </div>

        <div style={{ background:T.offwhite, borderRadius:10, padding:'12px 16px', marginBottom:20, border:'1px solid ' + T.border }}>
          <div style={{ display:'flex', gap:20, fontSize:13 }}>
            <span style={{ color:T.inkSoft }}>Email: <strong style={{ color:T.ink }}>{booking.customer_email || booking.email || 'N/A'}</strong></span>
            <span style={{ color:T.inkSoft }}>Phone: <strong style={{ color:T.ink }}>{booking.customer_phone || booking.phone || 'N/A'}</strong></span>
            <span style={{ color:T.inkSoft }}>Amount: <strong style={{ color:T.forest }}>GBP {booking.amount || 0}</strong></span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>DATE</div>
            <input type="date" value={date} onChange={function(e) { setDate(e.target.value) }} style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>TIME</div>
            <input type="time" value={time} onChange={function(e) { setTime(e.target.value) }} style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:8 }}>DURATION</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {DURATIONS.map(function(d) {
              return (
                <button key={d.val} onClick={function() { setDuration(d.val) }} style={{ padding:'5px 12px', borderRadius:6, fontSize:11, cursor:'pointer', border:'1.5px solid ' + (duration === d.val ? T.forest : T.border), background:duration === d.val ? T.mint : T.white, color:duration === d.val ? T.forest : T.inkMid, fontWeight:duration === d.val ? 700 : 400 }}>
                  {d.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:8 }}>STATUS</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {['confirmed','pending','completed','cancelled','no_show'].map(function(s) {
              return (
                <button key={s} onClick={function() { setStatus(s) }} style={{ padding:'6px 14px', borderRadius:6, fontSize:11, cursor:'pointer', border:'1.5px solid ' + (status === s ? T.forest : T.border), background:status === s ? T.mint : T.white, color:status === s ? T.forest : T.inkMid, fontWeight:status === s ? 700 : 400, textTransform:'capitalize' }}>
                  {s.replace('_', ' ')}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>INTERNAL NOTES</div>
          <textarea value={notes} onChange={function(e) { setNotes(e.target.value) }} placeholder="Private notes about this booking (not visible to client)..." style={{ width:'100%', height:70, padding:'10px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' }}/>
        </div>

        <Toggle value={notify} onChange={setNotify} label="Notify client of changes" sub="Send email notification when you save"/>

        {hasFee && (
          <div style={{ background:'#fff0f0', borderRadius:10, padding:'12px 16px', marginTop:14, border:'1px solid #f0c0c0' }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.error, marginBottom:6 }}>Late cancellation - fee decision required</div>
            <div style={{ fontSize:12, color:T.inkSoft, marginBottom:8 }}>Reason: {booking.cancellation_reason || booking.cancelReason}</div>
            <Button variant="danger" size="sm" onClick={function() { onCancelFee(booking); onClose() }}>Review Cancellation Fee</Button>
          </div>
        )}

        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving} style={{ flex:1, justifyContent:'center' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

//  SERVICE MODAL (no category dropdown) 
function ServiceModal({ service, onClose, onSave }) {
  var [name,    setName]    = useState(service ? service.name     : '')
  var [price,   setPrice]   = useState(service ? service.price    : '')
  var [duration,setDuration]= useState(service ? service.duration : 60)
  var [popular, setPopular] = useState(service ? service.popular  : false)
  var [active,  setActive]  = useState(service ? (service.active !== false) : true)
  var [saving,  setSaving]  = useState(false)
  var isNew = !service || !service.id

  var save = function() {
    if (!name || !price) return
    setSaving(true)
    setTimeout(function() {
      onSave({ id:service && service.id ? service.id : Date.now(), name, price:parseFloat(price), duration, popular, active })
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open onClose={onClose} width={480}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>{isNew ? 'ADD TREATMENT' : 'EDIT TREATMENT'}</div>
        <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:20 }}>{isNew ? 'Add New Treatment' : 'Edit Treatment'}</div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>TREATMENT NAME</div>
          <input value={name} onChange={function(e) { setName(e.target.value) }} placeholder="e.g. Full Balayage, Skin Fade, Gel Nails..." style={{ width:'100%', padding:'10px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>PRICE</div>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:T.inkSoft, fontSize:13, fontWeight:600 }}>GBP</span>
            <input type="number" value={price} onChange={function(e) { setPrice(e.target.value) }} placeholder="0.00" style={{ width:'100%', padding:'10px 12px 10px 52px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:8 }}>DURATION</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {DURATIONS.map(function(d) {
              return (
                <button key={d.val} onClick={function() { setDuration(d.val) }} style={{ padding:'6px 14px', borderRadius:6, fontSize:11, cursor:'pointer', border:'1.5px solid ' + (duration === d.val ? T.forest : T.border), background:duration === d.val ? T.mint : T.white, color:duration === d.val ? T.forest : T.inkMid, fontWeight:duration === d.val ? 700 : 400 }}>
                  {d.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:24 }}>
          <div onClick={function() { setPopular(!popular) }} style={{ flex:1, padding:'10px 14px', borderRadius:8, cursor:'pointer', border:'1.5px solid ' + (popular ? T.sage : T.border), background:popular ? T.mint : T.white, textAlign:'center' }}>
            <div style={{ fontSize:12, fontWeight:700, color:popular ? T.forest : T.inkSoft }}>Popular Treatment</div>
            <div style={{ fontSize:10, color:T.inkFaint }}>Shows popular badge on listing</div>
          </div>
          <div onClick={function() { setActive(!active) }} style={{ flex:1, padding:'10px 14px', borderRadius:8, cursor:'pointer', border:'1.5px solid ' + (active ? T.sage : T.border), background:active ? T.mint : T.white, textAlign:'center' }}>
            <div style={{ fontSize:12, fontWeight:700, color:active ? T.forest : T.inkSoft }}>{active ? 'Active' : 'Paused'}</div>
            <div style={{ fontSize:10, color:T.inkFaint }}>Visible to customers booking</div>
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

//  OFFER MODAL 
function OfferModal({ offer, onClose, onSave }) {
  var [title,    setTitle]    = useState(offer ? offer.title    : '')
  var [code,     setCode]     = useState(offer ? offer.code     : '')
  var [discount, setDiscount] = useState(offer ? offer.discount_percent : 10)
  var [expires,  setExpires]  = useState(offer ? offer.expires_at : '')
  var [saving,   setSaving]   = useState(false)

  var save = function() {
    if (!title || !code) return
    setSaving(true)
    setTimeout(function() {
      onSave({ id:offer && offer.id ? offer.id : Date.now(), title, code, discount_percent:discount, expires_at:expires, active:true, usage_count:offer ? offer.usage_count : 0 })
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open onClose={onClose} width={440}>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>PROMOTIONAL OFFER</div>
        <div style={{ fontFamily:F.display, fontSize:20, color:T.forest, marginBottom:20 }}>{offer ? 'Edit Offer' : 'Create Offer'}</div>

        {[
          { label:'OFFER TITLE', val:title, set:setTitle, ph:'e.g. Summer Special, New Client Discount' },
          { label:'PROMO CODE',  val:code,  set:setCode,  ph:'e.g. SUMMER20, WELCOME10' },
        ].map(function(f) {
          return (
            <div key={f.label} style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>{f.label}</div>
              <input value={f.val} onChange={function(e) { f.set(e.target.value) }} placeholder={f.ph} style={{ width:'100%', padding:'10px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
            </div>
          )
        })}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>DISCOUNT %</div>
            <select value={discount} onChange={function(e) { setDiscount(Number(e.target.value)) }} style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none' }}>
              {[5,10,15,20,25,30,40,50].map(function(n) { return <option key={n} value={n}>{n}% off</option> })}
            </select>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, marginBottom:6 }}>EXPIRY DATE</div>
            <input type="date" value={expires} onChange={function(e) { setExpires(e.target.value) }} style={{ width:'100%', padding:'9px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!title || !code || saving} style={{ flex:1, justifyContent:'center' }}>
            {saving ? 'Saving...' : (offer ? 'Save Changes' : 'Create Offer')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

//  MAIN DASHBOARD 
export default function Dashboard({ user }) {
  var [tab,              setTab]              = useState('overview')
  var [profile,          setProfile]          = useState(null)
  var [salon,            setSalon]            = useState(null)
  var [loading,          setLoading]          = useState(true)
  var [bookings,         setBookings]         = useState([])
  var [services,         setServices]         = useState([])
  var [offers,           setOffers]           = useState([])
  var [reviews,          setReviews]          = useState([])
  var [managingBooking,  setManagingBooking]  = useState(null)
  var [cancelFeeBooking, setCancelFeeBooking] = useState(null)
  var [editingService,   setEditingService]   = useState(null)
  var [editingOffer,     setEditingOffer]     = useState(null)
  var [filterStatus,     setFilterStatus]     = useState('all')
  var [svcFilter,        setSvcFilter]        = useState('all')
  var [notifs,           setNotifs]           = useState({ email_booking:true, email_reminder:true, email_cancel:true, sms_booking:false, sms_reminder:false })
  var navigate = useNavigate()

  useEffect(function() { loadData() }, [])

  var loadData = async function() {
    setLoading(true)
    var prof = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof.data)
    var sal = await supabase.from('salons').select('*').eq('owner_id', user.id).single()
    setSalon(sal.data)
    if (sal.data) {
      var sid = sal.data.id
      var bk = await supabase.from('bookings').select('*').eq('salon_id', sid).order('booking_date', { ascending:false })
      if (bk.data) setBookings(bk.data)
      var sv = await supabase.from('services').select('*').eq('salon_id', sid).order('created_at')
      if (sv.data) setServices(sv.data)
      var of = await supabase.from('offers').select('*').eq('salon_id', sid)
      if (of.data) setOffers(of.data)
      var rv = await supabase.from('reviews').select('*').eq('salon_id', sid).order('created_at', { ascending:false })
      if (rv.data) setReviews(rv.data)
    }
    setLoading(false)
  }

  var saveService = async function(s) {
    if (!salon) return
    var data = { salon_id:salon.id, name:s.name, price:s.price, duration:s.duration, popular:s.popular, active:s.active }
    if (s.id && typeof s.id === 'string' && s.id.length > 10) {
      await supabase.from('services').update(data).eq('id', s.id)
    } else {
      await supabase.from('services').insert(data)
    }
    loadData()
  }

  var saveOffer = async function(o) {
    if (!salon) return
    var data = { salon_id:salon.id, title:o.title, code:o.code, discount_percent:o.discount_percent, expires_at:o.expires_at, active:true }
    if (o.id && typeof o.id === 'string' && o.id.length > 10) {
      await supabase.from('offers').update(data).eq('id', o.id)
    } else {
      await supabase.from('offers').insert(data)
    }
    loadData()
  }

  var replyToReview = async function(reviewId, reply) {
    await supabase.from('reviews').update({ reply }).eq('id', reviewId)
    loadData()
  }

  var plan = salon ? (salon.plan || 'free') : 'free'
  var planLevel = plan === 'premium' ? 3 : plan === 'standard' ? 2 : 1

  var canAccess = function(feature) {
    var req = { bookings:1, services:1, overview:1, payments:1, settings:1, calendar:2, analytics:2, clients:2, gallery:2, reviews:2, notifications:2, offers:3 }
    return planLevel >= (req[feature] || 1)
  }

  var pendingCount    = bookings.filter(function(b) { return b.status === 'pending' }).length
  var feeCount        = bookings.filter(function(b) { return b.cancellation_reason && b.fee_status === 'pending' }).length
  var totalRevenue    = bookings.filter(function(b) { return b.status === 'completed' }).reduce(function(a,b) { return a + (b.amount || 0) }, 0)
  var activeServices  = services.filter(function(s) { return s.active }).length
  var avgRating       = reviews.length > 0 ? (reviews.reduce(function(a,r) { return a + (r.rating || 0) }, 0) / reviews.length).toFixed(1) : '0.0'

  var filteredBookings = bookings.filter(function(b) { return filterStatus === 'all' || b.status === filterStatus })
  var filteredServices = services.filter(function(s) { return svcFilter === 'all' || (svcFilter === 'active' && s.active) || (svcFilter === 'paused' && !s.active) })

  var updateBooking = function(updated) {
    setBookings(function(prev) { return prev.map(function(b) { return b.id === updated.id ? updated : b }) })
  }

  var TABS = ['overview','bookings','services','calendar','clients','offers','gallery','reviews','analytics','notifications','payments','settings']

  var maxR = Math.max.apply(null, REVENUE.map(function(r) { return r.v }).concat([1]))

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:T.cream, display:'flex', alignItems:'center', justifyContent:'center' }}>
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
          <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <EdenLogo size={22} color={T.white}/>
          </div>
          <span style={{ fontFamily:F.display, fontSize:20, color:T.white }}>Eden</span>
          <span style={{ fontSize:10, background:'rgba(255,255,255,0.15)', color:T.white, padding:'2px 8px', borderRadius:10, fontWeight:700, letterSpacing:1 }}>BUSINESS</span>
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
              <button key={t} onClick={function() { if (!locked) setTab(t) }} style={{ width:'100%', padding:'11px 20px', background:tab === t ? T.mint : 'none', border:'none', borderLeft:'3px solid ' + (tab === t ? T.forest : 'transparent'), color:locked ? T.inkFaint : (tab === t ? T.forest : T.inkSoft), fontSize:13, fontWeight:tab === t ? 700 : 400, cursor:locked ? 'not-allowed' : 'pointer', textAlign:'left', textTransform:'capitalize', transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'space-between', opacity:locked ? 0.5 : 1 }}>
                <span>{t}</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                  {locked && <IconLock size={11} color={T.inkFaint}/>}
                  {t === 'bookings' && !locked && pendingCount > 0 && <span style={{ background:T.gold, color:T.white, borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 6px' }}>{pendingCount}</span>}
                  {t === 'bookings' && !locked && feeCount > 0 && <span style={{ background:T.error, color:T.white, borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 6px' }}>fee</span>}
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

          {/*  OVERVIEW  */}
          {tab === 'overview' && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:26, color:T.forest, marginBottom:4 }}>
                {salon ? ('Welcome back - ' + salon.name) : 'Welcome to Eden'}
              </div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>
                {salon ? "Here's your business overview" : 'Get started by listing your business below'}
              </div>

              {!salon && (
                <div style={{ background:T.white, borderRadius:14, padding:32, marginBottom:24, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:8 }}>List Your Business</div>
                  <div style={{ fontSize:14, color:T.inkSoft, marginBottom:20 }}>Register your business to start taking bookings through Eden.</div>
                  <Button variant="primary" onClick={function() { navigate('/list-business') }}>List Your Business</Button>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:24 }}>
                {[
                  { label:'Revenue This Month', value:'GBP ' + totalRevenue.toLocaleString() },
                  { label:'Total Bookings',     value:bookings.length                        },
                  { label:'Pending Bookings',   value:pendingCount                           },
                  { label:'Active Treatments',  value:activeServices                         },
                  { label:'Reviews',            value:reviews.length                         },
                  { label:'Avg Rating',         value:avgRating + ' / 5'                    },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background:T.white, borderRadius:12, padding:'18px 16px', border:'1px solid ' + T.border }}>
                      <div style={{ fontFamily:F.display, fontSize:26, color:T.forest, lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:11, color:T.inkSoft, marginTop:6 }}>{s.label}</div>
                    </div>
                  )
                })}
              </div>

              {feeCount > 0 && (
                <div style={{ background:'#fff0f0', borderRadius:12, padding:'14px 18px', marginBottom:16, border:'1px solid #f0c0c0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.error }}>Late cancellation fee decision required</div>
                    <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{feeCount} booking{feeCount > 1 ? 's' : ''} awaiting your decision</div>
                  </div>
                  <Button variant="danger" size="sm" onClick={function() { setTab('bookings') }}>Review Now</Button>
                </div>
              )}

              <div style={{ background:T.white, borderRadius:12, padding:20, border:'1px solid ' + T.border }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:16 }}>Revenue - Last 6 Months</div>
                <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:120 }}>
                  {REVENUE.map(function(r) {
                    return (
                      <div key={r.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div style={{ fontSize:9, color:T.inkFaint }}>GBP{(r.v/1000).toFixed(1)}k</div>
                        <div style={{ width:'100%', background:r.v > 0 ? T.forest : T.border, borderRadius:'4px 4px 0 0', height:Math.round((r.v / maxR) * 90) + 'px', minHeight:4 }}/>
                        <div style={{ fontSize:9, color:T.inkSoft }}>{r.label}</div>
                      </div>
                    )
                  })}
                </div>
                {bookings.length === 0 && <div style={{ textAlign:'center', fontSize:12, color:T.inkFaint, marginTop:8 }}>Revenue will appear here once bookings are completed</div>}
              </div>
            </div>
          )}

          {/*  BOOKINGS  */}
          {tab === 'bookings' && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>Bookings</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {['all','confirmed','pending','completed','cancelled','no_show'].map(function(s) {
                    return (
                      <button key={s} onClick={function() { setFilterStatus(s) }} style={{ padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', border:'1.5px solid ' + (filterStatus === s ? T.forest : T.border), background:filterStatus === s ? T.mint : T.white, color:filterStatus === s ? T.forest : T.inkSoft, textTransform:'capitalize' }}>
                        {s.replace('_',' ')}
                      </button>
                    )
                  })}
                </div>
              </div>

              {feeCount > 0 && (
                <div style={{ background:'#fff0f0', borderRadius:10, padding:'12px 16px', marginBottom:16, border:'1px solid #f0c0c0' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.error, marginBottom:2 }}>{feeCount} late cancellation{feeCount > 1 ? 's' : ''} requiring fee decision</div>
                  <div style={{ fontSize:12, color:T.inkSoft }}>Review each booking below and decide whether to apply or waive the cancellation fee.</div>
                </div>
              )}

              <div style={{ background:T.white, borderRadius:12, border:'1px solid ' + T.border, overflow:'hidden' }}>
                {filteredBookings.length === 0 ? (
                  <div style={{ padding:48, textAlign:'center', color:T.inkSoft }}>
                    <IconCalendar size={32} color={T.border}/>
                    <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginTop:12, marginBottom:6 }}>No bookings yet</div>
                    <div style={{ fontSize:13 }}>Bookings will appear here when customers book through Eden</div>
                  </div>
                ) : (
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
                        var hasFee = b.cancellation_reason && b.fee_status === 'pending'
                        return (
                          <tr key={b.id} style={{ borderBottom:'1px solid ' + T.border, background:hasFee ? '#fff8f8' : (i % 2 === 0 ? T.white : T.offwhite) }}>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{b.customer_name}</div>
                              <div style={{ fontSize:11, color:T.inkSoft }}>{b.customer_email}</div>
                            </td>
                            <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{b.service_name}</td>
                            <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{b.booking_date}</td>
                            <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{b.booking_time}</td>
                            <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{fmtDur(b.duration)}</td>
                            <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:T.forest }}>GBP {b.amount}</td>
                            <td style={{ padding:'12px 14px' }}>
                              <StatusBadge status={b.status}/>
                              {hasFee && <div style={{ fontSize:9, color:T.error, fontWeight:700, marginTop:3 }}>FEE PENDING</div>}
                            </td>
                            <td style={{ padding:'12px 14px' }}>
                              <button onClick={function() { setManagingBooking(b) }} style={{ padding:'5px 12px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:6, color:T.inkMid, fontSize:11, fontWeight:600, cursor:'pointer' }}>Manage</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/*  SERVICES  */}
          {tab === 'services' && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:4 }}>Services and Treatments</div>
                  <div style={{ fontSize:13, color:T.inkSoft }}>Manage your treatments, prices and estimated durations</div>
                </div>
                <Button variant="primary" onClick={function() { setEditingService({}) }}>+ Add Treatment</Button>
              </div>

              <div style={{ background:'#f0f8f0', borderRadius:8, padding:'10px 16px', marginBottom:16, border:'1px solid ' + T.sagePale, fontSize:12, color:T.sage }}>
                The duration you set is shown to customers when they book. You can adjust duration of individual appointments from the Bookings tab.
              </div>

              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                {['all','active','paused'].map(function(f) {
                  var count = f === 'all' ? services.length : f === 'active' ? services.filter(function(s) { return s.active }).length : services.filter(function(s) { return !s.active }).length
                  return (
                    <button key={f} onClick={function() { setSvcFilter(f) }} style={{ padding:'5px 16px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', border:'1.5px solid ' + (svcFilter === f ? T.forest : T.border), background:svcFilter === f ? T.mint : T.white, color:svcFilter === f ? T.forest : T.inkSoft, textTransform:'capitalize' }}>
                      {f} ({count})
                    </button>
                  )
                })}
              </div>

              {filteredServices.length === 0 ? (
                <div style={{ background:T.white, borderRadius:12, padding:48, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:8 }}>No treatments added yet</div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginBottom:20 }}>Add your services so customers can see what you offer and book online</div>
                  <Button variant="primary" onClick={function() { setEditingService({}) }}>Add Your First Treatment</Button>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {filteredServices.map(function(s) {
                    return (
                      <div key={s.id} style={{ background:T.white, borderRadius:10, padding:'16px 20px', border:'1px solid ' + T.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            <span style={{ fontFamily:F.display, fontSize:16, color:T.forest }}>{s.name}</span>
                            {s.popular && <span style={{ fontSize:9, background:T.goldPale, color:T.gold, padding:'2px 8px', borderRadius:10, fontWeight:700, letterSpacing:0.5 }}>POPULAR</span>}
                            {!s.active && <span style={{ fontSize:9, background:T.offwhite, color:T.inkFaint, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>PAUSED</span>}
                          </div>
                          <div style={{ fontSize:12, color:T.inkSoft }}>{fmtDur(s.duration)}</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                          <span style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>GBP {s.price}</span>
                          <button onClick={function() { setEditingService(s) }} style={{ padding:'6px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:6, color:T.inkMid, fontSize:11, fontWeight:600, cursor:'pointer' }}>Edit</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/*  CALENDAR  */}
          {tab === 'calendar' && canAccess('calendar') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:20 }}>Calendar</div>
              <div style={{ background:T.white, borderRadius:12, border:'1px solid ' + T.border, overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', borderBottom:'1px solid ' + T.border }}>
                  <div style={{ background:T.offwhite, padding:10 }}/>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(d) {
                    return <div key={d} style={{ padding:'10px 8px', textAlign:'center', fontSize:12, fontWeight:700, color:T.inkMid, background:T.offwhite, borderLeft:'1px solid ' + T.border }}>{d}</div>
                  })}
                </div>
                {['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(function(h) {
                  return (
                    <div key={h} style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', borderBottom:'1px solid ' + T.border, minHeight:52 }}>
                      <div style={{ padding:'6px 8px 0', fontSize:10, color:T.inkFaint, textAlign:'right', paddingRight:10, background:T.offwhite, borderRight:'1px solid ' + T.border }}>{h}</div>
                      {[0,1,2,3,4,5,6].map(function(di) {
                        var match = bookings.find(function(b) { return b.booking_time && b.booking_time.startsWith(h.replace(':00','').padStart(2,'0')) })
                        return (
                          <div key={di} style={{ borderLeft:'1px solid ' + T.border, padding:4 }}>
                            {di === 0 && match && (
                              <div style={{ background:T.mint, border:'1px solid ' + T.sagePale, borderRadius:5, padding:'3px 6px', fontSize:9, color:T.moss, cursor:'pointer' }} onClick={function() { setManagingBooking(match) }}>
                                <div style={{ fontWeight:700 }}>{(match.customer_name || '').split(' ')[0]}</div>
                                <div style={{ opacity:0.8 }}>{(match.service_name || '').split(' ').slice(0,2).join(' ')}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/*  CLIENTS  */}
          {tab === 'clients' && canAccess('clients') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:20 }}>Client Profiles</div>
              {bookings.length === 0 ? (
                <div style={{ background:T.white, borderRadius:12, padding:48, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <IconUser size={32} color={T.border}/>
                  <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginTop:12, marginBottom:6 }}>No clients yet</div>
                  <div style={{ fontSize:13, color:T.inkSoft }}>Client profiles will appear here once bookings come through</div>
                </div>
              ) : (
                <div style={{ background:T.white, borderRadius:12, border:'1px solid ' + T.border, overflow:'hidden' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom:'1px solid ' + T.border, background:T.offwhite }}>
                        {['Client','Email','Phone','Bookings','Total Spent','Last Visit'].map(function(h) {
                          return <th key={h} style={{ textAlign:'left', padding:'10px 14px', fontSize:10, color:T.inkSoft, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{h}</th>
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(bookings.reduce(function(acc, b) {
                        var key = b.customer_email || b.customer_name
                        if (!acc[key]) acc[key] = { name:b.customer_name, email:b.customer_email, phone:b.customer_phone, count:0, spent:0, last:b.booking_date }
                        acc[key].count++
                        acc[key].spent += (b.amount || 0)
                        if (b.booking_date > acc[key].last) acc[key].last = b.booking_date
                        return acc
                      }, {})).map(function(c, i) {
                        return (
                          <tr key={i} style={{ borderBottom:'1px solid ' + T.border, background:i % 2 === 0 ? T.white : T.offwhite }}>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:32, height:32, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontSize:14, color:T.forest }}>
                                  {(c.name || '?')[0].toUpperCase()}
                                </div>
                                <span style={{ fontSize:13, fontWeight:600, color:T.ink }}>{c.name}</span>
                              </div>
                            </td>
                            <td style={{ padding:'12px 14px', fontSize:12, color:T.inkSoft }}>{c.email}</td>
                            <td style={{ padding:'12px 14px', fontSize:12, color:T.inkSoft }}>{c.phone || '-'}</td>
                            <td style={{ padding:'12px 14px', fontSize:13, color:T.inkMid }}>{c.count}</td>
                            <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:T.forest }}>GBP {c.spent}</td>
                            <td style={{ padding:'12px 14px', fontSize:12, color:T.inkSoft }}>{c.last}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/*  OFFERS  */}
          {tab === 'offers' && canAccess('offers') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>Promotional Offers</div>
                <Button variant="primary" onClick={function() { setEditingOffer({}) }}>+ Create Offer</Button>
              </div>
              {offers.length === 0 ? (
                <div style={{ background:T.white, borderRadius:12, padding:48, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:8 }}>No offers created yet</div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginBottom:20 }}>Create discount codes to attract new clients and reward loyal customers</div>
                  <Button variant="primary" onClick={function() { setEditingOffer({}) }}>Create Your First Offer</Button>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {offers.map(function(o) {
                    return (
                      <div key={o.id} style={{ background:T.white, borderRadius:10, padding:'16px 20px', border:'1px solid ' + T.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                        <div>
                          <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:4 }}>{o.title}</div>
                          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                            <span style={{ fontFamily:'monospace', fontSize:13, background:T.mint, color:T.forest, padding:'2px 10px', borderRadius:6, fontWeight:700 }}>{o.code}</span>
                            <span style={{ fontSize:12, color:T.inkSoft }}>{o.discount_percent}% off</span>
                            {o.expires_at && <span style={{ fontSize:12, color:T.inkSoft }}>Expires: {o.expires_at}</span>}
                            <span style={{ fontSize:12, color:T.inkSoft }}>Used: {o.usage_count || 0} times</span>
                          </div>
                        </div>
                        <button onClick={function() { setEditingOffer(o) }} style={{ padding:'6px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:6, color:T.inkMid, fontSize:11, fontWeight:600, cursor:'pointer' }}>Edit</button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/*  GALLERY  */}
          {tab === 'gallery' && canAccess('gallery') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:20 }}>Photo Gallery</div>
              <div style={{ background:T.white, borderRadius:12, padding:40, border:'2px dashed ' + T.border, textAlign:'center', cursor:'pointer', marginBottom:20 }}>
                <IconPhoto size={36} color={T.border}/>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginTop:12, marginBottom:6 }}>Upload Photos</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16 }}>Show off your best work. Drag and drop or click to upload.</div>
                <Button variant="primary">Choose Photos</Button>
              </div>
              <div style={{ fontSize:12, color:T.inkSoft, textAlign:'center' }}>Supported: JPG, PNG, WebP up to 10MB each. Upload up to 30 photos.</div>
            </div>
          )}

          {/*  REVIEWS  */}
          {tab === 'reviews' && canAccess('reviews') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:4 }}>Reviews</div>
                  <div style={{ fontSize:13, color:T.inkSoft }}>{reviews.length} reviews - {avgRating} average rating</div>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {[1,2,3,4,5].map(function(n) {
                    return <IconStar key={n} size={20} color={T.gold} filled={n <= Math.round(avgRating)}/>
                  })}
                </div>
              </div>

              {reviews.length === 0 ? (
                <div style={{ background:T.white, borderRadius:12, padding:48, border:'1px solid ' + T.border, textAlign:'center' }}>
                  <IconReview size={32} color={T.border}/>
                  <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginTop:12, marginBottom:6 }}>No reviews yet</div>
                  <div style={{ fontSize:13, color:T.inkSoft }}>Reviews from your clients will appear here</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {reviews.map(function(r) {
                    return (
                      <ReviewCard key={r.id} review={r} onReply={replyToReview}/>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/*  ANALYTICS  */}
          {tab === 'analytics' && canAccess('analytics') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:20 }}>Analytics</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
                {[
                  { label:'Total Revenue',    value:'GBP ' + totalRevenue.toLocaleString() },
                  { label:'Completed Bookings', value:bookings.filter(function(b) { return b.status === 'completed' }).length },
                  { label:'Cancellation Rate',  value:bookings.length > 0 ? Math.round((bookings.filter(function(b) { return b.status === 'cancelled' }).length / bookings.length) * 100) + '%' : '0%' },
                  { label:'Avg Booking Value',  value:bookings.length > 0 ? 'GBP ' + Math.round(bookings.reduce(function(a,b) { return a + (b.amount||0) }, 0) / bookings.length) : 'GBP 0' },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background:T.white, borderRadius:12, padding:'20px', border:'1px solid ' + T.border }}>
                      <div style={{ fontFamily:F.display, fontSize:28, color:T.forest, lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:12, color:T.inkSoft, marginTop:6 }}>{s.label}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:16 }}>Top Services by Revenue</div>
                {services.length === 0 ? (
                  <div style={{ fontSize:13, color:T.inkSoft, textAlign:'center', padding:20 }}>Add services to see analytics</div>
                ) : (
                  services.slice(0,5).map(function(s, i) {
                    var svcRevenue = bookings.filter(function(b) { return b.service_name === s.name && b.status === 'completed' }).reduce(function(a,b) { return a + (b.amount||0) }, 0)
                    return (
                      <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid ' + T.border }}>
                        <span style={{ fontSize:13, color:T.ink }}>{s.name}</span>
                        <span style={{ fontFamily:F.display, fontSize:16, color:T.forest }}>GBP {svcRevenue}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/*  NOTIFICATIONS  */}
          {tab === 'notifications' && canAccess('notifications') && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:6 }}>Notifications</div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>Choose when you and your clients receive notifications</div>
              <div style={{ background:T.white, borderRadius:12, padding:20, border:'1px solid ' + T.border, marginBottom:16 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.forest, marginBottom:14 }}>Email Notifications</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <Toggle value={notifs.email_booking}  onChange={function(v) { setNotifs(function(n) { return {...n, email_booking:v} }) }}  label="New booking confirmation"  sub="Send to both you and the client when a booking is made"/>
                  <Toggle value={notifs.email_reminder} onChange={function(v) { setNotifs(function(n) { return {...n, email_reminder:v} }) }} label="Appointment reminder"       sub="Sent 24 hours before the appointment"/>
                  <Toggle value={notifs.email_cancel}   onChange={function(v) { setNotifs(function(n) { return {...n, email_cancel:v} }) }}   label="Cancellation notification" sub="Sent when a booking is cancelled"/>
                </div>
              </div>
              <div style={{ background:T.white, borderRadius:12, padding:20, border:'1px solid ' + T.border }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.forest, marginBottom:6 }}>SMS Notifications</div>
                <div style={{ fontSize:12, color:T.inkSoft, marginBottom:14 }}>SMS notifications require Twilio to be connected. Available on Premium plan.</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10, opacity:plan === 'premium' ? 1 : 0.5 }}>
                  <Toggle value={notifs.sms_booking}  onChange={function(v) { if (plan === 'premium') setNotifs(function(n) { return {...n, sms_booking:v} }) }}  label="SMS booking confirmation" sub="Text message when a booking is made"/>
                  <Toggle value={notifs.sms_reminder} onChange={function(v) { if (plan === 'premium') setNotifs(function(n) { return {...n, sms_reminder:v} }) }} label="SMS appointment reminder"  sub="Text message 2 hours before the appointment"/>
                </div>
              </div>
            </div>
          )}

          {/*  PAYMENTS  */}
          {tab === 'payments' && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:6 }}>Payments</div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>Manage your plan and payment settings</div>

              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border, marginBottom:16 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:14 }}>Current Plan</div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <PlanBadge plan={plan}/>
                  <span style={{ fontSize:14, color:T.inkSoft }}>{plan === 'free' ? 'Free forever' : plan === 'standard' ? 'GBP 59 per month' : 'GBP 119 per month'}</span>
                </div>
                {plan === 'free' && (
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    <Button variant="primary" onClick={function() { alert('Stripe checkout coming soon') }}>Upgrade to Growth - GBP 59/mo</Button>
                    <Button variant="secondary" onClick={function() { alert('Stripe checkout coming soon') }}>Upgrade to Premium - GBP 119/mo</Button>
                  </div>
                )}
              </div>

              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border, marginBottom:16 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:6 }}>Stripe Connect</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16 }}>Connect your Stripe account to receive booking payments directly to your bank. Eden takes 10% commission per booking and pays out weekly every Monday.</div>
                <Button variant="primary" onClick={function() { window.open('https://stripe.com/connect', '_blank') }}>Connect with Stripe</Button>
              </div>

              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:14 }}>Eden Cancellation Policy</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { label:'Free cancellation window', value:'24 hours before appointment' },
                    { label:'Late cancellation fee',    value:'Up to 50% at your discretion' },
                    { label:'Payout schedule',          value:'Every Monday via Stripe'      },
                    { label:'Minimum payout',           value:'GBP 25'                       },
                    { label:'Platform commission',      value:'10% per booking'              },
                  ].map(function(r, i) {
                    return (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid ' + T.border, fontSize:13 }}>
                        <span style={{ color:T.inkSoft }}>{r.label}</span>
                        <span style={{ fontWeight:600, color:T.ink }}>{r.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/*  SETTINGS  */}
          {tab === 'settings' && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:20 }}>Settings</div>
              <div style={{ background:T.white, borderRadius:12, padding:24, border:'1px solid ' + T.border, marginBottom:16 }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:14 }}>Business Details</div>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {[
                    { label:'Business Name', value:salon ? salon.name          : 'Not set' },
                    { label:'Category',      value:salon ? salon.category      : 'Not set' },
                    { label:'Email',         value:salon ? salon.email         : user.email },
                    { label:'Phone',         value:salon ? salon.phone         : 'Not set' },
                    { label:'Address',       value:salon ? salon.address_line1 : 'Not set' },
                    { label:'City',          value:salon ? salon.city          : 'Not set' },
                    { label:'Postcode',      value:salon ? salon.postcode      : 'Not set' },
                  ].map(function(s, i) {
                    return (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid ' + T.border }}>
                        <span style={{ fontSize:13, color:T.inkSoft }}>{s.label}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:T.ink }}>{s.value}</span>
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop:16 }}>
                  <Button variant="primary" onClick={function() { navigate('/list-business') }}>Update Business Details</Button>
                </div>
              </div>

              <div style={{ background:'#fff8f8', borderRadius:12, padding:20, border:'1px solid #f0d0d0' }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.error, marginBottom:10 }}>Danger Zone</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:12 }}>Permanently remove your listing from Eden. This cannot be undone.</div>
                <button style={{ padding:'8px 18px', background:'none', border:'1px solid ' + T.error, borderRadius:8, color:T.error, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Remove Listing
                </button>
              </div>
            </div>
          )}

          {/*  LOCKED TABS  */}
          {TABS.filter(function(t) {
            return ['calendar','clients','offers','gallery','reviews','analytics','notifications'].indexOf(t) > -1 && tab === t && !canAccess(t)
          }).map(function(t) {
            return (
              <div key={t} style={{ background:T.white, borderRadius:12, padding:48, border:'1px solid ' + T.border, textAlign:'center', animation:'fadeUp 0.3s ease' }}>
                <IconLock size={36} color={T.border}/>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginTop:14, marginBottom:8, textTransform:'capitalize' }}>{t}</div>
                <div style={{ fontSize:14, color:T.inkSoft, marginBottom:20, maxWidth:360, margin:'0 auto 20px' }}>
                  This feature is available on the {t === 'offers' ? 'Premium' : 'Growth'} plan and above.
                </div>
                <Button variant="primary" onClick={function() { setTab('payments') }}>Upgrade Plan</Button>
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
            updateBooking({ ...cancelFeeBooking, fee_status:d === 'charge' ? 'charged' : 'waived' })
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

      {editingOffer !== null && (
        <OfferModal
          offer={editingOffer && editingOffer.id ? editingOffer : null}
          onClose={function() { setEditingOffer(null) }}
          onSave={function(o) { saveOffer(o); setEditingOffer(null) }}
        />
      )}

    </div>
  )
}

//  REVIEW CARD (inline to avoid extra component file) 
function ReviewCard({ review, onReply }) {
  var [replying, setReplying] = useState(false)
  var [reply,    setReply]    = useState(review.reply || '')
  var [saving,   setSaving]   = useState(false)

  var save = function() {
    setSaving(true)
    setTimeout(function() {
      onReply(review.id, reply)
      setSaving(false)
      setReplying(false)
    }, 600)
  }

  return (
    <div style={{ background:T.white, borderRadius:12, padding:20, border:'1px solid ' + T.border }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{review.customer_name || 'Anonymous'}</div>
          <div style={{ fontSize:11, color:T.inkSoft }}>{review.created_at ? review.created_at.slice(0,10) : ''}</div>
        </div>
        <div style={{ display:'flex', gap:2 }}>
          {[1,2,3,4,5].map(function(n) { return <IconStar key={n} size={14} color={T.gold} filled={n <= (review.rating || 5)}/> })}
        </div>
      </div>
      {review.comment && <div style={{ fontSize:13, color:T.inkMid, lineHeight:1.7, marginBottom:10 }}>{review.comment}</div>}
      {review.reply ? (
        <div style={{ background:T.mint, borderRadius:8, padding:'10px 14px', border:'1px solid ' + T.sagePale }}>
          <div style={{ fontSize:10, color:T.moss, fontWeight:700, marginBottom:4 }}>YOUR REPLY</div>
          <div style={{ fontSize:13, color:T.forest }}>{review.reply}</div>
          <button onClick={function() { setReplying(true) }} style={{ fontSize:11, color:T.sage, background:'none', border:'none', cursor:'pointer', padding:0, marginTop:4 }}>Edit reply</button>
        </div>
      ) : (
        !replying && <button onClick={function() { setReplying(true) }} style={{ fontSize:12, color:T.sage, background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:600 }}>Reply to this review</button>
      )}
      {replying && (
        <div style={{ marginTop:10 }}>
          <textarea value={reply} onChange={function(e) { setReply(e.target.value) }} placeholder="Write a professional reply..." style={{ width:'100%', height:70, padding:'10px 14px', background:T.offwhite, border:'1px solid ' + T.border, borderRadius:8, fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' }}/>
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button onClick={function() { setReplying(false) }} style={{ padding:'6px 14px', background:'none', border:'1px solid ' + T.border, borderRadius:6, fontSize:12, cursor:'pointer', color:T.inkSoft }}>Cancel</button>
            <button onClick={save} disabled={saving || !reply} style={{ padding:'6px 14px', background:T.forest, border:'none', borderRadius:6, fontSize:12, fontWeight:700, color:T.white, cursor:'pointer' }}>
              {saving ? 'Saving...' : 'Post Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
