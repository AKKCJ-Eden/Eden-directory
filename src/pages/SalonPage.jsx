import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSalonById } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Stars, Badge, Button, Spinner, Modal, Input } from '../lib/design'

const DEMO_SALONS = {}
//  BOOKING MODAL 
function BookingModal({ salon, preService, onClose }) {
  const [step,    setStep]    = useState(1)
  const [svc,     setSvc]     = useState(preService || '')
  const [date,    setDate]    = useState('')
  const [time,    setTime]    = useState('')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [notes,   setNotes]   = useState('')
  const [done,    setDone]    = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedSvc = salon.services.find(s => s.name === svc)
  const times = ['9:00','9:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']
  const canNext1 = svc && date && time
  const canNext2 = name && email

  const pay = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1800)
  }

  const progressLabels = ['Service & Time', 'Your Details', 'Payment']

  return (
    <Modal open onClose={!done ? onClose : undefined} width={520}>
      <div style={{ padding: '32px 36px' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeUp 0.4s ease' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>{'\uD83C\uDF89'}</div>
            <div style={{ fontFamily: F.display, fontSize: 28, color: T.forest, marginBottom: 8 }}>Booking Confirmed!</div>
            <div style={{ fontSize: 14, color: T.inkSoft, lineHeight: 1.8, marginBottom: 20 }}>
              <strong>{name}</strong>, your appointment at <strong>{salon.name}</strong> is confirmed.<br/>
               Confirmation sent to <strong>{email}</strong><br/>
              {phone && <span> SMS reminder will be sent to <strong>{phone}</strong><br/></span>}
               {date} at {time}
            </div>
            <Button variant="primary" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: T.sage, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>
                  BOOK APPOINTMENT  STEP {step} OF 3
                </div>
                <div style={{ fontFamily: F.display, fontSize: 22, color: T.forest }}>{salon.name}</div>
              </div>
              <button onClick={onClose} style={{ background: T.offwhite, border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, color: T.inkSoft }}></button>
            </div>

            <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
              {progressLabels.map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: 3, borderRadius: 2, background: step > i + 1 ? T.sage : step === i + 1 ? T.sage : T.border, marginBottom: 5, transition: 'background 0.3s' }}/>
                  <div style={{ fontSize: 9, color: step >= i + 1 ? T.sage : T.inkFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s}</div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ fontSize: 11, color: T.inkSoft, fontWeight: 600, letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' }}>Select Service</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto', marginBottom: 14 }}>
                  {salon.services.map(s => (
                    <div key={s.id || s.name} onClick={() => setSvc(s.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: svc === s.name ? T.mint : T.offwhite, border: `1.5px solid ${svc === s.name ? T.sage : T.border}`, transition: 'all 0.15s' }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{s.name}</span>
                        {s.popular && <span style={{ marginLeft: 8, fontSize: 9, color: T.sage, fontWeight: 700, letterSpacing: 0.5 }}>POPULAR</span>}
                        <div style={{ fontSize: 11, color: T.inkFaint }}>{s.duration} min</div>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: T.gold }}>{s.price === 0 ? 'Free' : `${s.price}`}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.inkSoft, fontWeight: 600, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' }}>Date</div>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: T.offwhite, border: `1px solid ${T.border}`, borderRadius: 8, color: T.ink, fontSize: 14, outline: 'none' }}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T.inkSoft, fontWeight: 600, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' }}>Time</div>
                    <select value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: T.offwhite, border: `1px solid ${T.border}`, borderRadius: 8, color: T.ink, fontSize: 14, outline: 'none' }}>
                      <option value="">Select time</option>
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep(2)} disabled={!canNext1}>
                  Continue 
                </Button>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"/>
                <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/>
                <Input label="Mobile (optional -- for SMS reminders)" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7700 000000"/>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: T.inkSoft, fontWeight: 600, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' }}>Notes (optional)</div>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, preferences, accessibility needs..." style={{ width: '100%', padding: '11px 14px', background: T.offwhite, border: `1px solid ${T.border}`, borderRadius: 8, color: T.ink, fontSize: 14, outline: 'none', resize: 'none', height: 70, boxSizing: 'border-box' }}/>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="ghost" onClick={() => setStep(1)}> Back</Button>
                  <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)} disabled={!canNext2}>
                    Continue 
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ background: T.offwhite, borderRadius: 12, padding: '16px 18px', marginBottom: 16, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft, marginBottom: 10 }}>Booking Summary</div>
                  {[['Service', svc], ['Date', date], ['Time', time], ['Duration', `${selectedSvc ? selectedSvc.duration : 0} min`]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                      <span style={{ color: T.inkSoft }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: 15, fontWeight: 700 }}>
                    <span>Total</span>
                    <span style={{ color: T.gold }}>{selectedSvc && selectedSvc.price === 0 ? 'Free' : selectedSvc ? `${selectedSvc.price}` : ''}</span>
                  </div>
                </div>
                <div style={{ background: '#f8f4ff', borderRadius: 10, padding: '12px 16px', marginBottom: 16, border: '1px solid #e0d8f8', fontSize: 12, color: '#5a4a8a', lineHeight: 1.7 }}>
                   Secure payment via Stripe  PCI-DSS compliant  10% platform fee included
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="ghost" onClick={() => setStep(2)}> Back</Button>
                  <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={pay} disabled={loading}>
                    {loading ? <><Spinner size={14} color={T.white}/> Processing...</> : 'Confirm & Pay '}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

//  REVIEW MODAL 
function ReviewModal({ salon, onClose }) {
  const [rating,      setRating]      = useState(5)
  const [hover,       setHover]       = useState(0)
  const [reviewName,  setReviewName]  = useState('')
  const [reviewBody,  setReviewBody]  = useState('')
  const [done,        setDone]        = useState(false)

  const submit = () => {
    if (!reviewName || !reviewBody) return
    setDone(true)
  }

  return (
    <Modal open onClose={!done ? onClose : undefined} width={460}>
      <div style={{ padding: '32px 36px' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{'\u2B50'}</div>
            <div style={{ fontFamily: F.display, fontSize: 22, color: T.forest }}>Thank you for your review!</div>
            <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 8, marginBottom: 20 }}>Your feedback helps others find great salons.</div>
            <Button variant="primary" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: F.display, fontSize: 22, color: T.forest }}>Review {salon.name}</div>
              <button onClick={onClose} style={{ background: T.offwhite, border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16, color: T.inkSoft }}></button>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 36, color: n <= (hover || rating) ? T.gold : T.border, transition: 'color 0.1s' }}></button>
              ))}
            </div>
            <Input label="Your Name" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="First name & initial e.g. Sophie T."/>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: T.inkSoft, fontWeight: 600, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' }}>Your Experience</div>
              <textarea value={reviewBody} onChange={e => setReviewBody(e.target.value)} placeholder="Tell others about your visit..." style={{ width: '100%', height: 110, padding: '11px 14px', background: T.offwhite, border: `1px solid ${T.border}`, borderRadius: 8, color: T.ink, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }}/>
            </div>
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={submit} disabled={!reviewName || !reviewBody}>
              Submit Review
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}

