import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Button, Input, Select, Spinner, Badge } from '../lib/design'

const CATS = [
  { value:'hair',        label:' Hair Salon'                  },
  { value:'barber',      label:' Barber Shop'                 },
  { value:'nails',       label:' Nail Studio'                 },
  { value:'aesthetics',  label:' Aesthetics Clinic'           },
  { value:'beauty',      label:' Beauty Salon'               },
  { value:'spa',         label:' Spa & Wellness'             },
  { value:'makeup',      label:' Makeup Artist'              },
  { value:'tattoo',      label:' Tattoo & Body Piercing'     },
  { value:'tanning',     label:' Tanning Salon'              },
  { value:'fitness',     label:' Health & Fitness'           },
  { value:'pt',          label:' Personal Training'          },
  { value:'dog',         label:' Dog Grooming'               },
  { value:'mobile',      label:' Mobile & Home Services'     },
  { value:'integration', label:' Hair Integration'           },
  { value:'laser',       label:' Laser Treatment & Removal'  },
  { value:'health',      label:' Health Services'            },
  { value:'dental',      label:' Dental Services'            },
  { value:'afro',        label:' Afro Caribbean Hair'        },
  { value:'semiperm',    label:' Semi-Permanent Tattoo'      },
]

const PLANS = [
  {
    id:'free', name:'Starter', price:0,
    tagline:'Start getting discovered today',
    cta:'Join Free',
    features:[
      'Your salon listed on Eden',
      'Appear in local search results',
      'Customer enquiry form',
      'Eden verified badge',
      'New clients find you instantly',
    ],
    popular:false,
  },
  {
    id:'standard', name:'Growth', price:59,
    tagline:'Grow faster with more visibility',
    cta:'Start Growing',
    features:[
      'Everything in Starter',
      'Priority placement in search results',
      'Pro verified badge',
      'Full online booking calendar',
      'Performance dashboard',
      'Automatic booking confirmations sent to clients',
      'Collect genuine customer reviews',
    ],
    popular:false,
  },
  {
    id:'premium', name:'Premium', price:119,
    tagline:'Become the go-to salon in your area',
    cta:'Go Premium',
    features:[
      'Everything in Growth',
      'Featured at the very top of local results',
      'AI-powered customer recommendations',
      'Unlimited photo gallery',
      'SMS & email client notifications',
      'Promotional offers tool',
      'Dedicated Eden account manager',
    ],
    popular:true,
  },
]

const BENEFITS = [
  { icon:'', text:'Thousands of local customers searching for your services right now' },
  { icon:'', text:'Your booking calendar works 24/7 -- even while you sleep' },
  { icon:'', text:'Build a 5-star reputation with verified customer reviews' },
  { icon:'', text:'Most new listings receive their first Eden booking within 72 hours' },
]

