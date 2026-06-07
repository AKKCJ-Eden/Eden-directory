import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Button, Input, Select, Spinner, Badge } from '../lib/design'

const CATS = [
  { value:'hair',        label:'✂ Hair Salon'       },
  { value:'barber',      label:'💈 Barber Shop'     },
  { value:'nails',       label:'💅 Nail Studio'     },
  { value:'aesthetics',  label:'✨ Aesthetics Clinic'},
  { value:'beauty',      label:'🌸 Beauty Salon'    },
  { value:'spa',         label:'🧖 Spa & Wellness'  },
  { value:'makeup',      label:'💄 Makeup Artist'   },
]

const PLANS = [
  {
    id:'free', name:'Starter', price:0,
    tagline:'Get discovered for free',
    features:['Basic listing','Appear in search','Customer enquiries','Eden badge'],
    popular:false,
  },
  {
    id:'standard', name:'Growth', price:59,
    tagline:'Grow your bookings',
    features:['Everything in Starter','Pro verified badge','Priority placement','Booking calendar','Analytics dashboard','Email confirmations'],
    popular:false,
  },
  {
    id:'premium', name:'Premium', price:119,
    tagline:'Dominate your area',
    features:['Everything in Growth','Featured listing (top of results)','AI spotlight','Unlimited gallery','SMS & email notifications','Dedicated account manager'],
    popular:true,
  },
]

