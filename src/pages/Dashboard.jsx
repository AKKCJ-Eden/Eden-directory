import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Badge, Button, Spinner, Input, Modal } from '../lib/design'

// ─── CONSTANTS ────────────────────────────────────

const PLANS = [
  { id:'free',     name:'Starter', price:0,   features:['Basic listing','Search visibility','Customer enquiries'] },
  { id:'standard', name:'Growth',  price:59,  features:['Priority placement','Booking calendar','Analytics','Email confirmations'] },
  { id:'premium',  name:'Premium', price:119, features:['Featured placement','AI spotlight','Unlimited gallery','SMS notifications','Account manager'] },
]

const INITIAL_SERVICES = [
  { id:1, name:"Women's Cut & Blowdry", category:'Cuts',      price:75,  duration:60,  popular:false, active:true  },
  { id:2, name:'Full Balayage',          category:'Colour',    price:165, duration:180, popular:true,  active:true  },
  { id:3, name:'Full Highlights',        category:'Colour',    price:135, duration:150, popular:false, active:true  },
  { id:4, name:'Colour Correction',      category:'Colour',    price:200, duration:240, popular:false, active:true  },
  { id:5, name:'Keratin Treatment',      category:'Treatments',price:210, duration:180, popular:false, active:true  },
  { id:6, name:"Men's Cut",             category:'Cuts',      price:45,  duration:45,  popular:false, active:true  },
  { id:7, name:'Olaplex Treatment',      category:'Treatments',price:55,  duration:45,  popular:true,  active:true  },
  { id:8, name:'Bridal Hair',           category:'Occasions', price:280, duration:180, popular:false, active:false },
]

const INITIAL_BOOKINGS = [
  { id:1, client:'Emma Johnson',   email:'emma@email.com',   phone:'+44 7700 111 111', service:'Full Balayage',     date:'2026-06-07', time:'14:00', duration:180, status:'confirmed',  amount:165, notes:'',                                    cancelReason:'', cancelFeeApplied:false },
  { id:2, client:'Sarah Williams', email:'sarah@email.com',  phone:'+44 7700 222 222', service:'Cut & Blowdry',     date:'2026-06-07', time:'16:30', duration:60,  status:'confirmed',  amount:75,  notes:'',                                    cancelReason:'', cancelFeeApplied:false },
  { id:3, client:'Lucy Brown',     email:'lucy@email.com',   phone:'+44 7700 333 333', service:'Colour Correction', date:'2026-06-08', time:'10:00', duration:240, status:'pending',    amount:200, notes:'First time client',                   cancelReason:'', cancelFeeApplied:false },
  { id:4, client:'Jade Clarke',    email:'jade@email.com',   phone:'+44 7700 444 444', service:'Full Highlights',   date:'2026-06-12', time:'13:00', duration:150, status:'cancelled',  amount:135, notes:'',                                    cancelReason:'Feeling unwell — gave 3 hours notice', cancelFeeApplied:false },
  { id:5, client:'Mia Roberts',    email:'mia@email.com',    phone:'+44 7700 555 555', service:'Keratin Treatment', date:'2026-06-13', time:'11:00', duration:180, status:'confirmed',  amount:210, notes:'Allergic to strong fragrances',        cancelReason:'', cancelFeeApplied:false },
]

const REVENUE = [
  { m:'Jan', v:3840 }, { m:'Feb', v:4120 }, { m:'Mar', v:3780 },
  { m:'Apr', v:4540 }, { m:'May', v:5190 }, { m:'Jun', v:5820 },
]

const TIMES = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00']

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
  { val:210, label:'3h 30m' },
  { val:240, label:'4 hours' },
  { val:300, label:'5 hours' },
]

const STATUS_STYLES = {
  confirmed:  { bg:T.mint,    color:T.moss,     border:T.sagePale, label:'Confirmed'  },
  pending:    { bg:'#fff8e8', color:'#a06010',  border:'#f0d890',  label:'Pending'    },
  completed:  { bg:'#f0f4ff', color:'#3050a0',  border:'#c0d0f0',  label:'Completed'  },
  cancelled:  { bg:'#fff0f0', color:T.error,    border:'#f0c0c0',  label:'Cancelled'  },
  no_show:    { bg:'#f8f0ff', color:'#7030a0',  border:'#d0b0f0',  label:'No Show'    },
}

const fmtDuration = (d) => {
  if (d < 60) return `${d} min`
  const h = Math.floor(d/60), m = d%60
  return m > 0 ? `${h}h ${m}m` : `${h} hour${h>1?'s':''}`
}

