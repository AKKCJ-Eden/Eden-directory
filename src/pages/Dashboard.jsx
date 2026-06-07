import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Stars, Badge, Button, Spinner, Input, Select } from '../lib/design'

const PLANS = [
  {
    id:'free', name:'Starter', price:0,
    features:['Basic listing','Search visibility','Customer enquiries'],
    cta:'Upgrade to grow faster',
  },
  {
    id:'standard', name:'Growth', price:59,
    features:['Priority placement','Booking calendar','Analytics','Email confirmations'],
    cta:'Upgrade to Premium for maximum visibility',
  },
  {
    id:'premium', name:'Premium', price:119,
    features:['Featured placement','AI spotlight','Unlimited gallery','SMS notifications','Account manager'],
    cta:'You are on our best plan',
  },
]

const DEMO_BOOKINGS = [
  { id:1, client:'Emma Johnson',   service:'Full Balayage',     date:'Today',    time:'2:00pm',  status:'confirmed', amount:165 },
  { id:2, client:'Sarah Williams', service:'Cut & Blowdry',     date:'Today',    time:'4:30pm',  status:'confirmed', amount:75  },
  { id:3, client:'Lucy Brown',     service:'Colour Correction', date:'Tomorrow', time:'10:00am', status:'pending',   amount:200 },
  { id:4, client:'Jade Clarke',    service:'Full Highlights',   date:'Thu',      time:'1:00pm',  status:'confirmed', amount:135 },
  { id:5, client:'Mia Roberts',    service:'Keratin Treatment', date:'Fri',      time:'11:00am', status:'confirmed', amount:210 },
]

const REVENUE = [
  { m:'Jan', v:3840 }, { m:'Feb', v:4120 }, { m:'Mar', v:3780 },
  { m:'Apr', v:4540 }, { m:'May', v:5190 }, { m:'Jun', v:5820 },
]

