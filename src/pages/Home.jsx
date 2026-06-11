import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_CSS, T, F, Nav, Button, Badge, Stars } from '../lib/design'

const CATS = [
  { id:'all',        label:'All'                        },
  { id:'hair',       label:'Hair Salons'                },
  { id:'barber',     label:'Barbers'                    },
  { id:'nails',      label:'Nail Studios'               },
  { id:'aesthetics', label:'Aesthetics'                 },
  { id:'beauty',     label:'Beauty'                     },
  { id:'spa',        label:'Spa and Wellness'           },
  { id:'makeup',     label:'Makeup Artists'             },
  { id:'tattoo',     label:'Tattoo and Piercing'        },
  { id:'tanning',    label:'Tanning Salons'             },
  { id:'fitness',    label:'Health and Fitness'         },
  { id:'pt',         label:'Personal Training'          },
  { id:'dog',        label:'Dog Grooming'               },
  { id:'mobile',     label:'Mobile and Home Services'   },
  { id:'integration',label:'Hair Integration'           },
  { id:'laser',      label:'Laser Treatment'            },
  { id:'health',     label:'Health Services'            },
  { id:'dental',     label:'Dental Services'            },
  { id:'afro',       label:'Afro Caribbean Hair'        },
  { id:'semiperm',   label:'Semi-Permanent Tattoo'      },
]

// Customer-facing features -- all about the value to them
const CUSTOMER_FEATURES = [
  { i:'', t:'Find Beauty Near You',      d:'Search by postcode and find every salon, barber, spa and clinic within your chosen radius across the UK.' },
  { i:'', t:'Compare & Choose',          d:'See services and prices side-by-side so you always find the perfect treatment at the right price.' },
  { i:'', t:'Book in Seconds',           d:'Instant booking, instant confirmation. No phone calls, no waiting -- just seamless appointments.' },
  { i:'', t:'Your AI Beauty Advisor',    d:"Tell our AI what you're looking for and it'll find the perfect match -- personalised just for you." },
  { i:'', t:'Honest Reviews',            d:'Every review is from a real verified booking. Trust the stars -- they mean something on Eden.' },
  { i:'', t:'Never Miss an Appointment', d:'Smart reminders sent to you 24 hours and 2 hours before -- so you always arrive feeling prepared.' },
  { i:'', t:'Everywhere in the UK',      d:'From London to Edinburgh, Cornwall to Aberdeen -- every town, every city, all in one beautiful place.' },
  { i:'', t:'Every Treatment Covered',   d:'Hair, nails, aesthetics, tattoo, fitness, dental, dog grooming, mobile services and more -- whatever you need, Eden has it.' },
  { i:'', t:'Safe & Secure',             d:'Your bookings and payments are fully protected. Book with complete confidence, every time.' },
]

// Business-facing benefits -- all about growth, no fee language
const BUSINESS_BENEFITS = [
  { i:'', t:'Get Discovered',            d:'Appear in front of thousands of local customers actively searching for your services right now.' },
  { i:'', t:'Fill Your Diary',           d:'Our smart booking calendar works around the clock -- taking appointments even while you sleep.' },
  { i:'', t:'Grow Your Client Base',     d:'Reach new customers you would never have found on your own. Eden brings them directly to you.' },
  { i:'', t:'Build Your Reputation',     d:'Collect genuine verified reviews that build trust and bring in more bookings automatically.' },
  { i:'', t:'AI-Powered Spotlight',      d:'Our AI concierge recommends your salon to customers searching for exactly what you offer.' },
  { i:'', t:'Understand Your Business',  d:'Easy-to-read dashboards show you which services are most popular and when your busiest times are.' },
]

const PLANS = [
  {
    id:'free', name:'Starter', price:0,
    tagline:'Start getting discovered today',
    cta: 'Join Free',
    features:[
      'Your salon listed on Eden',
      'Appear in local search results',
      'Customer enquiry form',
      'Eden verified badge',
      'Get found by new customers',
    ],
    popular:false,
  },
  {
    id:'standard', name:'Growth', price:59,
    tagline:'Grow faster with more visibility',
    cta: 'Start Growing',
    features:[
      'Everything in Starter',
      'Priority placement in search',
      'Pro verified badge',
      'Full online booking calendar',
      'Performance dashboard',
      'Automatic booking confirmations',
      'Customer review collection',
    ],
    popular:false,
  },
  {
    id:'premium', name:'Premium', price:119,
    tagline:'Become the go-to salon in your area',
    cta: 'Go Premium',
    features:[
      'Everything in Growth',
      'Featured at the top of results',
      'AI-powered customer spotlight',
      'Unlimited photo gallery',
      'SMS & email notifications',
      'Promotional offers tool',
      'Dedicated Eden account manager',
    ],
    popular:true,
  },
]

