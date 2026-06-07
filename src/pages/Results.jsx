import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getSalons } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Stars, Badge, Button, Spinner } from '../lib/design'

const CATS = [
  { id:'all',        label:'All',        icon:'✦' },
  { id:'hair',       label:'Hair',       icon:'✂' },
  { id:'barber',     label:'Barbers',    icon:'💈' },
  { id:'nails',      label:'Nails',      icon:'💅' },
  { id:'aesthetics', label:'Aesthetics', icon:'✨' },
  { id:'beauty',     label:'Beauty',     icon:'🌸' },
  { id:'spa',        label:'Spa',        icon:'🧖' },
  { id:'makeup',     label:'Makeup',     icon:'💄' },
]

const DEMO = [
  { id:'1', name:'Verdant Hair Atelier',      category:'hair',        area:'Westminster, London',    postcode:'SW1A 1AA', rating:4.9, review_count:487, promoted:true,  plan:'premium',  verified:true,  tags:['Balayage','Colour','Extensions'],  images:['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'], services:[{name:"Women's Cut",price:75,duration:60},{name:'Balayage',price:165,duration:180,popular:true}] },
  { id:'2', name:'The Craft Barber Co.',       category:'barber',      area:'Clerkenwell, London',   postcode:'EC1A 1BB', rating:4.9, review_count:621, promoted:true,  plan:'premium',  verified:true,  tags:['Skin Fades','Hot Towel','Classic'], images:['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80'], services:[{name:'Classic Cut',price:28,duration:30},{name:'Skin Fade',price:34,duration:35,popular:true}] },
  { id:'3', name:'Petal Nail Atelier',         category:'nails',       area:'Fitzrovia, London',     postcode:'W1T 1AA',  rating:4.8, review_count:334, promoted:false, plan:'standard', verified:true,  tags:['Gel','Chrome','Nail Art'],          images:['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80'], services:[{name:'Gel Manicure',price:44,duration:55,popular:true},{name:'Nail Art',price:85,duration:90}] },
  { id:'4', name:'Clarity Aesthetics Clinic',  category:'aesthetics',  area:'Islington, London',     postcode:'N1 9AA',   rating:4.8, review_count:256, promoted:true,  plan:'premium',  verified:true,  tags:['Botox','Fillers','Profhilo'],       images:['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'], services:[{name:'Consultation',price:0,duration:20},{name:'Anti-Wrinkle',price:295,duration:45,popular:true}] },
  { id:'5', name:'Bloom Beauty Bar',           category:'beauty',      area:'Borough, London',       postcode:'SE1 7PB',  rating:4.6, review_count:198, promoted:false, plan:'standard', verified:true,  tags:['Facials','Waxing','Lashes'],        images:['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80'], services:[{name:'Dermalogica Facial',price:65,duration:60,popular:true},{name:'Lash Lift',price:72,duration:65}] },
  { id:'6', name:'The Sanctuary London',       category:'spa',         area:'Covent Garden, London', postcode:'WC2E 8RF', rating:4.9, review_count:892, promoted:true,  plan:'premium',  verified:true,  tags:['Hot Stone','Couples','Packages'],   images:['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80'], services:[{name:'Hot Stone Massage',price:125,duration:75,popular:true},{name:'Couples Spa',price:310,duration:150}] },
]