export default function Dashboard({ user }) {
  const [tab,     setTab]     = useState('overview')
  const [profile, setProfile] = useState(null)
  const [salon,   setSalon]   = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate  = useNavigate()
  const maxR      = Math.max(...REVENUE.map(r => r.v))

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof)
    const { data: sal } = await supabase.from('salons').select('*').eq('owner_id', user.id).single()
    setSalon(sal)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const TABS = ['overview','bookings','analytics','notifications','payments','settings']

  if (loading) return (
    <div style={{ minHeight:'100vh', background:T.cream, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{GLOBAL_CSS}</style>
      <Spinner size={32}/>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Nav */}
      <nav style={{ background:T.forest, padding:'0 24px', height:62, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🌿</div>
          <span style={{ fontFamily:F.display, fontSize:22, color:T.white }}>Eden</span>
          <span style={{ fontSize:10, color:T.sageLight, letterSpacing:2, textTransform:'uppercase', marginLeft:4 }}>Business</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:13, color:T.sageLight }}>{profile?.full_name || user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut} style={{ color:T.white, borderColor:'rgba(255,255,255,0.2)' }}>Sign Out</Button>
        </div>
      </nav>

      <div style={{ display:'flex', minHeight:'calc(100vh - 62px)' }}>

        {/* Sidebar */}
        <div style={{ width:220, background:T.white, borderRight:`1px solid ${T.border}`, padding:'24px 0', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              width:'100%', padding:'12px 24px',
              background:tab===t?T.mint:'none',
              border:'none', borderLeft:`3px solid ${tab===t?T.forest:'transparent'}`,
              color:tab===t?T.forest:T.inkSoft,
              fontSize:13, fontWeight:tab===t?600:400, cursor:'pointer',
              textAlign:'left', textTransform:'capitalize', transition:'all 0.15s',
            }}>{t}</button>
          ))}

          <div style={{ margin:'24px 16px 0', padding:'14px 16px', background:T.mint, borderRadius:10, border:`1px solid ${T.sagePale}` }}>
            <div style={{ fontSize:10, color:T.moss, fontWeight:700, letterSpacing:1, marginBottom:4 }}>YOUR PLAN</div>
            <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:4 }}>
              {salon?.plan === 'premium' ? 'Premium' : salon?.plan === 'standard' ? 'Growth' : 'Starter'}
            </div>
            <button onClick={() => setTab('payments')} style={{ fontSize:10, color:T.sage, background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:600 }}>Manage plan →</button>
          </div>

          {!salon && (
            <div style={{ margin:'16px 16px 0', padding:'14px 16px', background:T.goldPale, borderRadius:10, border:`1px solid ${T.goldLight}` }}>
              <div style={{ fontSize:11, color:T.gold, fontWeight:600, marginBottom:6 }}>No listing yet</div>
              <button onClick={() => navigate('/list-business')} style={{ fontSize:11, color:T.forest, background:T.goldLight, border:'none', borderRadius:6, padding:'6px 12px', cursor:'pointer', fontWeight:700 }}>Create Your Listing →</button>
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ flex:1, overflowY:'auto', padding:'32px' }}>

          {/* Overview */}
          {tab === 'overview' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:28, color:T.forest, marginBottom:4 }}>
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 🌿
              </div>
              <div style={{ fontSize:14, color:T.inkSoft, marginBottom:28 }}>Here's how your business is performing on Eden.</div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
                {[
                  { icon:'💷', label:'Revenue This Month',  val:'£5,820', chg:'↑ 12% vs last month' },
                  { icon:'📅', label:'New Bookings',        val:'48',     chg:'↑ 8 new this month'  },
                  { icon:'⭐', label:'Your Rating',          val:'4.9',    chg:'Top rated in your area' },
                  { icon:'👁', label:'Profile Views',       val:'2,140',  chg:'↑ 340 this week'     },
                ].map(s => (
                  <div key={s.label} style={{ background:T.white, borderRadius:12, padding:'20px 18px', border:`1px solid ${T.border}`, boxShadow:`0 2px 8px ${T.shadow}` }}>
                    <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
                    <div style={{ fontFamily:F.display, fontSize:28, color:T.forest, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11, color:T.inkSoft, marginTop:4 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:T.success, marginTop:6, fontWeight:700 }}>{s.chg}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:T.white, borderRadius:14, padding:24, border:`1px solid ${T.border}`, marginBottom:24 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:20 }}>Your Revenue (6 months)</div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-end', height:140 }}>
                  {REVENUE.map(r => (
                    <div key={r.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                      <div style={{ fontSize:9, color:T.inkFaint }}>£{(r.v/1000).toFixed(1)}k</div>
                      <div style={{ width:'100%', background:`linear-gradient(to top,${T.forest},${T.sage})`, borderRadius:'4px 4px 0 0', height:`${(r.v/maxR)*100}px`, transition:'height 0.6s ease', minHeight:4 }}/>
                      <div style={{ fontSize:11, color:T.inkMid, fontWeight:600 }}>{r.m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:T.mint, borderRadius:12, padding:20, border:`1px solid ${T.sagePale}` }}>
                <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:12 }}>Quick Actions</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <Button variant="primary" size="sm" onClick={() => setTab('bookings')}>View Today's Bookings</Button>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/list-business')}>Edit My Listing</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('analytics')}>View Analytics</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('payments')}>Manage Plan</Button>
                </div>
              </div>
            </div>
          )}

          {/* Bookings */}
          {tab === 'bookings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <div style={{ fontFamily:F.display, fontSize:24, color:T.forest }}>Upcoming Appointments</div>
                <Badge variant="green">{DEMO_BOOKINGS.filter(b=>b.status==='confirmed').length} confirmed today</Badge>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {DEMO_BOOKINGS.map(b => (
                  <div key={b.id} style={{ display:'flex', alignItems:'center', gap:16, background:T.white, borderRadius:10, padding:'16px 20px', border:`1px solid ${T.border}`, boxShadow:`0 1px 6px ${T.shadow}` }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:T.mint, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontSize:20, color:T.forest, flexShrink:0 }}>{b.client[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, color:T.ink, fontSize:14 }}>{b.client}</div>
                      <div style={{ fontSize:12, color:T.inkSoft }}>{b.service}</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{b.date}</div>
                      <div style={{ fontSize:11, color:T.inkFaint }}>{b.time}</div>
                    </div>
                    <Badge variant={b.status==='confirmed'?'green':'gold'} small>{b.status}</Badge>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:700, color:T.forest, fontSize:15 }}>£{b.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:14, background:T.mint, borderRadius:10, border:`1px solid ${T.sagePale}`, fontSize:12, color:T.moss, lineHeight:1.8 }}>
                💷 Your earnings are paid out automatically every week directly to your bank account via Stripe.
              </div>
            </div>
          )}

          {/* Analytics */}
          {tab === 'analytics' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:24 }}>Your Performance</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div style={{ background:T.white, borderRadius:14, padding:22, border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:16 }}>Most Popular Treatments</div>
                  {[
                    { name:'Full Balayage',      pct:34, val:'48 bookings' },
                    { name:'Highlights',          pct:22, val:'31 bookings' },
                    { name:'Colour Correction',   pct:18, val:'25 bookings' },
                    { name:"Cut & Blowdry",       pct:16, val:'22 bookings' },
                    { name:'Keratin Treatment',   pct:10, val:'14 bookings' },
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
                    { src:'Eden Search',          pct:62, color:T.sage   },
                    { src:'Eden AI Concierge',    pct:18, color:T.forest },
                    { src:'Featured Placement',   pct:12, color:T.gold   },
                    { src:'Returning Clients',    pct:8,  color:'#c4788a'},
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
                  <div style={{ marginTop:16, padding:12, background:T.mint, borderRadius:8, fontSize:11, color:T.moss, border:`1px solid ${T.sagePale}` }}>
                    📈 Upgrade to Premium to get Featured Placement and reach even more clients.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:6 }}>Notification Settings</div>
              <div style={{ fontSize:13, color:T.inkSoft, marginBottom:24 }}>Choose how Eden keeps you and your clients informed.</div>
              {[
                { label:'Client booking confirmation',      sub:'Your client receives an email the moment they book', on:true,  icon:'📧' },
                { label:'Client reminder (24 hours)',        sub:'Reminder sent to your client the day before',       on:true,  icon:'📱' },
                { label:'Client reminder (2 hours)',         sub:'Final reminder sent 2 hours before their appointment', on:true, icon:'📱' },
                { label:'New booking alert to you',          sub:'You are notified the moment a client books',        on:true,  icon:'🔔' },
                { label:'SMS alert for new bookings',        sub:'Instant text message to your mobile',              on:false, icon:'📱' },
                { label:'Cancellation alerts',               sub:'Notified immediately if a client cancels',         on:true,  icon:'🔔' },
                { label:'Weekly performance summary',        sub:'Your bookings and revenue every Monday morning',   on:true,  icon:'📊' },
                { label:'New review notification',           sub:'When a happy client leaves you a review',          on:true,  icon:'⭐' },
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:T.white, borderRadius:10, padding:'14px 20px', marginBottom:8, border:`1px solid ${T.border}` }}>
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{s.label}</div>
                      <div style={{ fontSize:11, color:T.inkFaint, marginTop:1 }}>{s.sub}</div>
                    </div>
                  </div>
                  <div style={{ width:44, height:24, borderRadius:12, background:s.on?T.sage:T.border, position:'relative', cursor:'pointer', flexShrink:0, transition:'background 0.2s' }}>
                    <div style={{ position:'absolute', top:3, left:s.on?23:3, width:18, height:18, borderRadius:'50%', background:T.white, boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payments */}
          {tab === 'payments' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:24 }}>Payments & Earnings</div>

              <div style={{ background:'#f0f4ff', borderRadius:14, padding:24, marginBottom:24, border:'1px solid #d0d8f8' }}>
                <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ fontSize:36, flexShrink:0 }}>💳</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:'#2a3070', marginBottom:6 }}>Receive your earnings via Stripe</div>
                    <div style={{ fontSize:13, color:'#505898', lineHeight:1.8, marginBottom:14 }}>
                      Connect your Stripe account and your earnings will be transferred directly to your bank account every week. Quick to set up, automatic from then on.
                    </div>
                    <a href="https://stripe.com/connect" target="_blank" rel="noreferrer" style={{ display:'inline-block', padding:'10px 24px', background:'#635bff', border:'none', borderRadius:8, color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13, textDecoration:'none' }}>
                      Connect Bank Account →
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:16 }}>Your Plan</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
                {PLANS.map(p => (
                  <div key={p.id} style={{ borderRadius:12, padding:'18px 16px', border:`2px solid ${salon?.plan===p.id?T.sage:T.border}`, background:salon?.plan===p.id?T.mint:T.white, cursor:'pointer', transition:'all 0.2s' }}>
                    {salon?.plan===p.id && <div style={{ fontSize:9, fontWeight:700, color:T.moss, letterSpacing:1, marginBottom:6 }}>✓ YOUR CURRENT PLAN</div>}
                    <div style={{ fontFamily:F.display, fontSize:18, color:T.forest }}>{p.name}</div>
                    <div style={{ fontSize:22, fontWeight:700, color:T.sage, margin:'6px 0 10px' }}>{p.price===0?'Free':`£${p.price}/mo`}</div>
                    {p.features.map(f => (
                      <div key={f} style={{ fontSize:11, color:T.inkMid, marginBottom:4, display:'flex', gap:6 }}>
                        <span style={{ color:T.sage }}>✓</span>{f}
                      </div>
                    ))}
                    {salon?.plan !== p.id && (
                      <button style={{ marginTop:12, width:'100%', padding:'9px', background:T.forest, border:'none', borderRadius:8, color:T.white, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                        {p.price > (PLANS.find(x=>x.id===salon?.plan)?.price||0) ? 'Upgrade →' : 'Change Plan'}
                      </button>
                    )}
                  </div>
                ))}
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

          {/* Settings */}
          {tab === 'settings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display, fontSize:24, color:T.forest, marginBottom:24 }}>Account Settings</div>
              <div style={{ background:T.white, borderRadius:14, padding:28, border:`1px solid ${T.border}`, marginBottom:20 }}>
                <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:20 }}>Your Details</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
                  <Input label="Full Name"      defaultValue={profile?.full_name || ''} placeholder="Your full name"/>
                  <Input label="Email Address"  defaultValue={user?.email || ''} placeholder="you@example.com"/>
                  <Input label="Phone Number"   defaultValue={profile?.phone || ''} placeholder="+44 7700 000000"/>
                  <Input label="New Password"   type="password" placeholder="Leave blank to keep current"/>
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
    </div>
  )
}