const TESTIMONIALS = [
  { name:'Sarah M.', role:'Hair Salon Owner, Manchester', text:"Since joining Eden we've been fully booked every week. The new clients just keep coming -- it's transformed our business.", avatar:'S' },
  { name:'James K.', role:'Barber, London',               text:"I was sceptical at first but within two weeks I had more bookings than I could handle. Best decision I've made for the shop.", avatar:'J' },
  { name:'Priya T.', role:'Aesthetics Clinic, Birmingham', text:"Eden brought us clients we never would have found on social media. Professional, easy to use, and genuinely effective.", avatar:'P' },
]

export default function Home({ user }) {
  const [postcode,  setPostcode]  = useState('')
  const [category,  setCategory]  = useState('all')
  const [radius,    setRadius]    = useState(100)
  const [pcValid,   setPcValid]   = useState(null)
  const [pcLoading, setPcLoading] = useState(false)
  const navigate = useNavigate()
  const timer = useRef(null)

  const validatePC = async (pc) => {
    if (!pc || pc.replace(/\s/g,'').length < 5) { setPcValid(null); return }
    setPcLoading(true)
    try {
      const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}/validate`)
      const d = await r.json()
      setPcValid(d.result === true)
    } catch { setPcValid(null) }
    setPcLoading(false)
  }

  const handlePC = (val) => {
    setPostcode(val)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => validatePC(val), 600)
  }

  const search = () => {
    if (!postcode.trim()) return
    navigate(`/search?postcode=${encodeURIComponent(postcode)}&radius=${radius}&category=${category}`)
  }

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')}/>

      {/*  HERO  */}
      <section style={{
        background:`linear-gradient(150deg, ${T.forestDark} 0%, ${T.forest} 55%, ${T.moss} 100%)`,
        padding:'90px 24px 80px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.05,pointerEvents:'none' }} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="200" cy="300" rx="400" ry="300" fill="#a8c8ae"/>
          <ellipse cx="1000" cy="150" rx="350" ry="280" fill="#7aaa82"/>
          <ellipse cx="600" cy="500" rx="300" ry="200" fill="#5a8a62"/>
        </svg>
        <div style={{ position:'relative', zIndex:1, animation:'fadeUp 0.7s ease both', maxWidth:760, margin:'0 auto' }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:30,padding:'6px 18px',marginBottom:28,backdropFilter:'blur(8px)' }}>
            <span style={{ width:7,height:7,borderRadius:'50%',background:T.goldLight,display:'inline-block',animation:'pulse 2s infinite' }}/>
            <span style={{ fontSize:11,color:'rgba(255,255,255,0.85)',letterSpacing:2,fontWeight:500 }}>THE UK'S BEAUTY DIRECTORY</span>
          </div>
          <h1 style={{ fontFamily:F.display,fontSize:'clamp(36px,6vw,58px)',fontWeight:300,color:T.white,lineHeight:1.12,margin:'0 0 20px',letterSpacing:-0.5 }}>
            Find. Book. <em style={{ color:T.goldLight }}>Feel beautiful.</em>
          </h1>
          <p style={{ fontSize:17,color:'rgba(255,255,255,0.7)',lineHeight:1.8,marginBottom:48,maxWidth:500,margin:'0 auto 48px' }}>
            The UK's most trusted beauty and wellness directory. Discover salons, barbers, spas, tattoo studios, fitness trainers, dental practices and more near you -- and book instantly.
          </p>

          {/* Search */}
          <div style={{ maxWidth:640,margin:'0 auto 12px',background:T.white,borderRadius:14,display:'flex',overflow:'hidden',boxShadow:'0 12px 50px rgba(0,0,0,0.22)',border:`2px solid ${T.sagePale}` }}>
            <div style={{ display:'flex',alignItems:'center',padding:'0 14px',flexShrink:0,borderRight:`1px solid ${T.border}`,gap:4 }}>
              <span style={{ fontSize:20,opacity:0.5 }}></span>
              {pcValid === true  && <span style={{ color:T.success,fontSize:12 }}></span>}
              {pcValid === false && <span style={{ color:T.error,  fontSize:12 }}></span>}
            </div>
            <input
              value={postcode} onChange={e => handlePC(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Enter your postcode  e.g. SW1A 1AA"
              style={{ flex:1,padding:'17px 12px',background:'none',border:'none',color:T.ink,fontSize:15,outline:'none',fontFamily:F.body }}
            />
            <select value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ padding:'0 12px',background:T.offwhite,border:'none',borderLeft:`1px solid ${T.border}`,color:T.inkMid,fontSize:13,cursor:'pointer',flexShrink:0 }}>
              {[5,10,25,50,100].map(r => <option key={r} value={r}>{r} miles</option>)}
            </select>
            <button onClick={search} style={{ padding:'0 24px',background:T.forest,border:'none',color:T.white,fontWeight:700,fontSize:13,letterSpacing:1,cursor:'pointer',textTransform:'uppercase',flexShrink:0,transition:'background 0.18s' }}
              onMouseEnter={e => e.target.style.background = T.moss}
              onMouseLeave={e => e.target.style.background = T.forest}>
              Search
            </button>
          </div>
          {pcValid === false && <div style={{ fontSize:12,color:'rgba(255,200,100,0.9)',marginBottom:8 }}>Please enter a valid UK postcode</div>}

          {/* Category pills */}
          <div style={{ display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:22 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                padding:'7px 16px',borderRadius:30,fontSize:12,fontWeight:500,cursor:'pointer',border:'none',
                background: category===c.id ? T.white : 'rgba(255,255,255,0.13)',
                color: category===c.id ? T.forest : 'rgba(255,255,255,0.82)',
                boxShadow: category===c.id ? '0 2px 12px rgba(26,58,31,0.2)' : 'none',
                transition:'all 0.2s',
              }}>{c.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/*  WHY CUSTOMERS LOVE EDEN  */}
      <section style={{ padding:'70px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:T.sage,textTransform:'uppercase',marginBottom:12,fontWeight:600 }}>For customers</div>
          <h2 style={{ fontFamily:F.display,fontSize:'clamp(28px,4vw,42px)',color:T.forest,fontWeight:300 }}>Everything you need to look and feel your best</h2>
          <p style={{ fontSize:15,color:T.inkSoft,marginTop:12,maxWidth:500,margin:'12px auto 0',lineHeight:1.7 }}>Eden makes finding and booking beauty treatments effortless -- so you can spend less time searching and more time enjoying.</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20 }}>
          {CUSTOMER_FEATURES.map((f,i) => (
            <div key={i} style={{ background:T.white,borderRadius:14,padding:'24px 22px',border:`1px solid ${T.border}`,boxShadow:`0 2px 12px ${T.shadow}`,animation:`fadeUp 0.5s ease ${i*0.04}s both` }}>
              <div style={{ width:52,height:52,background:T.mint,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,marginBottom:14 }}>{f.i}</div>
              <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:8 }}>{f.t}</div>
              <div style={{ fontSize:13,color:T.inkSoft,lineHeight:1.75 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/*  TESTIMONIALS  */}
      <section style={{ background:T.offwhite, padding:'60px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:10,letterSpacing:5,color:T.sage,textTransform:'uppercase',marginBottom:12,fontWeight:600 }}>Real stories</div>
            <h2 style={{ fontFamily:F.display,fontSize:'clamp(24px,4vw,36px)',color:T.forest,fontWeight:300 }}>Businesses thriving on Eden</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:T.white,borderRadius:14,padding:'24px 22px',border:`1px solid ${T.border}`,boxShadow:`0 2px 12px ${T.shadow}` }}>
                <div style={{ fontSize:24,color:T.gold,marginBottom:12,letterSpacing:2 }}></div>
                <p style={{ fontSize:14,color:T.inkMid,lineHeight:1.8,marginBottom:16,fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex',gap:12,alignItems:'center' }}>
                  <div style={{ width:40,height:40,borderRadius:'50%',background:T.mint,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:18,color:T.forest }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:T.ink }}>{t.name}</div>
                    <div style={{ fontSize:11,color:T.inkSoft }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  FOR BUSINESSES  */}
      <section style={{ padding:'70px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:T.sage,textTransform:'uppercase',marginBottom:12,fontWeight:600 }}>For beauty businesses</div>
          <h2 style={{ fontFamily:F.display,fontSize:'clamp(28px,4vw,42px)',color:T.forest,fontWeight:300 }}>Your salon. More clients. Less effort.</h2>
          <p style={{ fontSize:15,color:T.inkSoft,marginTop:12,maxWidth:520,margin:'12px auto 0',lineHeight:1.7 }}>
            Eden works in the background so you can focus on what you do best. We bring the clients to you.
          </p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20 }}>
          {BUSINESS_BENEFITS.map((f,i) => (
            <div key={i} style={{ background:T.white,borderRadius:14,padding:'24px 22px',border:`1px solid ${T.border}`,boxShadow:`0 2px 12px ${T.shadow}` }}>
              <div style={{ width:52,height:52,background:T.mint,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,marginBottom:14 }}>{f.i}</div>
              <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:8 }}>{f.t}</div>
              <div style={{ fontSize:13,color:T.inkSoft,lineHeight:1.75 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/*  PLANS  */}
      <section style={{ padding:'70px 24px', maxWidth:980, margin:'0 auto', textAlign:'center' }}>
        <div style={{ fontSize:10,letterSpacing:5,color:T.sage,textTransform:'uppercase',marginBottom:12,fontWeight:600 }}>Simple, transparent plans</div>
        <h2 style={{ fontFamily:F.display,fontSize:'clamp(26px,4vw,40px)',color:T.forest,fontWeight:300,marginBottom:8 }}>Start free. Grow when you're ready.</h2>
        <p style={{ fontSize:15,color:T.inkSoft,marginBottom:44,maxWidth:480,margin:'0 auto 44px',lineHeight:1.7 }}>
          No upfront costs. No long contracts. Join free and upgrade whenever you want more visibility and more bookings.
        </p>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20 }}>
          {PLANS.map(p => (
            <div key={p.id} style={{
              borderRadius:16, padding:'30px 24px', textAlign:'left', position:'relative',
              border:`2px solid ${p.popular ? T.forest : T.border}`,
              background: p.popular ? T.forest : T.white,
              boxShadow: p.popular ? `0 16px 60px ${T.shadowLg}` : `0 2px 12px ${T.shadow}`,
            }}>
              {p.popular && <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:T.gold,color:T.white,fontSize:10,fontWeight:700,letterSpacing:1,padding:'4px 16px',borderRadius:20,whiteSpace:'nowrap' }}> MOST POPULAR</div>}
              <div style={{ fontFamily:F.display,fontSize:22,color:p.popular?T.white:T.forest,marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:12,color:p.popular?T.sageLight:T.inkSoft,marginBottom:16 }}>{p.tagline}</div>
              <div style={{ marginBottom:20 }}>
                <span style={{ fontFamily:F.display,fontSize:40,color:p.popular?T.goldLight:T.sage,fontWeight:300 }}>{p.price===0?'Free':`${p.price}`}</span>
                {p.price>0 && <span style={{ fontSize:13,color:p.popular?T.sageLight:T.inkFaint,marginLeft:4 }}>/month</span>}
              </div>
              {p.features.map(f => (
                <div key={f} style={{ display:'flex',gap:10,marginBottom:8,alignItems:'flex-start' }}>
                  <span style={{ color:p.popular?T.sageMid:T.sage,fontSize:13,flexShrink:0 }}></span>
                  <span style={{ fontSize:13,color:p.popular?'rgba(255,255,255,0.82)':T.inkMid,lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
              <button onClick={() => navigate('/list-business')} style={{
                width:'100%', marginTop:24, padding:'13px', borderRadius:10, border:'none',
                background:p.popular?T.white:T.forest, color:p.popular?T.forest:T.white,
                fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:0.3,
              }}>{p.cta} </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:24,fontSize:13,color:T.inkSoft }}>
          All plans include new client discovery. Upgrade or cancel anytime -- no long-term commitment.
        </div>
      </section>

      {/*  FOOTER CTA  */}
      <section style={{ background:`linear-gradient(135deg,${T.forest},${T.moss})`,padding:'60px 24px',textAlign:'center' }}>
        <h2 style={{ fontFamily:F.display,fontSize:'clamp(24px,4vw,36px)',color:T.white,fontWeight:300,marginBottom:12 }}>Ready to bring more clients through your door?</h2>
        <p style={{ color:T.sageLight,fontSize:15,marginBottom:28,maxWidth:440,margin:'0 auto 28px',lineHeight:1.7 }}>
          Join UK beauty, wellness, fitness and specialist businesses already growing with Eden. Free to start, easy to set up.
        </p>
        <Button variant="gold" size="lg" onClick={() => navigate('/list-business')}>
          List Your Business Free 
        </Button>
      </section>

      {/*  FOOTER  */}
      <footer style={{ background:T.forestDark,padding:'40px 24px',color:'rgba(255,255,255,0.4)',fontSize:12,textAlign:'center',lineHeight:2 }}>
        <div style={{ fontFamily:F.display,fontSize:18,color:T.white,marginBottom:8 }}>Eden</div>
        <div> 2026 The Eden App LTD  Trading as The Eden App LTD  Registered in England & Wales</div>
        <div style={{ marginTop:4 }}>
          <a href="mailto:hello@theedenappltd.com" style={{ color:T.sageLight }}>hello@theedenappltd.com</a>
          {'  '}
          <a href="/privacy" style={{ color:'rgba(255,255,255,0.4)' }}>Privacy Policy</a>
          {'  '}
          <a href="/terms" style={{ color:'rgba(255,255,255,0.4)' }}>Terms of Service</a>
        </div>
      </footer>
    </div>
  )
}