//  MAIN SALON PAGE 
export default function SalonPage({ user }) {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const [salon,       setSalon]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [tab,         setTab]         = useState('services')
  const [booking,     setBooking]     = useState(null)
  const [reviewing,   setReviewing]   = useState(false)

  useEffect(() => { loadSalon() }, [id])

  const loadSalon = async () => {
    setLoading(true)
    const { data, error } = await getSalonById(id)
    if (error || !data) {
      setSalon(null)
    } else {
      setSalon(data)
    }
    setLoading(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{GLOBAL_CSS}</style>
      <Spinner size={32}/>
    </div>
  )

  if (!salon) return null

  return (
    <div style={{ minHeight: '100vh', background: T.cream, fontFamily: F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')}/>

      {/* Hero */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={salon.images && salon.images[0]} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${T.cream})` }}/>
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: T.forest }}> Back</button>
        <div style={{ position: 'absolute', bottom: 16, left: 24, display: 'flex', gap: 6 }}>
          {salon.verified && <Badge variant="green"> Verified</Badge>}
          {salon.plan === 'premium' && <Badge variant="gold"> Premium</Badge>}
          {salon.promoted && <Badge variant="forest">Featured</Badge>}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: 34, color: T.forest, fontWeight: 400, marginBottom: 4 }}>{salon.name}</h1>
            <div style={{ fontSize: 13, color: T.inkSoft }}> {salon.area || salon.city}  {salon.postcode}</div>
          </div>
          <Button variant="primary" size="lg" onClick={() => setBooking(true)} style={{ flexShrink: 0 }}>Book Now</Button>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Stars r={Math.round(salon.rating)} size={16}/>
          <span style={{ fontSize: 18, fontWeight: 700, color: T.gold }}>{salon.rating}</span>
          <span style={{ fontSize: 13, color: T.inkSoft }}>{salon.review_count || 0} reviews</span>
        </div>

        {/* Contact */}
        <div style={{ fontSize: 13, color: T.inkSoft, marginBottom: 16 }}>
          {salon.phone && <span> {salon.phone}  </span>}
          {salon.email && <span> {salon.email}</span>}
          {salon.web && <span>   {salon.web}</span>}
        </div>

        {/* Bio */}
        {salon.bio && <p style={{ fontSize: 15, color: T.inkMid, lineHeight: 1.8, marginBottom: 24 }}>{salon.bio}</p>}

        {/* Opening hours */}
        {salon.open_hours && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {Object.entries(salon.open_hours).map(([day, hours]) => (
              <div key={day} style={{ padding: '5px 10px', background: hours === 'Closed' ? T.offwhite : T.mint, borderRadius: 6, border: `1px solid ${hours === 'Closed' ? T.border : T.sagePale}`, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: hours === 'Closed' ? T.inkFaint : T.moss, letterSpacing: 0.5 }}>{day}</div>
                <div style={{ fontSize: 10, color: hours === 'Closed' ? T.inkFaint : T.forest, fontWeight: 500 }}>{hours}</div>
              </div>
            ))}
          </div>
        )}

        {/* Staff */}
        {salon.staff && salon.staff.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {salon.staff.map((s, i) => (
              <div key={i} style={{ background: T.white, borderRadius: 10, padding: '10px 14px', border: `1px solid ${T.border}`, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 18, color: T.forest }}>
                  {s.name ? s.name[0] : '?'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: T.inkSoft }}>{s.role}</div>
                  {s.experience && <div style={{ fontSize: 10, color: T.sage }}>{s.experience} experience</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${T.border}`, marginBottom: 24 }}>
          {['services', 'reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? T.forest : 'transparent'}`, marginBottom: -2, color: tab === t ? T.forest : T.inkSoft, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>{t}</button>
          ))}
        </div>

        {/* Services tab */}
        {tab === 'services' && (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ textAlign: 'left',  padding: '8px 0', fontSize: 10, color: T.inkFaint, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Service</th>
                  <th style={{ textAlign: 'left',  padding: '8px 0', fontSize: 10, color: T.inkFaint, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Duration</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 10, color: T.inkFaint, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Price</th>
                  <th style={{ padding: '8px 0' }}></th>
                </tr>
              </thead>
              <tbody>
                {(salon.services || []).map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: '13px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{s.name}</span>
                        {s.popular && <Badge variant="green" small>Popular</Badge>}
                      </div>
                    </td>
                    <td style={{ padding: '13px 0', fontSize: 12, color: T.inkSoft }}>{s.duration} min</td>
                    <td style={{ textAlign: 'right', padding: '13px 0', fontSize: 15, fontWeight: 700, color: T.gold }}>
                      {s.price === 0 ? 'Free' : `${s.price}`}
                    </td>
                    <td style={{ textAlign: 'right', paddingLeft: 12 }}>
                      <button onClick={() => setBooking(s.name)} style={{ padding: '5px 14px', background: T.forest, border: 'none', borderRadius: 6, color: T.white, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Book</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 14, padding: '12px 16px', background: T.mint, borderRadius: 8, fontSize: 11, color: T.moss, border: `1px solid ${T.sagePale}` }}>
               Secure payments via Stripe  Instant email and SMS confirmation  Free cancellation up to 24 hours before
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {tab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', gap: 20, background: T.offwhite, borderRadius: 12, padding: 18, marginBottom: 16, border: `1px solid ${T.border}` }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: F.display, fontSize: 52, color: T.forest, lineHeight: 1 }}>{salon.rating}</div>
                <Stars r={Math.round(salon.rating)} size={16}/>
                <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 4 }}>{salon.review_count || 0} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: T.inkSoft, width: 8 }}>{n}</span>
                    <span style={{ color: T.gold, fontSize: 11 }}></span>
                    <div style={{ flex: 1, height: 7, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${n===5?68:n===4?22:n===3?7:n===2?2:1}%`, height: '100%', background: T.sage, borderRadius: 4 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {(salon.reviews || []).map((r, i) => (
                <div key={i} style={{ background: T.offwhite, borderRadius: 10, padding: '16px 18px', border: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 16, color: T.forest }}>
                        {r.author_name ? r.author_name[0] : '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{r.author_name}</div>
                        {r.verified && <div style={{ fontSize: 10, color: T.sage }}> Verified booking</div>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Stars r={r.rating} size={11}/>
                      <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 2 }}>{r.created_at}</div>
                    </div>
                  </div>
                  {r.service_name && <Badge variant="grey" small>{r.service_name}</Badge>}
                  <p style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.7, margin: '10px 0 0' }}>{r.body}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setReviewing(true)} style={{ width: '100%', padding: 13, background: 'transparent', border: `1.5px dashed ${T.sageLight}`, borderRadius: 10, color: T.sage, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
               Write a Review
            </button>
          </div>
        )}
      </div>

      {booking && (
        <BookingModal
          salon={salon}
          preService={typeof booking === 'string' ? booking : ''}
          onClose={() => setBooking(null)}
        />
      )}

      {reviewing && (
        <ReviewModal salon={salon} onClose={() => setReviewing(false)}/>
      )}
    </div>
  )
}
