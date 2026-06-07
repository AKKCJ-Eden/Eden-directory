import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_CSS, T, F, Nav, Button, Badge, Stars } from '../lib/design'

const CATS = [
  { id:'all',        label:'All',            icon:'✦' },
  { id:'hair',       label:'Hair Salons',    icon:'✂' },
  { id:'barber',     label:'Barbers',        icon:'💈' },
  { id:'nails',      label:'Nail Studios',   icon:'💅' },
  { id:'aesthetics', label:'Aesthetics',     icon:'✨' },
  { id:'beauty',     label:'Beauty',         icon:'🌸' },
  { id:'spa',        label:'Spa & Wellness', icon:'🧖' },
  { id:'makeup',     label:'Makeup Artists', icon:'💄' },
]

const FEATURES = [
  { i:'🔍', t:'Postcode Search',       d:'Find every beauty venue within your chosen radius across the whole of the UK.' },
  { i:'📊', t:'Compare Prices',        d:'See services and prices side-by-side for up to 3 salons before you commit.' },
  { i:'📅', t:'Instant Booking',       d:'Book any treatment in under 60 seconds with email and SMS confirmation.' },
  { i:'🤖', t:'AI Beauty Concierge',   d:"Tell our AI what you want and it'll find the perfect treatment nearby." },
  { i:'⭐', t:'Verified Reviews',       d:'Every review is linked to a real booking — no fake stars, ever.' },
  { i:'💳', t:'Secure Stripe Payments',d:'Encrypted checkout. Salons receive automatic weekly payouts.' },
  { i:'🔔', t:'Smart Reminders',        d:'Email and SMS reminders 24hrs and 2hrs before your appointment.' },
  { i:'🌍', t:'UK-Wide Coverage',       d:'From London to Edinburgh, every town and city in one directory.' },
  { i:'📈', t:'Business Analytics',     d:'Salon owners get live revenue dashboards and booking trends.' },
]

const STATS = [
  { n:'£2.8B',  l:'UK beauty market',         s:'Growing 6.2% YoY' },
  { n:'98,000', l:'UK beauty businesses',      s:'88% have no online booking' },
  { n:'4.2M',   l:'Monthly beauty searches',  s:'Across UK postcodes' },
  { n:'£48',    l:'Average booking value',     s:'£4.80 Eden commission' },
]