export default function ListBusiness({ user }) {
  const [step,     setStep]     = useState(1)
  const [plan,     setPlan]     = useState('standard')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [error,    setError]    = useState('')
  const navigate   = useNavigate()

  // Form state
  const [form, setForm] = useState({
    name:'', category:'hair', phone:'', email:'', website:'',
    address_line1:'', city:'', postcode:'', bio:'',
  })
  const [services, setServices] = useState([
    { name:'', price:'', duration:'60' },
    { name:'', price:'', duration:'60' },
    { name:'', price:'', duration:'60' },
  ])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addService = () => setServices(s => [...s, { name:'', price:'', duration:'60' }])
  const setService = (i, k, v) => setServices(s => s.map((x, idx) => idx===i ? {...x, [k]:v} : x))

  const submit = async () => {
    setLoading(true); setError('')
    try {
      // If user is logged in, create the salon in Supabase
      if (user) {
        const { data: salon, error: salonErr } = await supabase.from('salons').insert([{
          owner_id: user.id,
          name: form.name,
          category: form.category,
          phone: form.phone,
          email: form.email,
          website: form.website,
          address_line1: form.address_line1,
          city: form.city,
          postcode: form.postcode.toUpperCase(),
          bio: form.bio,
          plan: plan,
          active: true,
          verified: false,
        }]).select().single()

        if (salonErr) throw salonErr

        // Insert services
        const validServices = services.filter(s => s.name && s.price)
        if (validServices.length > 0 && salon) {
          await supabase.from('services').insert(
            validServices.map(s => ({
              salon_id: salon.id,
              name: s.name,
              price: parseFloat(s.price),
              duration: parseInt(s.duration),
              active: true,
            }))
          )
        }
      }
      setDone(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const STEP_LABELS = ['About Your Business', 'Services & Prices', 'Choose Your Plan', 'Connect & Launch']

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => {}}/>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'48px 24px' }}>

        {done ? (
          <div style={{ background:T.white, borderRadius:20, padding:'48px 40px', textAlign:'center', boxShadow:`0 8px 40px ${T.shadow}`, animation:'bloom 0.4s ease' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:38 }}>🌿</div>
            <div style={{ fontFamily:F.display, fontSize:32, color:T.forest, marginBottom:10 }}>Welcome to Eden!</div>
            <div style={{ fontSize:15, color:T.inkSoft, lineHeight:1.8, maxWidth:420, margin:'0 auto 28px' }}>
              <strong>{form.name}</strong> is now registered on Eden.<br/>
              Our team will verify your listing within 24 hours and you'll go live immediately after.<br/><br/>
              Most new listings receive their first booking within 72 hours. 🎉
            </div>
            <div style={{ background:T.mint, borderRadius:12, padding:'16px 20px', marginBottom:28, border:`1px solid ${T.sagePale}`, fontSize:13, color:T.moss, lineHeight:1.9, textAlign:'left' }}>
              ✓ <strong>Listing under review</strong> — verified within 24 hours<br/>
              ✓ <strong>Dashboard ready</strong> — manage bookings, view analytics<br/>
              ✓ <strong>Connect Stripe</strong> — to start receiving payouts<br/>
              ✓ <strong>First booking</strong> — usually within 72 hours of going live
            </div>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              {user
                ? <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>Go to Dashboard →</Button>
                : <Button variant="primary" size="lg" onClick={() => navigate('/auth')}>Create Account to Manage Listing →</Button>
              }
              <Button variant="secondary" size="lg" onClick={() => navigate('/')}>Back to Eden</Button>
            </div>
          </div>
        ) : (
          <div style={{ background:T.white, borderRadius:20, padding:'40px 36px', boxShadow:`0 8px 40px ${T.shadow}`, border:`1px solid ${T.border}`, animation:'fadeUp 0.4s ease' }}>

            {/* Header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:6 }}>
                STEP {step} OF 4 — {STEP_LABELS[step-1].toUpperCase()}
              </div>
              <div style={{ fontFamily:F.display, fontSize:28, color:T.forest }}>{STEP_LABELS[step-1]}</div>
            </div>

            {/* Progress bar */}
            <div style={{ display:'flex', gap:4, marginBottom:32 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex:1, height:4, borderRadius:2, background:step>=i?T.forest:T.border, transition:'background 0.3s' }}/>
              ))}
            </div>

            {/* ── STEP 1: Business Details ── */}
            {step === 1 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
                  <Input label="Business Name *" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Verdant Hair Studio"/>
                  <Select label="Category *" value={form.category} onChange={e=>set('category',e.target.value)}
                    options={[{ value:'', label:'Select category…' }, ...CATS]}/>
                  <Input label="Phone Number *" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="020 7000 0000"/>
                  <Input label="Business Email *" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="hello@yoursalon.co.uk"/>
                  <Input label="Website (optional)" value={form.website} onChange={e=>set('website',e.target.value)} placeholder="www.yoursalon.co.uk"/>
                  <Input label="Postcode *" value={form.postcode} onChange={e=>set('postcode',e.target.value)} placeholder="e.g. SW1A 1AA"/>
                  <Input label="Street Address" value={form.address_line1} onChange={e=>set('address_line1',e.target.value)} placeholder="14 Example Street" style={{ gridColumn:'span 1' }}/>
                  <Input label="Town / City" value={form.city} onChange={e=>set('city',e.target.value)} placeholder="London"/>
                </div>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>About Your Business</div>
                  <textarea value={form.bio} onChange={e=>set('bio',e.target.value)}
                    placeholder="Tell customers what makes your salon special — your team, your specialisms, your approach…"
                    style={{ width:'100%', height:90, padding:'11px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:14, outline:'none', resize:'none', boxSizing:'border-box' }}/>
                </div>
                <Button variant="primary" style={{ width:'100%', justifyContent:'center' }}
                  onClick={() => setStep(2)} disabled={!form.name||!form.phone||!form.email||!form.postcode}>
                  Continue →
                </Button>
              </div>
            )}

            {/* ── STEP 2: Services ── */}
            {step === 2 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:18, lineHeight:1.7 }}>
                  Add your main services and prices. You can add, edit and remove these anytime from your dashboard.
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'0 10px', marginBottom:6 }}>
                  <div style={{ fontSize:10, color:T.inkFaint, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', paddingBottom:4 }}>Service Name</div>
                  <div style={{ fontSize:10, color:T.inkFaint, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', paddingBottom:4 }}>Price (£)</div>
                  <div style={{ fontSize:10, color:T.inkFaint, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', paddingBottom:4 }}>Mins</div>
                </div>
                {services.map((s, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'0 10px', marginBottom:8 }}>
                    <input value={s.name} onChange={e=>setService(i,'name',e.target.value)}
                      placeholder={['e.g. Cut & Blowdry','e.g. Full Highlights','e.g. Balayage'][i] || 'Service name'}
                      style={{ padding:'10px 12px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.ink, outline:'none' }}/>
                    <input value={s.price} onChange={e=>setService(i,'price',e.target.value)}
                      placeholder="0.00" type="number" min="0"
                      style={{ padding:'10px 12px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.ink, outline:'none' }}/>
                    <input value={s.duration} onChange={e=>setService(i,'duration',e.target.value)}
                      placeholder="60" type="number" min="5"
                      style={{ padding:'10px 12px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.ink, outline:'none' }}/>
                  </div>
                ))}
                <button onClick={addService} style={{ fontSize:12, color:T.sage, background:'none', border:`1px dashed ${T.sageLight}`, borderRadius:8, padding:'10px 20px', cursor:'pointer', width:'100%', marginBottom:24 }}>
                  + Add another service
                </button>
                <div style={{ display:'flex', gap:12 }}>
                  <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                  <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(3)}>Continue →</Button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Plan ── */}
            {step === 3 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
                  {PLANS.map(p => (
                    <div key={p.id} onClick={() => setPlan(p.id)} style={{
                      borderRadius:12, padding:'18px 20px',
                      border:`2px solid ${plan===p.id?T.forest:T.border}`,
                      background:plan===p.id?T.mint:T.white,
                      cursor:'pointer', transition:'all 0.2s',
                      display:'flex', gap:20, alignItems:'flex-start',
                    }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:4 }}>
                          <div style={{ fontFamily:F.display, fontSize:18, color:T.forest }}>{p.name}</div>
                          {p.popular && <Badge variant="gold" small>Most Popular</Badge>}
                          {plan===p.id && <Badge variant="green" small>Selected</Badge>}
                        </div>
                        <div style={{ fontSize:11, color:T.inkSoft, marginBottom:8 }}>{p.tagline}</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'2px 16px' }}>
                          {p.features.map(f => (
                            <span key={f} style={{ fontSize:11, color:T.inkMid }}>✓ {f}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontFamily:F.display, fontSize:28, color:T.sage }}>{p.price===0?'Free':`£${p.price}`}</div>
                        {p.price>0 && <div style={{ fontSize:10, color:T.inkFaint }}>per month</div>}
                        <div style={{ fontSize:10, color:T.inkSoft, marginTop:4 }}>+ 10% per booking</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:12 }}>
                  <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                  <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(4)}>Continue →</Button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Connect & Launch ── */}
            {step === 4 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                {/* Stripe */}
                <div style={{ background:'#f0f4ff', borderRadius:14, padding:22, marginBottom:20, border:'1px solid #d0d8f8' }}>
                  <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                    <div style={{ fontSize:32, flexShrink:0 }}>💳</div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#2a3070', marginBottom:6 }}>Connect Stripe to receive payments</div>
                      <div style={{ fontSize:13, color:'#505898', lineHeight:1.8, marginBottom:14 }}>
                        Your bank account is authorised and ready. Connect Stripe so Eden can process customer payments and transfer your earnings automatically every week.<br/>
                        Eden retains 10% per booking. Everything else is yours.
                      </div>
                      <a href="https://stripe.com/connect" target="_blank" rel="noreferrer"
                        style={{ display:'inline-block', padding:'10px 22px', background:'#635bff', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13, textDecoration:'none' }}>
                        Connect Stripe Account →
                      </a>
                      <div style={{ fontSize:11, color:'#9090b8', marginTop:8 }}>You can also do this later from your dashboard.</div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background:T.mint, borderRadius:12, padding:'18px 20px', border:`1px solid ${T.sagePale}`, marginBottom:24 }}>
                  <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:12 }}>Listing Summary</div>
                  {[
                    ['Business', form.name],
                    ['Category', CATS.find(c=>c.value===form.category)?.label || form.category],
                    ['Location', `${form.city || form.address_line1}, ${form.postcode}`],
                    ['Plan', PLANS.find(p=>p.id===plan)?.name + (plan!=='free'?` (£${PLANS.find(p=>p.id===plan)?.price}/mo)`:'')],
                    ['Services', `${services.filter(s=>s.name&&s.price).length} added`],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${T.sagePale}`, fontSize:13 }}>
                      <span style={{ color:T.inkSoft }}>{k}</span>
                      <span style={{ fontWeight:600, color:T.forest }}>{v}</span>
                    </div>
                  ))}
                </div>

                {error && <div style={{ background:'#fff0f0', border:'1px solid #f0c0c0', borderRadius:8, padding:'10px 14px', fontSize:13, color:T.error, marginBottom:16 }}>{error}</div>}

                <div style={{ display:'flex', gap:12 }}>
                  <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
                  <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={submit} disabled={loading}>
                    {loading ? <><Spinner size={14} color={T.white}/> Registering…</> : 'Complete Registration ✓'}
                  </Button>
                </div>

                <div style={{ textAlign:'center', marginTop:12, fontSize:11, color:T.inkFaint }}>
                  By registering you agree to Eden's <a href="/terms" style={{ color:T.sage }}>Terms of Service</a> and <a href="/privacy" style={{ color:T.sage }}>Privacy Policy</a>.<br/>
                  AKKCJ LTD · Trading as Eden Technologies · Registered in England & Wales
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