function SalonCard({ salon, selected, onSelect, isFav, onFav, inCompare, onCompare }) {
  const minPrice = salon.services ? Math.min(...salon.services.map(s => s.price === 0 ? 9999 : s.price)) : 0
  const img = salon.images?.[0] || salon.img
  return (
    <div onClick={() => onSelect(salon)} style={{
      background:T.white, borderRadius:12, overflow:'hidden', cursor:'pointer',
      border:`1.5px solid ${selected ? T.sage : salon.promoted ? T.sagePale : T.border}`,
      boxShadow: selected ? `0 4px 24px ${T.shadowMd}` : `0 1px 6px ${T.shadow}`,
      transition:'all 0.2s', marginBottom:10,
    }}>
      {salon.promoted && (
        <div style={{ background:`linear-gradient(90deg,${T.forest},${T.moss})`,padding:'3px 12px',fontSize:9,fontWeight:700,letterSpacing:2,color:T.white }}>
          ★ Featured Listing
        </div>
      )}
      <div style={{ display:'flex' }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <img src={img} alt={salon.name} style={{ width:96,height:96,objectFit:'cover' }}/>
          {salon.verified && (
            <div style={{ position:'absolute',bottom:4,left:4,background:T.sage,borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ color:T.white,fontSize:10,fontWeight:700 }}>✓</span>
            </div>
          )}
        </div>
        <div style={{ padding:'10px 12px', flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div style={{ fontFamily:F.display,fontSize:14,color:T.forest,lineHeight:1.3,flex:1,paddingRight:8 }}>{salon.name}</div>
            <button onClick={e=>{e.stopPropagation();onFav();}} style={{ background:'none',border:'none',cursor:'pointer',fontSize:16,color:isFav?'#c4788a':T.border,padding:0,lineHeight:1,flexShrink:0 }}>♥</button>
          </div>
          <div style={{ fontSize:11,color:T.inkSoft,marginBottom:4,marginTop:2 }}>{salon.area || salon.city}</div>
          <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:6 }}>
            <Stars r={Math.round(salon.rating)} size={11}/>
            <span style={{ fontSize:12,fontWeight:700,color:T.gold }}>{salon.rating}</span>
            <span style={{ fontSize:10,color:T.inkFaint }}>({salon.review_count || 0})</span>
          </div>
          <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
            {salon.plan==='premium' && <Badge variant="gold" small>Premium</Badge>}
            {salon.verified && <Badge variant="green" small>Verified</Badge>}
            {(salon.tags||[]).slice(0,2).map(t => <Badge key={t} variant="grey" small>{t}</Badge>)}
          </div>
        </div>
      </div>
      <div style={{ padding:'8px 12px',borderTop:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:T.offwhite }}>
        <span style={{ fontSize:12,color:T.inkSoft }}>From <strong style={{ color:T.forest,fontSize:14 }}>£{minPrice === 9999 ? 0 : minPrice}</strong></span>
        <div style={{ display:'flex',gap:6 }}>
          <button onClick={e=>{e.stopPropagation();onCompare();}} style={{
            padding:'4px 10px',fontSize:9,fontWeight:700,letterSpacing:0.5,borderRadius:5,cursor:'pointer',
            background:inCompare?T.sagePale:'transparent',border:`1px solid ${T.border}`,
            color:inCompare?T.moss:T.inkSoft,
          }}>⇄ Compare</button>
          <button onClick={e=>{e.stopPropagation();window.location.href=`/salon/${salon.id}`;}} style={{
            padding:'4px 14px',background:T.forest,border:'none',borderRadius:5,
            color:T.white,fontSize:10,fontWeight:700,cursor:'pointer',
          }}>Book</button>
        </div>
      </div>
    </div>
  )
}

export default function Results({ user }) {
  const [params]    = useSearchParams()
  const [salons,    setSalons]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [selected,  setSelected]  = useState(null)
  const [category,  setCategory]  = useState(params.get('category') || 'all')
  const [sort,      setSort]      = useState('rating')
  const [favs,      setFavs]      = useState([])
  const [compare,   setCompare]   = useState([])
  const [aiQ,       setAiQ]       = useState('')
  const [aiA,       setAiA]       = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const navigate  = useNavigate()
  const postcode  = params.get('postcode') || ''
  const radius    = params.get('radius') || 100

  useEffect(() => { loadSalons() }, [category])

  const loadSalons = async () => {
    setLoading(true)
    const { data, error } = await getSalons({ category: category === 'all' ? null : category })
    if (error || !data || data.length === 0) {
      setSalons(DEMO.filter(s => category === 'all' || s.category === category))
    } else {
      setSalons(data)
    }
    setLoading(false)
  }

  const sorted = [...salons].sort((a,b) => {
    if (a.promoted && !b.promoted) return -1
    if (!a.promoted && b.promoted) return 1
    if (sort === 'rating')  return b.rating - a.rating
    if (sort === 'reviews') return (b.review_count||0) - (a.review_count||0)
    const ap = a.services ? Math.min(...a.services.map(s=>s.price)) : 0
    const bp = b.services ? Math.min(...b.services.map(s=>s.price)) : 0
    return ap - bp
  })

  const askAI = async () => {
    if (!aiQ.trim()) return
    setAiLoading(true); setAiA('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:500,
          system:`You are Eden's friendly AI beauty concierge helping customers near ${postcode} find the perfect salon. Be warm, personal and specific — mention salon names, treatments and prices. Available venues: ${JSON.stringify(salons.slice(0,6).map(s=>({name:s.name,cat:s.category,rating:s.rating,tags:s.tags,services:(s.services||[]).slice(0,4).map(sv=>({n:sv.name,p:sv.price}))})))}. Reply in 2–3 sentences. End with one clear recommendation.`,
          messages:[{ role:'user', content:aiQ }],
        }),
      })
      const d = await res.json()
      setAiA(d.content?.map(c=>c.text||'').join('') || "I couldn't find a perfect match — try rephrasing your request.")
    } catch { setAiA('Something went wrong — please try again.') }
    setAiLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')}/>

      <div style={{ display:'flex', height:'calc(100vh - 62px)' }}>
        {/* Left panel */}
        <div style={{ width:selected?400:'100%', maxWidth:selected?400:'none', overflowY:'auto', borderRight:`1px solid ${T.border}`, background:T.cream, flexShrink:0, transition:'width 0.3s ease' }}>

          {/* Filter bar */}
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.border}`, background:T.white, position:'sticky', top:0, zIndex:10 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:T.sage, cursor:'pointer', fontSize:13, fontWeight:500 }}>← New Search</button>
              <span style={{ color:T.border }}>|</span>
              <span style={{ fontSize:12, color:T.inkSoft }}>📍 <strong>{postcode}</strong> · {radius} miles · <strong>{sorted.length}</strong> results</span>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{ marginLeft:'auto', padding:'5px 10px', background:T.offwhite, border:`1px solid ${T.border}`, borderRadius:6, fontSize:11, color:T.inkMid }}>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
            <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:2 }}>
              {CATS.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)} style={{
                  padding:'5px 14px', borderRadius:30, fontSize:11, fontWeight:600, cursor:'pointer', border:'none', whiteSpace:'nowrap',
                  background: category===c.id ? T.forest : T.offwhite,
                  color: category===c.id ? T.white : T.inkMid,
                  transition:'all 0.18s', flexShrink:0,
                }}>{c.icon} {c.label}</button>
              ))}
            </div>
          </div>

          {/* AI Concierge */}
          <div style={{ padding:'12px 14px', background:T.mint, borderBottom:`1px solid ${T.sagePale}` }}>
            <div style={{ fontSize:9, letterSpacing:3, color:T.moss, fontWeight:700, marginBottom:7 }}>✦ YOUR PERSONAL BEAUTY ADVISOR</div>
            <div style={{ display:'flex', gap:8 }}>
              <input value={aiQ} onChange={e=>setAiQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askAI()}
                placeholder="e.g. 'I want a balayage' or 'best massage for stress relief'…"
                style={{ flex:1, padding:'9px 12px', background:T.white, border:`1px solid ${T.sageLight}`, borderRadius:8, color:T.ink, fontSize:12, outline:'none' }}/>
              <button onClick={askAI} disabled={aiLoading} style={{ padding:'9px 16px', background:T.forest, border:'none', borderRadius:8, color:T.white, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                {aiLoading ? <Spinner size={12} color={T.white}/> : 'Ask'}
              </button>
            </div>
            {aiA && <div style={{ marginTop:10, padding:'10px 14px', background:T.white, borderRadius:8, borderLeft:`3px solid ${T.sage}`, fontSize:12, color:T.inkMid, lineHeight:1.7, animation:'fadeUp 0.3s ease' }}>{aiA}</div>}
          </div>

          {/* Cards */}
          <div style={{ padding:'12px' }}>
            {loading ? (
              <div style={{ textAlign:'center', padding:'40px 0', color:T.inkSoft }}>
                <Spinner size={28}/>
                <div style={{ marginTop:12, fontSize:13 }}>Finding the best salons near you…</div>
              </div>
            ) : sorted.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 0', color:T.inkSoft }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🌿</div>
                <div style={{ fontSize:14 }}>No salons found in this area yet.</div>
                <div style={{ fontSize:12, marginTop:8 }}>Be the first to <a href="/list-business" style={{ color:T.sage }}>list your business!</a></div>
              </div>
            ) : sorted.map(s => (
              <SalonCard key={s.id} salon={s} selected={selected?.id===s.id}
                onSelect={setSelected}
                isFav={favs.includes(s.id)} onFav={() => setFavs(f=>f.includes(s.id)?f.filter(x=>x!==s.id):[...f,s.id])}
                inCompare={!!compare.find(x=>x.id===s.id)} onCompare={() => setCompare(p=>p.find(x=>x.id===s.id)?p.filter(x=>x.id!==s.id):p.length>=3?[...p.slice(1),s]:[...p,s])}/>
            ))}
          </div>
        </div>

        {/* Right detail panel */}
        {selected && (
          <div style={{ flex:1, overflowY:'auto', background:T.white, animation:'slideUp 0.25s ease' }}>
            <div style={{ position:'relative' }}>
              <img src={selected.images?.[0]||selected.img} alt={selected.name} style={{ width:'100%', height:240, objectFit:'cover' }}/>
              <div style={{ position:'absolute', inset:0, background:`linear-gradient(180deg,transparent 35%,${T.white})` }}/>
              <button onClick={() => setSelected(null)} style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.92)', border:'none', borderRadius:'50%', width:38, height:38, cursor:'pointer', fontSize:16 }}>✕</button>
            </div>
            <div style={{ padding:'16px 28px 40px' }}>
              <h2 style={{ fontFamily:F.display, fontSize:28, color:T.forest, fontWeight:400, marginBottom:4 }}>{selected.name}</h2>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:8 }}>📍 {selected.area || selected.city} · {selected.postcode}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Stars r={Math.round(selected.rating)} size={15}/>
                <span style={{ fontSize:16, fontWeight:700, color:T.gold }}>{selected.rating}</span>
                <span style={{ fontSize:13, color:T.inkSoft }}>{selected.review_count || 0} reviews</span>
              </div>
              {selected.bio && <p style={{ fontSize:14, color:T.inkMid, lineHeight:1.8, marginBottom:20 }}>{selected.bio}</p>}
              <a href={`/salon/${selected.id}`} style={{ display:'block', width:'100%', padding:'15px', background:T.forest, border:'none', borderRadius:12, color:T.white, fontWeight:700, fontSize:15, cursor:'pointer', textAlign:'center', boxShadow:`0 4px 20px ${T.shadowMd}`, textDecoration:'none', marginBottom:16 }}>
                View Full Profile & Book →
              </a>
              {selected.services && (
                <div>
                  <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:12 }}>Services</div>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <tbody>
                      {selected.services.map((s,i) => (
                        <tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
                          <td style={{ padding:'10px 0', fontSize:13, color:T.ink }}>{s.name}</td>
                          <td style={{ textAlign:'right', fontSize:14, fontWeight:700, color:T.gold }}>{s.price===0?'Free':`£${s.price}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop:14, padding:'12px 16px', background:T.mint, borderRadius:8, fontSize:11, color:T.moss, border:`1px solid ${T.sagePale}` }}>
                    ✓ Instant booking confirmation · ✓ Free cancellation up to 24 hours before
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!selected && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.offwhite }}>
            <div style={{ textAlign:'center', maxWidth:300 }}>
              <div style={{ fontSize:48, marginBottom:16, opacity:0.25 }}>🌿</div>
              <div style={{ fontFamily:F.display, fontSize:22, color:T.inkSoft, marginBottom:8 }}>Select a listing</div>
              <div style={{ fontSize:13, color:T.inkFaint, lineHeight:1.7 }}>Choose any salon to see full details, services, prices and booking options.</div>
            </div>
          </div>
        )}
      </div>

      {/* Compare bar */}
      {compare.length > 0 && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:300, background:T.forest, borderTop:`2px solid ${T.sage}`, padding:'14px 24px', animation:'fadeUp 0.3s ease' }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', maxWidth:1200, margin:'0 auto' }}>
            <div style={{ fontSize:9, letterSpacing:3, color:T.sageLight, fontWeight:700, flexShrink:0 }}>COMPARING</div>
            <div style={{ display:'flex', gap:10, flex:1, overflowX:'auto' }}>
              {compare.map(s => (
                <div key={s.id} style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 14px', minWidth:160, border:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.white }}>{s.name}</div>
                  <div style={{ fontSize:11, color:T.goldLight }}>From £{s.services?Math.min(...s.services.map(sv=>sv.price===0?9999:sv.price)):0}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setCompare([])} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.7)', padding:'6px 14px', cursor:'pointer', fontSize:12, flexShrink:0 }}>Clear ✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