const PLANS = [
  {
    id:'free', name:'Starter', price:0,
    tagline:'Get discovered',
    features:['Basic listing','Appear in search','Customer enquiries','Eden badge'],
    popular:false,
  },
  {
    id:'standard', name:'Growth', price:59,
    tagline:'Grow your business',
    features:['Everything in Starter','Pro verified badge','Priority placement','Booking calendar','Analytics dashboard','Email confirmations'],
    popular:false,
  },
  {
    id:'premium', name:'Premium', price:119,
    tagline:'Dominate your area',
    features:['Everything in Growth','Featured listing','AI spotlight','Unlimited gallery','SMS & email notifications','Dedicated account manager','Weekly payout reports'],
    popular:true,
  },
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
    <div style={{ minHeight: '100vh', background: T.cream, fontFamily: F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')} />

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(150deg, ${T.forestDark} 0%, ${T.forest} 55%, ${T.moss} 100%)`,
        padding: '90px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.05,pointerEvents:'none' }} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="200" cy="300" rx="400" ry="300" fill="#a8c8ae"/>
          <ellipse cx="1000" cy="150" rx="350" ry="280" fill="#7aaa82"/>
          <ellipse cx="600" cy="500" rx="300" ry="200" fill="#5a8a62"/>
        </svg>
        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp 0.7s ease both', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:30,padding:'6px 18px',marginBottom:28,backdropFilter:'blur(8px)' }}>
            <span style={{ width:7,height:7,borderRadius:'50%',background:T.goldLight,display:'inline-block',animation:'pulse 2s infinite' }}/>
            <span style={{ fontSize:11,color:'rgba(255,255,255,0.85)',letterSpacing:2,fontWeight:500 }}>NOW LIVE ACROSS THE UK</span>
          </div>
          <h1 style={{ fontFamily:F.display,fontSize:'clamp(36px,6vw,58px)',fontWeight:300,color:T.white,lineHeight:1.12,margin:'0 0 20px',letterSpacing:-0.5 }}>
            The UK's home for beauty,<br/><em style={{ color:T.goldLight }}>wellness & self-care.</em>
          </h1>
          <p style={{ fontSize:17,color:'rgba(255,255,255,0.65)',lineHeight:1.8,marginBottom:48,maxWidth:500,margin:'0 auto 48px' }}>
            Hair salons, barbers, nail studios, aesthetics clinics, spas and more — discovered, compared and booked in seconds.
          </p>

          {/* Search */}
          <div style={{ maxWidth:640,margin:'0 auto 12px',background:T.white,borderRadius:14,display:'flex',overflow:'hidden',boxShadow:'0 12px 50px rgba(0,0,0,0.22)',border:`2px solid ${T.sagePale}` }}>
            <div style={{ display:'flex',alignItems:'center',padding:'0 14px',flexShrink:0,borderRight:`1px solid ${T.border}`,gap:4 }}>
              <span style={{ fontSize:20,opacity:0.5 }}>📍</span>
              {pcValid === true  && <span style={{ color:T.success, fontSize:12 }}>✓</span>}
              {pcValid === false && <span style={{ color:T.error,   fontSize:12 }}>✗</span>}
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
                transition: 'all 0.2s',
              }}>{c.icon} {c.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'70px 24px',maxWidth:1100,margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:T.sage,textTransform:'uppercase',marginBottom:12,fontWeight:600 }}>Built different</div>
          <h2 style={{ fontFamily:F.display,fontSize:'clamp(28px,4vw,42px)',color:T.forest,fontWeight:300 }}>Why thousands choose Eden</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20 }}>
          {FEATURES.map((f,i) => (
            <div key={i} style={{ background:T.white,borderRadius:14,padding:'24px 22px',border:`1px solid ${T.border}`,boxShadow:`0 2px 12px ${T.shadow}`,animation:`fadeUp 0.5s ease ${i*0.04}s both` }}>
              <div style={{ width:52,height:52,background:T.mint,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,marginBottom:14 }}>{f.i}</div>
              <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:8 }}>{f.t}</div>
              <div style={{ fontSize:13,color:T.inkSoft,lineHeight:1.75 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARKET STATS ── */}
      <section style={{ background:`linear-gradient(135deg,${T.forestDark},${T.forest},${T.moss})`,padding:'72px 24px',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.04,pointerEvents:'none' }} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="600" cy="200" rx="700" ry="300" fill="#a8c8ae"/>
        </svg>
        <div style={{ position:'relative',zIndex:1,maxWidth:900,margin:'0 auto' }}>
          <div style={{ fontSize:10,letterSpacing:5,color:T.sageLight,textTransform:'uppercase',marginBottom:16,fontWeight:600 }}>Market opportunity</div>
          <h2 style={{ fontFamily:F.display,fontSize:'clamp(26px,4vw,40px)',fontWeight:300,color:T.white,marginBottom:14 }}>The UK beauty industry is ready to be disrupted.</h2>
          <p style={{ color:'rgba(255,255,255,0.6)',fontSize:15,lineHeight:1.8,marginBottom:48,maxWidth:560,margin:'0 auto 48px' }}>
            88% of UK beauty businesses still rely on phone bookings and paper diaries. Eden is the infrastructure layer the industry has been waiting for.
          </p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:20,marginBottom:48 }}>
            {STATS.map((s,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.07)',borderRadius:16,padding:'28px 20px',border:'1px solid rgba(255,255,255,0.10)',backdropFilter:'blur(8px)' }}>
                <div style={{ fontFamily:F.display,fontSize:38,fontWeight:300,color:T.goldLight,lineHeight:1,marginBottom:8 }}>{s.n}</div>
                <div style={{ fontSize:13,color:T.white,fontWeight:600,marginBottom:4 }}>{s.l}</div>
                <div style={{ fontSize:11,color:'rgba(255,255,255,0.45)' }}>{s.s}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16 }}>
            {[
              { icon:'💷', title:'Three Revenue Streams',       text:'10% commission per booking, monthly subscriptions (£59–£119/mo), and featured placement advertising.' },
              { icon:'📈', title:'Conservative Year 3 Target',  text:'10,000 businesses × avg £89/mo + £2.4M commission = £13.3M ARR.' },
              { icon:'🌍', title:'Expansion Roadmap',           text:'UK launch → Ireland → Australia → Canada. Global beauty market worth $532 billion.' },
            ].map(f => (
              <div key={f.title} style={{ background:'rgba(255,255,255,0.06)',borderRadius:14,padding:'22px 20px',border:'1px solid rgba(255,255,255,0.08)',textAlign:'left' }}>
                <div style={{ fontSize:28,marginBottom:12 }}>{f.icon}</div>
                <div style={{ fontSize:14,fontWeight:600,color:T.white,marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13,color:'rgba(255,255,255,0.55)',lineHeight:1.75 }}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section style={{ padding:'70px 24px',maxWidth:960,margin:'0 auto',textAlign:'center' }}>
        <div style={{ fontSize:10,letterSpacing:5,color:T.sage,textTransform:'uppercase',marginBottom:12,fontWeight:600 }}>Transparent pricing</div>
        <h2 style={{ fontFamily:F.display,fontSize:'clamp(26px,4vw,40px)',color:T.forest,fontWeight:300,marginBottom:8 }}>Simple plans for every business</h2>
        <p style={{ fontSize:15,color:T.inkSoft,marginBottom:44 }}>Plus 10% commission per booking — you only pay when you earn.</p>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20 }}>
          {PLANS.map(p => (
            <div key={p.id} style={{
              borderRadius:16,padding:'30px 24px',textAlign:'left',position:'relative',
              border:`2px solid ${p.popular ? T.forest : T.border}`,
              background: p.popular ? T.forest : T.white,
              boxShadow: p.popular ? `0 16px 60px ${T.shadowLg}` : `0 2px 12px ${T.shadow}`,
            }}>
              {p.popular && <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:T.gold,color:T.white,fontSize:10,fontWeight:700,letterSpacing:1,padding:'4px 16px',borderRadius:20,whiteSpace:'nowrap' }}>★ MOST POPULAR</div>}
              <div style={{ fontFamily:F.display,fontSize:22,color:p.popular?T.white:T.forest,marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:12,color:p.popular?T.sageLight:T.inkSoft,marginBottom:16 }}>{p.tagline}</div>
              <div style={{ marginBottom:20 }}>
                <span style={{ fontFamily:F.display,fontSize:40,color:p.popular?T.goldLight:T.sage,fontWeight:300 }}>{p.price===0?'Free':`£${p.price}`}</span>
                {p.price>0 && <span style={{ fontSize:13,color:p.popular?T.sageLight:T.inkFaint,marginLeft:4 }}>/month</span>}
              </div>
              {p.features.map(f => (
                <div key={f} style={{ display:'flex',gap:10,marginBottom:8,alignItems:'flex-start' }}>
                  <span style={{ color:p.popular?T.sageMid:T.sage,fontSize:13,flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13,color:p.popular?'rgba(255,255,255,0.82)':T.inkMid,lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
              <button onClick={() => navigate('/list-business')} style={{
                width:'100%',marginTop:24,padding:'13px',borderRadius:10,border:'none',
                background:p.popular?T.white:T.forest,color:p.popular?T.forest:T.white,
                fontWeight:700,fontSize:13,cursor:'pointer',letterSpacing:0.3,
              }}>Get Started →</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background:`linear-gradient(135deg,${T.forest},${T.moss})`,padding:'60px 24px',textAlign:'center' }}>
        <h2 style={{ fontFamily:F.display,fontSize:'clamp(24px,4vw,36px)',color:T.white,fontWeight:300,marginBottom:12 }}>Ready to grow your beauty business?</h2>
        <p style={{ color:T.sageLight,fontSize:15,marginBottom:28,maxWidth:440,margin:'0 auto 28px',lineHeight:1.7 }}>Join thousands of UK salons on Eden. Free to start, instant setup.</p>
        <Button variant="gold" size="lg" onClick={() => navigate('/list-business')}>List Your Business — It's Free</Button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:T.forestDark,padding:'40px 24px',color:'rgba(255,255,255,0.4)',fontSize:12,textAlign:'center',lineHeight:2 }}>
        <div style={{ fontFamily:F.display,fontSize:18,color:T.white,marginBottom:8 }}>Eden</div>
        <div>© 2026 AKKCJ LTD · Trading as Eden Technologies · Companies House, England & Wales</div>
        <div style={{ marginTop:4 }}>
          <a href="mailto:hello@edendirectory.com" style={{ color:T.sageLight }}>hello@edendirectory.com</a>
          {' · '}
          <a href="/privacy" style={{ color:'rgba(255,255,255,0.4)' }}>Privacy Policy</a>
          {' · '}
          <a href="/terms" style={{ color:'rgba(255,255,255,0.4)' }}>Terms of Service</a>
        </div>
      </footer>
    </div>
  )
}