// ─── CANCELLATION FEE MODAL ───────────────────────
function CancellationFeeModal({ booking, onClose, onDecision }) {
  const [decision,  setDecision]  = useState(null) // 'charge' | 'waive'
  const [saving,    setSaving]    = useState(false)
  const [done,      setDone]      = useState(false)
  const feeAmount = (booking.amount * 0.5).toFixed(2)

  const confirm = () => {
    setSaving(true)
    setTimeout(() => {
      onDecision(booking, decision)
      setSaving(false)
      setDone(true)
      setTimeout(() => { setDone(false); onClose() }, 2000)
    }, 1000)
  }

  return (
    <Modal open onClose={!done ? onClose : undefined} width={500}>
      <div style={{ padding:'32px 36px' }}>
        {done ? (
          <div style={{ textAlign:'center', padding:'20px 0', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:decision==='charge'?'#fff0f0':T.mint, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>
              {decision==='charge'?'💷':'🤝'}
            </div>
            <div style={{ fontFamily:F.display, fontSize:22, color:T.forest, marginBottom:8 }}>
              {decision==='charge' ? `Cancellation fee of £${feeAmount} applied` : 'Cancellation fee waived'}
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, lineHeight:1.8 }}>
              {booking.client} has been notified of your decision by email.
            </div>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:10, color:T.error, letterSpacing:2, fontWeight:700, marginBottom:4 }}>CANCELLATION REQUEST</div>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>{booking.client}</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>{booking.service} · {booking.date} at {booking.time}</div>
              </div>
              <button onClick={onClose} style={{ background:T.offwhite, border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:16, color:T.inkSoft }}>✕</button>
            </div>

            {/* Client's reason */}
            <div style={{ background:'#fff8f0', borderRadius:10, padding:'14px 16px', marginBottom:20, border:'1px solid #f0d8c0' }}>
              <div style={{ fontSize:11, color:'#a06010', fontWeight:700, letterSpacing:0.5, marginBottom:6, textTransform:'uppercase' }}>Client's Reason for Cancellation</div>
              <div style={{ fontSize:13, color:T.inkMid, lineHeight:1.7, fontStyle:'italic' }}>
                "{booking.cancelReason || 'No reason provided'}"
              </div>
            </div>

            {/* Fee info */}
            <div style={{ background:T.offwhite, borderRadius:10, padding:'14px 16px', marginBottom:20, border:`1px solid ${T.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, color:T.inkSoft }}>Original booking value</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>£{booking.amount}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, color:T.inkSoft }}>50% cancellation fee</span>
                <span style={{ fontSize:15, fontWeight:700, color:T.error }}>£{feeAmount}</span>
              </div>
            </div>

            {/* Eden policy note */}
            <div style={{ background:T.mint, borderRadius:8, padding:'12px 16px', marginBottom:20, border:`1px solid ${T.sagePale}`, fontSize:12, color:T.moss, lineHeight:1.7 }}>
              🌿 <strong>Eden Cancellation Policy:</strong> As the salon owner, you have full discretion on whether to apply the 50% cancellation fee. This decision is final. The client will be notified of your decision by email.
            </div>

            {/* Decision buttons */}
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:10, textTransform:'uppercase' }}>Your Decision</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              <button onClick={() => setDecision('charge')} style={{
                padding:'16px', borderRadius:10, cursor:'pointer', textAlign:'center',
                border:`2px solid ${decision==='charge'?T.error:'#f0c0c0'}`,
                background: decision==='charge'?'#fff0f0':'#fff',
                transition:'all 0.15s',
              }}>
                <div style={{ fontSize:24, marginBottom:6 }}>💷</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.error }}>Apply Fee</div>
                <div style={{ fontSize:11, color:'#c08080', marginTop:4 }}>Charge £{feeAmount}</div>
              </button>
              <button onClick={() => setDecision('waive')} style={{
                padding:'16px', borderRadius:10, cursor:'pointer', textAlign:'center',
                border:`2px solid ${decision==='waive'?T.sage:T.border}`,
                background: decision==='waive'?T.mint:'#fff',
                transition:'all 0.15s',
              }}>
                <div style={{ fontSize:24, marginBottom:6 }}>🤝</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.moss }}>Waive Fee</div>
                <div style={{ fontSize:11, color:T.inkSoft, marginTop:4 }}>No charge</div>
              </button>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={confirm} disabled={!decision || saving}>
                {saving ? <><Spinner size={14} color={T.white}/> Processing…</> : `Confirm Decision →`}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

// ─── MANAGE BOOKING MODAL ─────────────────────────
function ManageBookingModal({ booking, onClose, onSave, onCancelFee }) {
  const [date,     setDate]     = useState(booking.date)
  const [time,     setTime]     = useState(booking.time)
  const [duration, setDuration] = useState(booking.duration)
  const [notes,    setNotes]    = useState(booking.notes)
  const [status,   setStatus]   = useState(booking.status)
  const [reason,   setReason]   = useState(booking.cancelReason || '')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [notify,   setNotify]   = useState(true)

  const hasChanged = date!==booking.date || time!==booking.time || duration!==booking.duration || notes!==booking.notes || status!==booking.status || reason!==booking.cancelReason

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      onSave({ ...booking, date, time, duration, notes, status, cancelReason:reason })
      setSaving(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); onClose() }, 1800)
    }, 1000)
  }

  const statusOptions = [
    { value:'confirmed', label:'✓ Confirmed' },
    { value:'pending',   label:'⏳ Pending'   },
    { value:'completed', label:'✅ Completed' },
    { value:'cancelled', label:'✕ Cancelled' },
    { value:'no_show',   label:'👻 No Show'   },
  ]

  return (
    <Modal open onClose={!saved ? onClose : undefined} width={540}>
      <div style={{ padding:'32px 36px' }}>
        {saved ? (
          <div style={{ textAlign:'center', padding:'20px 0', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>✓</div>
            <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:8 }}>Booking Updated!</div>
            <div style={{ fontSize:13, color:T.inkSoft, lineHeight:1.8 }}>
              {notify && <span>A notification has been sent to <strong>{booking.client}</strong>.</span>}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>MANAGE BOOKING</div>
                <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>{booking.client}</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>{booking.service}</div>
              </div>
              <button onClick={onClose} style={{ background:T.offwhite, border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:16, color:T.inkSoft }}>✕</button>
            </div>

            {/* Client details */}
            <div style={{ background:T.offwhite, borderRadius:10, padding:'12px 16px', marginBottom:20, border:`1px solid ${T.border}`, display:'flex', gap:20, flexWrap:'wrap' }}>
              <div style={{ fontSize:12, color:T.inkSoft }}>📧 <a href={`mailto:${booking.email}`} style={{ color:T.sage }}>{booking.email}</a></div>
              <div style={{ fontSize:12, color:T.inkSoft }}>📱 <a href={`tel:${booking.phone}`} style={{ color:T.sage }}>{booking.phone}</a></div>
              <div style={{ fontSize:12, color:T.inkSoft }}>💷 <strong style={{ color:T.forest }}>£{booking.amount}</strong></div>
            </div>

            {/* Cancellation fee alert */}
            {booking.status === 'cancelled' && booking.cancelReason && !booking.cancelFeeApplied && (
              <div style={{ background:'#fff0f0', borderRadius:10, padding:'14px 16px', marginBottom:20, border:'1px solid #f0c0c0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.error, marginBottom:4 }}>⚠️ Cancellation fee pending your decision</div>
                  <div style={{ fontSize:11, color:'#c08080' }}>Client gave a reason — you can charge 50% (£{(booking.amount*0.5).toFixed(2)}) at your discretion</div>
                </div>
                <button onClick={() => { onClose(); onCancelFee(booking) }} style={{ padding:'7px 14px', background:T.error, border:'none', borderRadius:6, color:T.white, fontSize:11, fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:12 }}>
                  Review →
                </button>
              </div>
            )}

            {booking.cancelFeeApplied && (
              <div style={{ background:T.mint, borderRadius:10, padding:'12px 16px', marginBottom:20, border:`1px solid ${T.sagePale}`, fontSize:12, color:T.moss }}>
                ✓ Cancellation fee decision has been made for this booking
              </div>
            )}

            {/* Status */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Booking Status</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {statusOptions.map(s => (
                  <button key={s.value} onClick={() => setStatus(s.value)} style={{
                    padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer',
                    border:`1.5px solid ${status===s.value?T.forest:T.border}`,
                    background: status===s.value?T.forest:T.white,
                    color: status===s.value?T.white:T.inkMid,
                    transition:'all 0.15s',
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Cancellation reason */}
            {status === 'cancelled' && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:6, textTransform:'uppercase' }}>
                  Client's Reason for Cancellation
                  <span style={{ color:T.inkFaint, fontWeight:400, marginLeft:6, textTransform:'none', letterSpacing:0 }}>(used to decide cancellation fee)</span>
                </div>
                <textarea value={reason} onChange={e=>setReason(e.target.value)}
                  placeholder="Enter the reason the client gave for cancelling…"
                  style={{ width:'100%', height:70, padding:'10px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' }}/>
                {reason && status === 'cancelled' && (
                  <div style={{ marginTop:8, padding:'10px 14px', background:'#fff8f0', borderRadius:8, border:'1px solid #f0d8c0', fontSize:12, color:'#a06010', lineHeight:1.7 }}>
                    💡 Once saved, you can review this cancellation and decide whether to apply a 50% fee (£{(booking.amount*0.5).toFixed(2)}) from the bookings list.
                  </div>
                )}
              </div>
            )}

            {/* Reschedule */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Reschedule Appointment</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:11, color:T.inkFaint, marginBottom:4 }}>Date</div>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                    style={{ width:'100%', padding:'10px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:13, outline:'none' }}/>
                </div>
                <div>
                  <div style={{ fontSize:11, color:T.inkFaint, marginBottom:4 }}>Time</div>
                  <select value={time} onChange={e=>setTime(e.target.value)}
                    style={{ width:'100%', padding:'10px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:13, outline:'none' }}>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Adjust Duration for This Appointment</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {DURATIONS.map(d => (
                  <button key={d.val} onClick={() => setDuration(d.val)} style={{
                    padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer',
                    border:`1.5px solid ${duration===d.val?T.forest:T.border}`,
                    background: duration===d.val?T.forest:T.white,
                    color: duration===d.val?T.white:T.inkMid,
                    transition:'all 0.15s',
                  }}>{d.label}</button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Internal Notes (visible to your team only)</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                placeholder="Allergies, preferences, client history, special requirements…"
                style={{ width:'100%', height:80, padding:'10px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' }}/>
            </div>

            {/* Notify toggle */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:T.mint, borderRadius:8, padding:'12px 16px', marginBottom:20, border:`1px solid ${T.sagePale}` }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:T.forest }}>Notify client of changes</div>
                <div style={{ fontSize:11, color:T.inkSoft, marginTop:2 }}>Send email & SMS to {booking.client}</div>
              </div>
              <div onClick={() => setNotify(!notify)} style={{ width:44, height:24, borderRadius:12, background:notify?T.sage:T.border, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:3, left:notify?23:3, width:18, height:18, borderRadius:'50%', background:T.white, boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={save} disabled={!hasChanged || saving}>
                {saving ? <><Spinner size={14} color={T.white}/> Saving…</> : 'Save Changes →'}
              </Button>
            </div>
            {!hasChanged && <div style={{ textAlign:'center', marginTop:10, fontSize:11, color:T.inkFaint }}>Make a change above to save</div>}
          </>
        )}
      </div>
    </Modal>
  )
}

// ─── SERVICE EDIT MODAL ───────────────────────────
function ServiceModal({ service, onClose, onSave }) {
  const [name,     setName]     = useState(service?.name     || '')
  const [category, setCategory] = useState(service?.category || 'Cuts')
  const [price,    setPrice]    = useState(service?.price    || '')
  const [duration, setDuration] = useState(service?.duration || 60)
  const [popular,  setPopular]  = useState(service?.popular  || false)
  const [active,   setActive]   = useState(service?.active   !== false)
  const [saving,   setSaving]   = useState(false)

  const isNew = !service?.id
  const valid = name && price && duration

  const save = () => {
    if (!valid) return
    setSaving(true)
    setTimeout(() => {
      onSave({
        id: service?.id || Date.now(),
        name, category, price: parseFloat(price), duration, popular, active,
      })
      setSaving(false)
      onClose()
    }, 600)
  }

  const CATS = ['Cuts','Colour','Treatments','Styling','Occasions','Extras']

  return (
    <Modal open onClose={onClose} width={480}>
      <div style={{ padding:'32px 36px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:4 }}>{isNew?'ADD SERVICE':'EDIT SERVICE'}</div>
            <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>{isNew?'New Treatment':'Edit Treatment'}</div>
          </div>
          <button onClick={onClose} style={{ background:T.offwhite, border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:16, color:T.inkSoft }}>✕</button>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Treatment Name *</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Full Balayage"
            style={{ width:'100%', padding:'11px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Category</div>
            <select value={category} onChange={e=>setCategory(e.target.value)}
              style={{ width:'100%', padding:'11px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:14, outline:'none' }}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Price (£) *</div>
            <input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0.00"
              style={{ width:'100%', padding:'11px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>
            Estimated Duration *
            <span style={{ color:T.inkFaint, fontWeight:400, marginLeft:6, textTransform:'none', letterSpacing:0, fontSize:10 }}>— shown to customers when booking</span>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {DURATIONS.map(d => (
              <button key={d.val} onClick={() => setDuration(d.val)} style={{
                padding:'7px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer',
                border:`1.5px solid ${duration===d.val?T.forest:T.border}`,
                background: duration===d.val?T.forest:T.white,
                color: duration===d.val?T.white:T.inkMid,
                transition:'all 0.15s',
              }}>{d.label}</button>
            ))}
          </div>
          {duration && (
            <div style={{ marginTop:10, fontSize:12, color:T.sage, fontWeight:600 }}>
              ✓ Selected: {fmtDuration(duration)} — customers will see this when booking
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:24 }}>
          <div onClick={() => setPopular(!popular)} style={{
            flex:1, padding:'12px 16px', borderRadius:10, cursor:'pointer',
            border:`1.5px solid ${popular?T.gold:T.border}`,
            background: popular?T.goldPale:T.white,
            display:'flex', alignItems:'center', gap:10, transition:'all 0.15s',
          }}>
            <span style={{ fontSize:20 }}>⭐</span>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:popular?T.gold:T.inkMid }}>Mark as Popular</div>
              <div style={{ fontSize:10, color:T.inkFaint }}>Shows a "Popular" badge on your listing</div>
            </div>
            <div style={{ marginLeft:'auto', width:18, height:18, borderRadius:'50%', border:`2px solid ${popular?T.gold:T.border}`, background:popular?T.gold:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {popular && <span style={{ color:T.white, fontSize:10 }}>✓</span>}
            </div>
          </div>
          <div onClick={() => setActive(!active)} style={{
            flex:1, padding:'12px 16px', borderRadius:10, cursor:'pointer',
            border:`1.5px solid ${active?T.sage:T.border}`,
            background: active?T.mint:T.white,
            display:'flex', alignItems:'center', gap:10, transition:'all 0.15s',
          }}>
            <span style={{ fontSize:20 }}>{active?'✅':'⏸'}</span>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:active?T.moss:T.inkMid }}>{active?'Active':'Paused'}</div>
              <div style={{ fontSize:10, color:T.inkFaint }}>{active?'Visible to customers':'Hidden from listing'}</div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={save} disabled={!valid || saving}>
            {saving ? <><Spinner size={14} color={T.white}/> Saving…</> : isNew?'Add Treatment →':'Save Changes →'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ─── CALENDAR VIEW ────────────────────────────────
function CalendarView({ bookings }) {
  const days = ['Mon 7','Tue 8','Wed 9','Thu 10','Fri 11','Sat 12']
  const hours = ['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
  return (
    <div style={{ background:T.white, borderRadius:12, border:`1px solid ${T.border}`, overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'60px repeat(6,1fr)', borderBottom:`1px solid ${T.border}` }}>
        <div style={{ background:T.offwhite }}/>
        {days.map(d => (
          <div key={d} style={{ padding:'10px 8px', textAlign:'center', fontSize:12, fontWeight:700, color:T.inkMid, background:T.offwhite, borderLeft:`1px solid ${T.border}` }}>{d}</div>
        ))}
      </div>
      {hours.map(h => (
        <div key={h} style={{ display:'grid', gridTemplateColumns:'60px repeat(6,1fr)', borderBottom:`1px solid ${T.border}`, minHeight:52 }}>
          <div style={{ padding:'6px 8px 0', fontSize:10, color:T.inkFaint, textAlign:'right', paddingRight:10, background:T.offwhite, borderRight:`1px solid ${T.border}` }}>{h}</div>
          {[0,1,2,3,4,5].map(di => {
            const bHour = h.split(':')[0]
            const booking = bookings.find((b,_) => {
              const bt = b.time.split(':')[0]
              return bt === bHour && di === bookings.indexOf(b) % 6
            })
            return (
              <div key={di} style={{ borderLeft:`1px solid ${T.border}`, padding:4 }}>
                {booking && (
                  <div style={{
                    background: STATUS_STYLES[booking.status]?.bg || T.mint,
                    border:`1px solid ${STATUS_STYLES[booking.status]?.border||T.sagePale}`,
                    borderRadius:5, padding:'3px 6px', fontSize:9,
                    color: STATUS_STYLES[booking.status]?.color || T.moss,
                  }}>
                    <div style={{ fontWeight:700 }}>{booking.client.split(' ')[0]}</div>
                    <div style={{ opacity:0.8 }}>{booking.service.split(' ').slice(0,2).join(' ')}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────
export default function Dashboard({ user }) {
  const [tab,             setTab]             = useState('overview')
  const [profile,         setProfile]         = useState(null)
  const [salon,           setSalon]           = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [bookings,        setBookings]        = useState(INITIAL_BOOKINGS)
  const [services,        setServices]        = useState(INITIAL_SERVICES)
  const [managingBooking, setManagingBooking] = useState(null)
  const [cancelFeeBooking,setCancelFeeBooking]= useState(null)
  const [editingService,  setEditingService]  = useState(null) // null=closed, {}=new, service=edit
  const [filterStatus,    setFilterStatus]    = useState('all')
  const [serviceFilter,   setServiceFilter]   = useState('all')
  const navigate = useNavigate()
  const maxR = Math.max(...REVENUE.map(r => r.v))

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof)
    const { data: sal } = await supabase.from('salons').select('*').eq('owner_id', user.id).single()
    setSalon(sal)
    setLoading(false)
  }

  const handleSignOut = async () => { await signOut(); navigate('/') }
  const updateBooking = (updated) => setBookings(prev => prev.map(b => b.id===updated.id?updated:b))
  const saveService   = (svc)     => setServices(prev => prev.find(s=>s.id===svc.id) ? prev.map(s=>s.id===svc.id?svc:s) : [...prev, svc])
  const deleteService = (id)      => setServices(prev => prev.filter(s => s.id !== id))
  const handleCancelFeeDecision = (booking, decision) => {
    updateBooking({ ...booking, cancelFeeApplied: true, cancelFeeCharged: decision === 'charge' })
  }

  const pendingCount   = bookings.filter(b=>b.status==='pending').length
  const cancelledWithReason = bookings.filter(b=>b.status==='cancelled'&&b.cancelReason&&!b.cancelFeeApplied).length

  const filteredBookings  = bookings.filter(b  => filterStatus==='all'     || b.status===filterStatus)
  const filteredServices  = services.filter(s  => serviceFilter==='all'    || (serviceFilter==='active'?s.active:!s.active))
  const serviceCats = ['all','active','paused']

  const TABS = ['overview','bookings','services','calendar','clients','offers','gallery','reviews','analytics','notifications','payments','settings']

  if (loading) return (
    <div style={{ minHeight:'100vh', background:T.cream, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{GLOBAL_CSS}</style>
      <Spinner size={32}/>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>

      <nav style={{ background:T.forest, padding:'0 24px', height:62, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🌿</div>
          <span style={{ fontFamily:F.display, fontSize:22, color:'#ffffff' }}>Eden</span>
          <span style={{ fontSize:10, color:'#a8c8ae', letterSpacing:2, textTransform:'uppercase', marginLeft:4 }}>Business</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:13, color:'#a8c8ae' }}>{profile?.full_name || user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut} style={{ color:'#ffffff', borderColor:'rgba(255,255,255,0.2)' }}>Sign Out</Button>
        </div>
      </nav>

      <div style={{ display:'flex', minHeight:'calc(100vh - 62px)' }}>

        {/* Sidebar */}
        <div style={{ width:230, background:T.white, borderRight:`1px solid ${T.border}`, padding:'24px 0', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              width:'100%', padding:'12px 24px',
              background:tab===t?T.mint:'none',
              border:'none', borderLeft:`3px solid ${tab===t?T.forest:'transparent'}`,
              color:tab===t?T.forest:T.inkSoft,
              fontSize:13, fontWeight:tab===t?600:400, cursor:'pointer',
              textAlign:'left', textTransform:'capitalize', transition:'all 0.15s',
              display:'flex', alignItems:'center', justifyContent:'space-between',
            }}>
              <span>{t}</span>
              {t==='bookings' && pendingCount>0 && <span style={{ background:T.gold, color:T.white, borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 7px' }}>{pendingCount}</span>}
              {t==='bookings' && cancelledWithReason>0 && <span style={{ background:T.error, color:T.white, borderRadius:10, fontSize:9, fontWeight:700, padding:'2px 7px' }}>Fee</span>}
            </button>
          ))}
          <div style={{ margin:'24px 16px 0', padding:'14px 16px', background:T.mint, borderRadius:10, border:`1px solid ${T.sagePale}` }}>
            <div style={{ fontSize:10, color:T.moss, fontWeight:700, letterSpacing:1, marginBottom:4 }}>YOUR PLAN</div>
            <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:4 }}>
              {salon?.plan==='premium'?'Premium':salon?.plan==='standard'?'Growth':'Starter'}
            </div>
            <button onClick={() => setTab('payments')} style={{ fontSize:10, color:T.sage, background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:600 }}>Manage plan →</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'32px' }}>

          {/* ── OVERVIEW ── */}
          {tab==='overview' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:28, color:T.forest, marginBottom:4 }}>
                Welcome back{profile?.full_name?`, ${profile.full_name.split(' ')[0]}`:''} 🌿
              </div>
              <div style={{ fontSize:14, color:T.inkSoft, marginBottom:20 }}>Here's how your business is performing on Eden.</div>

              {/* Alerts */}
              {pendingCount > 0 && (
                <div style={{ background:'#fff8e8', borderRadius:10, padding:'14px 18px', marginBottom:12, border:'1px solid #f0d890', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:13, color:'#a06010', fontWeight:600 }}>⏳ {pendingCount} booking{pendingCount>1?'s':''} awaiting your confirmation</div>
                  <button onClick={() => setTab('bookings')} style={{ fontSize:11, color:'#a06010', background:'#f0d890', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontWeight:700 }}>View →</button>
                </div>
              )}
              {cancelledWithReason > 0 && (
                <div style={{ background:'#fff0f0', borderRadius:10, padding:'14px 18px', marginBottom:12, border:'1px solid #f0c0c0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:13, color:T.error, fontWeight:600 }}>⚠️ {cancelledWithReason} cancellation{cancelledWithReason>1?'s':''} with fee decision pending</div>
                  <button onClick={() => setTab('bookings')} style={{ fontSize:11, color:T.error, background:'#f0c0c0', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontWeight:700 }}>Review →</button>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:28 }}>
                {[
                  { icon:'💷', label:'Revenue This Month',  val:'£5,820', chg:'↑ 12% vs last month'     },
                  { icon:'📅', label:'Active Bookings',     val:bookings.filter(b=>['confirmed','pending'].includes(b.status)).length.toString(), chg:'This month' },
                  { icon:'⭐', label:'Your Rating',          val:'4.9',    chg:'Top rated in your area'  },
                  { icon:'🛎', label:'Services Listed',     val:services.filter(s=>s.active).length.toString(), chg:`${services.filter(s=>!s.active).length} paused` },
                ].map(s => (
                  <div key={s.label} style={{ background:T.white, borderRadius:12, padding:'20px 18px', border:`1px solid ${T.border}`, boxShadow:`0 2px 8px ${T.shadow}` }}>
                    <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
                    <div style={{ fontFamily:F.display, fontSize:28, color:T.forest, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11, color:T.inkSoft, marginTop:4 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:T.success, marginTop:6, fontWeight:700 }}>{s.chg}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:T.white, borderRadius:14, padding:24, border:`1px solid ${T.border}`, marginBottom:20 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:20 }}>Revenue (6 months)</div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-end', height:140 }}>
                  {REVENUE.map(r => (
                    <div key={r.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                      <div style={{ fontSize:9, color:T.inkFaint }}>£{(r.v/1000).toFixed(1)}k</div>
                      <div style={{ width:'100%', background:`linear-gradient(to top,${T.forest},${T.sage})`, borderRadius:'4px 4px 0 0', height:`${(r.v/maxR)*100}px`, minHeight:4 }}/>
                      <div style={{ fontSize:11, color:T.inkMid, fontWeight:600 }}>{r.m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:T.mint, borderRadius:12, padding:20, border:`1px solid ${T.sagePale}` }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:12 }}>Quick Actions</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <Button variant="primary" size="sm" onClick={() => setTab('bookings')}>View Bookings</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('services')}>Manage Services</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('analytics')}>View Analytics</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('payments')}>Manage Plan</Button>
                </div>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab==='bookings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:12 }}>
                <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Appointments</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {['all','confirmed','pending','completed','cancelled','no_show'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} style={{
                      padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer',
                      border:`1px solid ${filterStatus===s?T.forest:T.border}`,
                      background: filterStatus===s?T.forest:T.white,
                      color: filterStatus===s?T.white:T.inkMid,
                    }}>{s==='all'?'All':s==='no_show'?'No Show':s.charAt(0).toUpperCase()+s.slice(1)}</button>
                  ))}
                </div>
              </div>

              {/* Cancellation fee alerts */}
              {bookings.filter(b=>b.status==='cancelled'&&b.cancelReason&&!b.cancelFeeApplied).map(b => (
                <div key={b.id} style={{ background:'#fff0f0', borderRadius:10, padding:'14px 18px', marginBottom:10, border:'1px solid #f0c0c0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, color:T.error, fontWeight:600 }}>⚠️ Cancellation fee decision needed — {b.client}</div>
                    <div style={{ fontSize:11, color:'#c08080', marginTop:2 }}>"{b.cancelReason}" · 50% fee = £{(b.amount*0.5).toFixed(2)}</div>
                  </div>
                  <button onClick={() => setCancelFeeBooking(b)} style={{ padding:'7px 16px', background:T.error, border:'none', borderRadius:6, color:T.white, fontSize:11, fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:12 }}>
                    Review Fee →
                  </button>
                </div>
              ))}

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {filteredBookings.length===0 ? (
                  <div style={{ textAlign:'center', padding:'40px', color:T.inkFaint, background:T.white, borderRadius:12, border:`1px solid ${T.border}` }}>
                    No {filterStatus==='all'?'':filterStatus} bookings
                  </div>
                ) : filteredBookings.map(b => {
                  const st = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed
                  return (
                    <div key={b.id} style={{ background:T.white, borderRadius:12, padding:'16px 20px', border:`1px solid ${b.status==='cancelled'&&b.cancelReason&&!b.cancelFeeApplied?'#f0c0c0':T.border}`, boxShadow:`0 1px 6px ${T.shadow}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                        <div style={{ width:44, height:44, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontSize:20, color:T.forest, flexShrink:0 }}>{b.client[0]}</div>
                        <div style={{ flex:1, minWidth:120 }}>
                          <div style={{ fontWeight:600, color:T.ink, fontSize:14 }}>{b.client}</div>
                          <div style={{ fontSize:12, color:T.inkSoft }}>{b.service} · {fmtDuration(b.duration)}</div>
                          <div style={{ fontSize:11, color:T.inkFaint, marginTop:2 }}>{b.date} at {b.time}</div>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, background:st.bg, color:st.color, border:`1px solid ${st.border}`, whiteSpace:'nowrap' }}>{st.label}</span>
                        <div style={{ fontWeight:700, color:T.forest, fontSize:15 }}>£{b.amount}</div>
                        <div style={{ display:'flex', gap:8 }}>
                          {b.status==='cancelled'&&b.cancelReason&&!b.cancelFeeApplied && (
                            <button onClick={() => setCancelFeeBooking(b)} style={{ padding:'7px 14px', background:'#fff0f0', border:'1px solid #f0c0c0', borderRadius:8, color:T.error, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                              Fee Decision
                            </button>
                          )}
                          <button onClick={() => setManagingBooking(b)} style={{ padding:'7px 18px', background:T.forest, border:'none', borderRadius:8, color:T.white, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                            Manage →
                          </button>
                        </div>
                      </div>
                      {b.notes && (
                        <div style={{ marginTop:10, padding:'8px 12px', background:T.offwhite, borderRadius:6, fontSize:11, color:T.inkMid, borderLeft:`3px solid ${T.sageLight}` }}>
                          📝 {b.notes}
                        </div>
                      )}
                      {b.cancelReason && (
                        <div style={{ marginTop:6, padding:'8px 12px', background:'#fff8f0', borderRadius:6, fontSize:11, color:'#a06010', borderLeft:'3px solid #f0d890' }}>
                          ❌ Cancellation reason: "{b.cancelReason}"
                          {b.cancelFeeApplied && <span style={{ marginLeft:8, color:b.cancelFeeCharged?T.error:T.moss, fontWeight:700 }}>{b.cancelFeeCharged?`· Fee of £${(b.amount*0.5).toFixed(2)} charged`:'· Fee waived'}</span>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── SERVICES MANAGER ── */}
          {tab==='services' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Services & Treatments</div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>Manage your treatments, prices and estimated durations</div>
                </div>
                <Button variant="primary" onClick={() => setEditingService({})}>+ Add Treatment</Button>
              </div>

              {/* Filter */}
              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                {serviceCats.map(s => (
                  <button key={s} onClick={() => setServiceFilter(s)} style={{
                    padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer',
                    border:`1px solid ${serviceFilter===s?T.forest:T.border}`,
                    background: serviceFilter===s?T.forest:T.white,
                    color: serviceFilter===s?T.white:T.inkMid,
                  }}>{s.charAt(0).toUpperCase()+s.slice(1)}{s==='active'?` (${services.filter(sv=>sv.active).length})`:s==='paused'?` (${services.filter(sv=>!sv.active).length})`:` (${services.length})`}</button>
                ))}
              </div>

              {/* Services grouped by category */}
              {['Cuts','Colour','Treatments','Styling','Occasions','Extras'].map(cat => {
                const catServices = filteredServices.filter(s => s.category===cat)
                if (catServices.length===0) return null
                return (
                  <div key={cat} style={{ marginBottom:24 }}>
                    <div style={{ fontSize:11, color:T.inkSoft, fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:10, paddingBottom:6, borderBottom:`1px solid ${T.border}` }}>{cat}</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {catServices.map(s => (
                        <div key={s.id} style={{ background:T.white, borderRadius:10, padding:'14px 18px', border:`1px solid ${s.active?T.border:'#e8e8e8'}`, display:'flex', alignItems:'center', gap:14, opacity:s.active?1:0.65 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                              <span style={{ fontSize:14, fontWeight:600, color:T.ink }}>{s.name}</span>
                              {s.popular && <Badge variant="gold" small>Popular</Badge>}
                              {!s.active && <Badge variant="grey" small>Paused</Badge>}
                            </div>
                            <div style={{ fontSize:12, color:T.inkSoft }}>
                              ⏱ {fmtDuration(s.duration)} estimated duration
                            </div>
                          </div>
                          <div style={{ textAlign:'right', flexShrink:0 }}>
                            <div style={{ fontSize:18, fontWeight:700, color:T.gold }}>£{s.price}</div>
                          </div>
                          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                            <button onClick={() => setEditingService(s)} style={{ padding:'6px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:6, color:T.inkMid, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                              Edit
                            </button>
                            <button onClick={() => saveService({...s, active:!s.active})} style={{ padding:'6px 14px', background:s.active?'#fff8e8':'#f0fff4', border:`1px solid ${s.active?'#f0d890':'#b0e0c0'}`, borderRadius:6, color:s.active?'#a06010':T.moss, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                              {s.active?'Pause':'Activate'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div style={{ marginTop:8, padding:'12px 16px', background:T.mint, borderRadius:8, fontSize:12, color:T.moss, border:`1px solid ${T.sagePale}` }}>
                💡 The duration you set here is shown to customers when they book — it helps them plan their day. You can always adjust the duration of individual appointments from the Bookings tab.
              </div>
            </div>
          )}

          {/* ── CALENDAR ── */}
          {tab==='calendar' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Weekly Calendar</div>
                <div style={{ fontSize:13, color:T.inkSoft }}>Week of 7 June 2026</div>
              </div>
              <CalendarView bookings={bookings}/>
              <div style={{ marginTop:12, display:'flex', gap:10, flexWrap:'wrap' }}>
                {Object.entries(STATUS_STYLES).map(([key, val]) => (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:T.inkSoft }}>
                    <div style={{ width:12, height:12, borderRadius:3, background:val.bg, border:`1px solid ${val.border}` }}/>
                    {val.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CLIENTS ── */}
          {tab==='clients' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Client Profiles</div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>Every customer who has booked with you through Eden</div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { name:'Emma Johnson',   email:'emma@email.com',   phone:'+44 7700 111 111', visits:4, lastVisit:'Today',      lastService:'Full Balayage',     totalSpent:620, avatar:'E' },
                  { name:'Sarah Williams', email:'sarah@email.com',  phone:'+44 7700 222 222', visits:7, lastVisit:'Today',      lastService:'Cut and Blowdry',   totalSpent:490, avatar:'S' },
                  { name:'Lucy Brown',     email:'lucy@email.com',   phone:'+44 7700 333 333', visits:2, lastVisit:'Last week',   lastService:'Colour Correction', totalSpent:400, avatar:'L' },
                  { name:'Jade Clarke',    email:'jade@email.com',   phone:'+44 7700 444 444', visits:5, lastVisit:'2 weeks ago', lastService:'Full Highlights',   totalSpent:650, avatar:'J' },
                  { name:'Mia Roberts',    email:'mia@email.com',    phone:'+44 7700 555 555', visits:3, lastVisit:'Last month',  lastService:'Keratin Treatment', totalSpent:580, avatar:'M' },
                  { name:'Zara Ahmed',     email:'zara@email.com',   phone:'+44 7700 666 666', visits:9, lastVisit:'3 days ago',  lastService:'Balayage',          totalSpent:1240, avatar:'Z' },
                ].map((c,i) => (
                  <div key={i} style={{ background:T.white, borderRadius:12, padding:'18px 20px', border:`1px solid ${T.border}`, boxShadow:`0 1px 6px ${T.shadow}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                      <div style={{ width:48, height:48, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontSize:22, color:T.forest, flexShrink:0 }}>{c.avatar}</div>
                      <div style={{ flex:1, minWidth:120 }}>
                        <div style={{ fontWeight:700, color:T.ink, fontSize:15 }}>{c.name}</div>
                        <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>
                          <a href={`mailto:${c.email}`} style={{ color:T.sage, textDecoration:'none' }}>{c.email}</a>
                          {' - '}
                          <a href={`tel:${c.phone}`} style={{ color:T.sage, textDecoration:'none' }}>{c.phone}</a>
                        </div>
                      </div>
                      <div style={{ textAlign:'center', minWidth:80 }}>
                        <div style={{ fontFamily:F.display, fontSize:22, color:T.forest }}>{c.visits}</div>
                        <div style={{ fontSize:10, color:T.inkSoft }}>visits</div>
                      </div>
                      <div style={{ textAlign:'center', minWidth:120 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{c.lastService}</div>
                        <div style={{ fontSize:11, color:T.inkSoft }}>{c.lastVisit}</div>
                      </div>
                      <div style={{ textAlign:'right', minWidth:80 }}>
                        <div style={{ fontFamily:F.display, fontSize:20, color:T.gold }}>£{c.totalSpent}</div>
                        <div style={{ fontSize:10, color:T.inkSoft }}>total spent</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:'12px 16px', background:T.mint, borderRadius:8, fontSize:12, color:T.moss, border:`1px solid ${T.sagePale}` }}>
                💡 Client profiles are built automatically from your Eden bookings. The more clients book through Eden, the richer your client history becomes.
              </div>
            </div>
          )}

          {/* ── OFFERS ── */}
          {tab==='offers' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Promotional Offers</div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>Create deals that appear on your Eden listing to attract new clients</div>
                </div>
                <Button variant="primary" onClick={() => {}}>+ Create Offer</Button>
              </div>

              {/* Active offers */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, color:T.inkSoft, fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>Active Offers</div>
                {[
                  { title:'20% off first visit', desc:'For new clients only — any treatment', code:'EDEN20', uses:14, expiry:'30 Jun 2026', color:T.sage },
                  { title:'Free Olaplex with any colour', desc:'Book a colour treatment and get a free Olaplex add-on', code:'COLOUR+', uses:8, expiry:'15 Jul 2026', color:T.gold },
                ].map((o,i) => (
                  <div key={i} style={{ background:T.white, borderRadius:12, padding:'18px 20px', border:`2px solid ${T.sagePale}`, marginBottom:10, display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
                    <div style={{ width:4, height:60, borderRadius:2, background:o.color, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:F.display, fontSize:17, color:T.forest, marginBottom:4 }}>{o.title}</div>
                      <div style={{ fontSize:12, color:T.inkSoft }}>{o.desc}</div>
                      <div style={{ fontSize:11, color:T.inkFaint, marginTop:4 }}>Code: <strong style={{ color:T.forest }}>{o.code}</strong> - Expires: {o.expiry}</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>{o.uses}</div>
                      <div style={{ fontSize:10, color:T.inkSoft }}>uses</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button style={{ padding:'6px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', color:T.inkMid }}>Edit</button>
                      <button style={{ padding:'6px 14px', background:'#fff0f0', border:'1px solid #f0c0c0', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', color:T.error }}>End</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create new offer */}
              <div style={{ background:T.offwhite, borderRadius:14, padding:24, border:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:20 }}>Create a New Offer</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Offer Title</div>
                    <input placeholder="e.g. 20% off first visit" style={{ width:'100%', padding:'11px 14px', background:T.white, border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Discount Code</div>
                    <input placeholder="e.g. WELCOME20" style={{ width:'100%', padding:'11px 14px', background:T.white, border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Description</div>
                    <input placeholder="Describe the offer for customers" style={{ width:'100%', padding:'11px 14px', background:T.white, border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Expiry Date</div>
                    <input type="date" style={{ width:'100%', padding:'11px 14px', background:T.white, border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
                  </div>
                </div>
                <Button variant="primary">Create Offer</Button>
              </div>
            </div>
          )}

          {/* ── GALLERY ── */}
          {tab==='gallery' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <div>
                  <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Photo Gallery</div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:4 }}>Upload and arrange photos that appear on your Eden listing</div>
                </div>
                <Button variant="primary">+ Upload Photos</Button>
              </div>

              {/* Upload area */}
              <div style={{ background:T.white, borderRadius:14, border:`2px dashed ${T.sageLight}`, padding:'40px 24px', textAlign:'center', marginBottom:24, cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = T.mint}
                onMouseLeave={e => e.currentTarget.style.background = T.white}>
                <div style={{ fontSize:40, marginBottom:12 }}>📸</div>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:8 }}>Drag photos here or click to upload</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16 }}>JPG, PNG or WEBP - up to 10MB each - up to 20 photos</div>
                <Button variant="secondary">Choose Photos</Button>
              </div>

              {/* Current gallery */}
              <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:14 }}>Current Gallery Photos</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:12 }}>
                {[
                  { url:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80', label:'Salon interior', main:true },
                  { url:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80', label:'Balayage result', main:false },
                  { url:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80', label:'Colour work', main:false },
                  { url:'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80', label:'Styling', main:false },
                ].map((p,i) => (
                  <div key={i} style={{ position:'relative', borderRadius:10, overflow:'hidden', border:`1px solid ${T.border}` }}>
                    <img src={p.url} alt={p.label} style={{ width:'100%', height:160, objectFit:'cover', display:'block' }}/>
                    {p.main && (
                      <div style={{ position:'absolute', top:8, left:8, background:T.forest, color:T.white, fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:10, letterSpacing:1 }}>MAIN</div>
                    )}
                    <div style={{ padding:'8px 10px', background:T.white }}>
                      <div style={{ fontSize:11, color:T.inkMid, marginBottom:6 }}>{p.label}</div>
                      <div style={{ display:'flex', gap:6 }}>
                        {!p.main && <button style={{ flex:1, padding:'4px', background:T.mint, border:`1px solid ${T.sagePale}`, borderRadius:4, fontSize:9, fontWeight:700, cursor:'pointer', color:T.moss }}>Set Main</button>}
                        <button style={{ flex:1, padding:'4px', background:'#fff0f0', border:'1px solid #f0c0c0', borderRadius:4, fontSize:9, fontWeight:700, cursor:'pointer', color:T.error }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, padding:'12px 16px', background:T.mint, borderRadius:8, fontSize:12, color:T.moss, border:`1px solid ${T.sagePale}` }}>
                💡 Your main photo appears at the top of your listing. High quality photos significantly increase booking rates.
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {tab==='reviews' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:6 }}>Review Management</div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>Read and respond to customer reviews on your Eden listing</div>

              {/* Rating summary */}
              <div style={{ display:'flex', gap:20, background:T.white, borderRadius:12, padding:20, marginBottom:24, border:`1px solid ${T.border}` }}>
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontFamily:F.display, fontSize:52, color:T.forest, lineHeight:1 }}>4.9</div>
                  <div style={{ color:T.gold, fontSize:16, letterSpacing:2 }}>★★★★★</div>
                  <div style={{ fontSize:11, color:T.inkFaint, marginTop:4 }}>487 reviews</div>
                </div>
                <div style={{ flex:1 }}>
                  {[5,4,3,2,1].map(n => (
                    <div key={n} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:11, color:T.inkSoft, width:8 }}>{n}</span>
                      <span style={{ color:T.gold, fontSize:11 }}>★</span>
                      <div style={{ flex:1, height:7, background:T.border, borderRadius:4, overflow:'hidden' }}>
                        <div style={{ width:`${n===5?68:n===4?22:n===3?7:n===2?2:1}%`, height:'100%', background:T.sage, borderRadius:4 }}/>
                      </div>
                      <span style={{ fontSize:10, color:T.inkFaint, width:28, textAlign:'right' }}>{n===5?68:n===4?22:n===3?7:n===2?2:1}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { author:'Sophie T.',  rating:5, service:'Full Balayage',    date:'2 days ago',  verified:true,  body:'The best balayage I have ever had. Isabella understood exactly what I wanted and the colour looks completely natural.', replied:false },
                  { author:'James R.',   rating:5, service:'Cut and Blowdry',  date:'5 days ago',  verified:true,  body:'Marcus completely transformed my look. Worth every penny. Will not go anywhere else.', replied:true, reply:'Thank you so much James! It was a pleasure working with you.' },
                  { author:'Priya M.',   rating:4, service:'Full Highlights',  date:'1 week ago',  verified:false, body:'Beautiful salon, wonderful atmosphere. Will definitely return.', replied:false },
                  { author:'Anna L.',    rating:5, service:'Keratin Treatment',date:'2 weeks ago', verified:true,  body:'My hair has never felt so healthy. The keratin treatment was transformative.', replied:false },
                ].map((r,i) => (
                  <div key={i} style={{ background:T.white, borderRadius:12, padding:'18px 20px', border:`1px solid ${T.border}`, boxShadow:`0 1px 6px ${T.shadow}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                        <div style={{ width:38, height:38, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontSize:16, color:T.forest }}>{r.author[0]}</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>{r.author}</div>
                          <div style={{ fontSize:11, color:T.inkSoft }}>{r.service} - {r.date}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ color:T.gold, fontSize:13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                        {r.verified && <div style={{ fontSize:10, color:T.sage }}>✓ Verified booking</div>}
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:T.inkMid, lineHeight:1.7, margin:'0 0 12px' }}>{r.body}</p>

                    {/* Existing reply */}
                    {r.replied && (
                      <div style={{ background:T.mint, borderRadius:8, padding:'10px 14px', marginBottom:12, borderLeft:`3px solid ${T.sage}` }}>
                        <div style={{ fontSize:11, color:T.moss, fontWeight:700, marginBottom:4 }}>Your reply:</div>
                        <div style={{ fontSize:12, color:T.inkMid }}>{r.reply}</div>
                      </div>
                    )}

                    {/* Reply box */}
                    {!r.replied && (
                      <div>
                        <textarea placeholder={`Reply to ${r.author}...`}
                          style={{ width:'100%', height:70, padding:'10px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, fontSize:12, outline:'none', resize:'none', boxSizing:'border-box', marginBottom:8 }}/>
                        <Button variant="primary" size="sm">Post Reply</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab==='analytics' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:24 }}>Your Performance</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div style={{ background:T.white, borderRadius:14, padding:22, border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:16 }}>Most Popular Treatments</div>
                  {[
                    { name:'Full Balayage',     pct:34, val:'48 bookings' },
                    { name:'Highlights',         pct:22, val:'31 bookings' },
                    { name:'Colour Correction',  pct:18, val:'25 bookings' },
                    { name:"Cut & Blowdry",      pct:16, val:'22 bookings' },
                    { name:'Keratin Treatment',  pct:10, val:'14 bookings' },
                  ].map(s => (
                    <div key={s.name} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                        <span style={{ color:T.ink }}>{s.name}</span>
                        <span style={{ color:T.sage, fontWeight:600 }}>{s.val}</span>
                      </div>
                      <div style={{ height:6, background:T.border, borderRadius:3 }}>
                        <div style={{ width:`${s.pct}%`, height:'100%', background:`linear-gradient(to right,${T.sage},${T.forest})`, borderRadius:3 }}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:T.white, borderRadius:14, padding:22, border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:16 }}>How Clients Find You</div>
                  {[
                    { src:'Eden Search',        pct:62, color:T.sage   },
                    { src:'Eden AI Concierge',  pct:18, color:T.forest },
                    { src:'Featured Placement', pct:12, color:T.gold   },
                    { src:'Returning Clients',  pct:8,  color:'#c4788a'},
                  ].map(s => (
                    <div key={s.src} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
                      <div style={{ flex:1, fontSize:12, color:T.ink }}>{s.src}</div>
                      <div style={{ width:80, height:6, background:T.border, borderRadius:3 }}>
                        <div style={{ width:`${s.pct}%`, height:'100%', background:s.color, borderRadius:3 }}/>
                      </div>
                      <div style={{ fontSize:12, fontWeight:600, color:T.inkMid, width:30, textAlign:'right' }}>{s.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab==='notifications' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:6 }}>Notification Settings</div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>Control how Eden keeps you and your clients informed.</div>
              {[
                { label:'Client booking confirmation',       sub:'Email sent to client the moment they book',              on:true,  icon:'📧' },
                { label:'Client reminder (24 hours)',         sub:'Reminder sent the day before their appointment',         on:true,  icon:'📱' },
                { label:'Client reminder (2 hours)',          sub:'Final reminder 2 hours before',                          on:true,  icon:'📱' },
                { label:'Reschedule notification to client',  sub:'Automatic notification when you reschedule',             on:true,  icon:'🔄' },
                { label:'Cancellation notification to client',sub:'Client notified if booking is cancelled',               on:true,  icon:'❌' },
                { label:'Cancellation fee notification',      sub:'Client informed of your fee decision by email',          on:true,  icon:'💷' },
                { label:'New booking alert',                  sub:'You are notified the moment a booking is made',          on:true,  icon:'🔔' },
                { label:'SMS alert for new bookings',         sub:'Instant text to your mobile number',                    on:false, icon:'📱' },
                { label:'Weekly performance summary',         sub:'Revenue and booking summary every Monday morning',       on:true,  icon:'📊' },
                { label:'New review notification',            sub:'When a client leaves you a review on Eden',              on:true,  icon:'⭐' },
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:T.white, borderRadius:10, padding:'14px 20px', marginBottom:8, border:`1px solid ${T.border}` }}>
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{s.label}</div>
                      <div style={{ fontSize:11, color:T.inkFaint, marginTop:1 }}>{s.sub}</div>
                    </div>
                  </div>
                  <div style={{ width:44, height:24, borderRadius:12, background:s.on?T.sage:T.border, position:'relative', cursor:'pointer', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:3, left:s.on?23:3, width:18, height:18, borderRadius:'50%', background:T.white, boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {tab==='payments' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:24 }}>Payments & Earnings</div>
              <div style={{ background:'#f0f4ff', borderRadius:14, padding:24, marginBottom:24, border:'1px solid #d0d8f8' }}>
                <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ fontSize:36, flexShrink:0 }}>💳</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:'#2a3070', marginBottom:6 }}>Receive your earnings via Stripe</div>
                    <div style={{ fontSize:13, color:'#505898', lineHeight:1.8, marginBottom:14 }}>Connect your bank account and earnings transfer automatically every week.</div>
                    <a href="https://stripe.com/connect" target="_blank" rel="noreferrer" style={{ display:'inline-block', padding:'10px 24px', background:'#635bff', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13, textDecoration:'none' }}>Connect Bank Account →</a>
                  </div>
                </div>
              </div>
              <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:16 }}>Cancellation Policy</div>
              <div style={{ background:T.offwhite, borderRadius:12, padding:20, border:`1px solid ${T.border}`, marginBottom:24 }}>
                <div style={{ fontSize:13, color:T.inkMid, lineHeight:1.9 }}>
                  🌿 <strong>Eden Cancellation Policy</strong><br/>
                  When a customer cancels and provides a reason, you as the salon owner have <strong>full discretion</strong> to apply a <strong>50% cancellation fee</strong>.<br/>
                  — Cancellations are flagged in your Bookings tab for your review<br/>
                  — You choose: apply the fee or waive it — no pressure either way<br/>
                  — The client is notified of your decision automatically by email<br/>
                  — Any fees charged are added to your next weekly payout
                </div>
              </div>
              <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:14 }}>Recent Earnings</div>
              {[
                { date:'27 May 2026', bookings:14, earnings:'£1,656' },
                { date:'20 May 2026', bookings:12, earnings:'£1,386' },
                { date:'13 May 2026', bookings:11, earnings:'£1,161' },
              ].map((p,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:T.white, borderRadius:10, padding:'14px 20px', marginBottom:8, border:`1px solid ${T.border}`, fontSize:13, flexWrap:'wrap', gap:8 }}>
                  <span style={{ fontWeight:500, color:T.ink }}>{p.date}</span>
                  <span style={{ color:T.inkSoft }}>{p.bookings} bookings</span>
                  <span style={{ color:T.success, fontWeight:700, fontSize:15 }}>{p.earnings}</span>
                  <Badge variant="green" small>paid</Badge>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab==='settings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:24 }}>Account Settings</div>
              <div style={{ background:T.white, borderRadius:14, padding:28, border:`1px solid ${T.border}`, marginBottom:20 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:20 }}>Your Details</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
                  <Input label="Full Name"     defaultValue={profile?.full_name||''} placeholder="Your full name"/>
                  <Input label="Email Address" defaultValue={user?.email||''} placeholder="you@example.com"/>
                  <Input label="Phone Number"  defaultValue={profile?.phone||''} placeholder="+44 7700 000000"/>
                  <Input label="New Password"  type="password" placeholder="Leave blank to keep current"/>
                </div>
                <Button variant="primary" size="md">Save Changes</Button>
              </div>
              <div style={{ background:'#fff8f8', borderRadius:14, padding:24, border:'1px solid #f0d0d0' }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.error, marginBottom:8 }}>Danger Zone</div>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:14 }}>Permanently delete your Eden account and listing. This cannot be undone.</div>
                <Button variant="danger" size="sm">Delete Account</Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      {managingBooking && (
        <ManageBookingModal
          booking={managingBooking}
          onClose={() => setManagingBooking(null)}
          onSave={(u) => { updateBooking(u); setManagingBooking(null) }}
          onCancelFee={(b) => { setManagingBooking(null); setCancelFeeBooking(b) }}
        />
      )}
      {cancelFeeBooking && (
        <CancellationFeeModal
          booking={cancelFeeBooking}
          onClose={() => setCancelFeeBooking(null)}
          onDecision={(b, d) => { handleCancelFeeDecision(b, d); setCancelFeeBooking(null) }}
        />
      )}
      {editingService !== null && (
        <ServiceModal
          service={editingService?.id ? editingService : null}
          onClose={() => setEditingService(null)}
          onSave={(s) => { saveService(s); setEditingService(null) }}
        />
      )}
    </div>
  )
}