export default function ListBusiness({ user }) {
  const [step,    setStep]    = useState(1)
  const [plan,    setPlan]    = useState('standard')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')
  const navigate  = useNavigate()

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

  const STEP_LABELS = ['About Your Business', 'Your Services', 'Choose Your Plan', 'Go Live']

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => {}}/>

      {done ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 62px)', padding:24 }}>
          <div style={{ background:T.white, borderRadius:20, padding:'48px 40px', textAlign:'center', maxWidth:540, boxShadow:`0 8px 40px ${T.shadow}`, animation:'bloom 0.4s ease' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:38 }}></div>
            <div style={{ fontFamily:F.display, fontSize:32, color:T.forest, marginBottom:10 }}>You're on Eden!</div>
            <div style={{ fontSize:15, color:T.inkSoft, lineHeight:1.8, maxWidth:400, margin:'0 auto 28px' }}>
              Welcome to the family, <strong>{form.name}</strong>.<br/>
              Your listing is being reviewed and will go live within 24 hours.<br/>
              Most new businesses receive their first booking within 72 hours. 
            </div>
            <div style={{ background:T.mint, borderRadius:12, padding:'16px 20px', marginBottom:28, border:`1px solid ${T.sagePale}`, fontSize:13, color:T.moss, lineHeight:2, textAlign:'left' }}>
               Your listing is under review -- goes live within 24 hours<br/>
               New clients will start discovering you immediately<br/>
               Your booking calendar is ready to take appointments<br/>
               Your account manager will be in touch on day one
            </div>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              {user
                ? <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>Go to My Dashboard </Button>
                : <Button variant="primary" size="lg" onClick={() => navigate('/auth')}>Create Account to Manage Your Listing </Button>
              }
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', minHeight:'calc(100vh - 62px)', maxWidth:1100, margin:'0 auto', gap:0 }}>

          {/* Left -- benefits panel */}
          <div style={{ background:`linear-gradient(160deg,${T.forestDark},${T.forest},${T.moss})`, padding:'60px 48px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontSize:10, letterSpacing:4, color:T.sageLight, textTransform:'uppercase', marginBottom:16, fontWeight:600 }}>Join Eden</div>
            <h2 style={{ fontFamily:F.display, fontSize:'clamp(28px,4vw,44px)', fontWeight:300, color:T.white, lineHeight:1.2, marginBottom:20 }}>
              More clients.<br/><em style={{ color:T.goldLight }}>Less effort.</em>
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.8, marginBottom:40, maxWidth:380 }}>
              Eden connects your salon with thousands of local customers actively searching for exactly what you offer -- right now.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {BENEFITS.map((b,i) => (
                <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{b.icon}</div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.7, paddingTop:8 }}>{b.text}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:40, padding:'16px 20px', background:'rgba(255,255,255,0.06)', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize:12, color:T.goldLight, fontWeight:600, marginBottom:4 }}>Free to join</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>
                Start with a free listing and upgrade whenever you want more visibility. No long-term contracts. Cancel anytime.
              </div>
            </div>
          </div>

          {/* Right -- form */}
          <div style={{ background:T.white, padding:'40px 36px', overflowY:'auto' }}>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.sage, letterSpacing:2, fontWeight:700, marginBottom:6 }}>
                STEP {step} OF 4 -- {STEP_LABELS[step-1].toUpperCase()}
              </div>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>{STEP_LABELS[step-1]}</div>
            </div>

            <div style={{ display:'flex', gap:4, marginBottom:28 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex:1, height:4, borderRadius:2, background:step>=i?T.forest:T.border, transition:'background 0.3s' }}/>
              ))}
            </div>

            {/* Step 1 -- Details */}
            {step === 1 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                  <Input label="Business Name *" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Bloom Hair Studio"/>
                  <Select label="Category *" value={form.category} onChange={e=>set('category',e.target.value)}
                    options={[{ value:'', label:'Select category...' }, ...CATS]}/>
                  <Input label="Phone Number *" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="020 7000 0000"/>
                  <Input label="Business Email *" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="hello@yoursalon.co.uk"/>
                  <Input label="Website (optional)" value={form.website} onChange={e=>set('website',e.target.value)} placeholder="www.yoursalon.co.uk"/>
                  <Input label="Postcode *" value={form.postcode} onChange={e=>set('postcode',e.target.value)} placeholder="e.g. SW1A 1AA"/>
                  <Input label="Street Address" value={form.address_line1} onChange={e=>set('address_line1',e.target.value)} placeholder="14 Example Street"/>
                  <Input label="Town / City" value={form.city} onChange={e=>set('city',e.target.value)} placeholder="London"/>
                </div>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:T.inkSoft, fontWeight:600, letterSpacing:0.5, marginBottom:5, textTransform:'uppercase' }}>Tell customers what makes you special</div>
                  <textarea value={form.bio} onChange={e=>set('bio',e.target.value)}
                    placeholder="Share your story -- your team, your specialisms, your approach to beauty..."
                    style={{ width:'100%', height:90, padding:'11px 14px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:8, color:T.ink, fontSize:14, outline:'none', resize:'none', boxSizing:'border-box' }}/>
                </div>
                <Button variant="primary" style={{ width:'100%', justifyContent:'center' }}
                  onClick={() => setStep(2)} disabled={!form.name||!form.phone||!form.email||!form.postcode}>
                  Continue 
                </Button>
              </div>
            )}

            {/* Step 2 -- Services */}
            {step === 2 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:18, lineHeight:1.7 }}>
                  Add your services so customers know exactly what you offer. You can update these anytime.
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'0 10px', marginBottom:6 }}>
                  <div style={{ fontSize:10, color:T.inkFaint, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', paddingBottom:4 }}>Treatment Name</div>
                  <div style={{ fontSize:10, color:T.inkFaint, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', paddingBottom:4 }}>Price ()</div>
                  <div style={{ fontSize:10, color:T.inkFaint, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', paddingBottom:4 }}>Mins</div>
                </div>
                {services.map((s, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'0 10px', marginBottom:8 }}>
                    <input value={s.name} onChange={e=>setService(i,'name',e.target.value)}
                      placeholder={['e.g. Cut & Blowdry','e.g. Full Highlights','e.g. Facial'][i] || 'Treatment name'}
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
                  + Add another treatment
                </button>
                <div style={{ display:'flex', gap:10 }}>
                  <Button variant="ghost" onClick={() => setStep(1)}> Back</Button>
                  <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(3)}>Continue </Button>
                </div>
              </div>
            )}

            {/* Step 3 -- Plan */}
            {step === 3 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16, lineHeight:1.7 }}>
                  Choose how you want to grow. Start free and upgrade whenever you're ready -- no long-term commitment.
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
                  {PLANS.map(p => (
                    <div key={p.id} onClick={() => setPlan(p.id)} style={{
                      borderRadius:12, padding:'16px 18px',
                      border:`2px solid ${plan===p.id?T.forest:T.border}`,
                      background:plan===p.id?T.mint:T.white,
                      cursor:'pointer', transition:'all 0.2s',
                      display:'flex', gap:16, alignItems:'flex-start',
                    }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                          <div style={{ fontFamily:F.display, fontSize:17, color:T.forest }}>{p.name}</div>
                          {p.popular && <Badge variant="gold" small>Most Popular</Badge>}
                          {plan===p.id && <Badge variant="green" small>Selected</Badge>}
                        </div>
                        <div style={{ fontSize:11, color:T.inkSoft, marginBottom:8 }}>{p.tagline}</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'2px 12px' }}>
                          {p.features.slice(0,3).map(f => (
                            <span key={f} style={{ fontSize:11, color:T.inkMid }}> {f}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontFamily:F.display, fontSize:26, color:T.sage }}>{p.price===0?'Free':`${p.price}`}</div>
                        {p.price>0 && <div style={{ fontSize:10, color:T.inkFaint }}>per month</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <Button variant="ghost" onClick={() => setStep(2)}> Back</Button>
                  <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={() => setStep(4)}>Continue </Button>
                </div>
              </div>
            )}

            {/* Step 4 -- Launch */}
            {step === 4 && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ background:T.mint, borderRadius:12, padding:'18px 20px', border:`1px solid ${T.sagePale}`, marginBottom:20 }}>
                  <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:12 }}>Your Listing Summary</div>
                  {[
                    ['Business',  form.name],
                    ['Category',  CATS.find(c=>c.value===form.category)?.label || form.category],
                    ['Location',  `${form.city || form.address_line1}, ${form.postcode}`],
                    ['Plan',      PLANS.find(p=>p.id===plan)?.name],
                    ['Treatments',`${services.filter(s=>s.name&&s.price).length} added`],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${T.sagePale}`, fontSize:13 }}>
                      <span style={{ color:T.inkSoft }}>{k}</span>
                      <span style={{ fontWeight:600, color:T.forest }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background:'#f0f4ff', borderRadius:12, padding:'16px 18px', marginBottom:20, border:'1px solid #d0d8f8' }}>
                  <div style={{ fontSize:13, color:'#505898', lineHeight:1.8 }}>
                     <strong>Connect Stripe to receive your bookings seamlessly</strong><br/>
                    Customers pay through Eden and you receive your earnings automatically. Quick and easy to set up from your dashboard after registration.
                  </div>
                </div>

                {error && <div style={{ background:'#fff0f0', border:'1px solid #f0c0c0', borderRadius:8, padding:'10px 14px', fontSize:13, color:T.error, marginBottom:16 }}>{error}</div>}

                <div style={{ display:'flex', gap:10 }}>
                  <Button variant="ghost" onClick={() => setStep(3)}> Back</Button>
                  <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={submit} disabled={loading}>
                    {loading ? <><Spinner size={14} color={T.white}/> Setting up your listing...</> : 'Join Eden Now '}
                  </Button>
                </div>

                <div style={{ textAlign:'center', marginTop:12, fontSize:11, color:T.inkFaint, lineHeight:1.7 }}>
                  By joining you agree to Eden's <a href="/terms" style={{ color:T.sage }}>Terms of Service</a> and <a href="/privacy" style={{ color:T.sage }}>Privacy Policy</a>.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
