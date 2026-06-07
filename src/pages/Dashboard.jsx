import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Nav, Stars, Badge, Button, Spinner, Input, Select } from '../lib/design'

const PLANS = [
  { id:'free',     name:'Starter',  price:0,   features:['Basic listing','Search visibility','Enquiry form'] },
  { id:'standard', name:'Growth',   price:59,  features:['Pro badge','Priority placement','Booking calendar','Analytics','Email confirmations'] },
  { id:'premium',  name:'Premium',  price:119, features:['Featured listing','AI spotlight','Unlimited gallery','SMS notifications','Account manager','Weekly payouts'] },
]

const DEMO_BOOKINGS = [
  { id:1, client:'Emma Johnson',   service:'Full Balayage',      date:'Today',    time:'2:00pm',  status:'confirmed', amount:165 },
  { id:2, client:'Sarah Williams', service:'Cut & Blowdry',      date:'Today',    time:'4:30pm',  status:'confirmed', amount:75  },
  { id:3, client:'Lucy Brown',     service:'Colour Correction',  date:'Tomorrow', time:'10:00am', status:'pending',   amount:200 },
  { id:4, client:'Jade Clarke',    service:'Full Highlights',    date:'Thu',      time:'1:00pm',  status:'confirmed', amount:135 },
  { id:5, client:'Mia Roberts',    service:'Keratin Treatment',  date:'Fri',      time:'11:00am', status:'confirmed', amount:210 },
]

const REVENUE = [
  { m:'Jan', v:3840 }, { m:'Feb', v:4120 }, { m:'Mar', v:3780 },
  { m:'Apr', v:4540 }, { m:'May', v:5190 }, { m:'Jun', v:5820 },
]

export default function Dashboard({ user }) {
  const [tab,      setTab]      = useState('overview')
  const [profile,  setProfile]  = useState(null)
  const [salon,    setSalon]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const navigate   = useNavigate()
  const maxR       = Math.max(...REVENUE.map(r => r.v))

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
    <div style={{ minHeight:'100vh',background:T.cream,display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{GLOBAL_CSS}</style>
      <Spinner size={32}/>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:T.cream,fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>

      {/* Dashboard Nav */}
      <nav style={{ background:T.forest,padding:'0 24px',height:62,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:34,height:34,borderRadius:10,background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🌿</div>
          <span style={{ fontFamily:F.display,fontSize:22,color:T.white }}>Eden</span>
          <span style={{ fontSize:10,color:T.sageLight,letterSpacing:2,textTransform:'uppercase',marginLeft:4 }}>Business</span>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
          <span style={{ fontSize:13,color:T.sageLight }}>{profile?.full_name || user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut} style={{ color:T.white,borderColor:'rgba(255,255,255,0.2)' }}>Sign Out</Button>
        </div>
      </nav>

      <div style={{ display:'flex',minHeight:'calc(100vh - 62px)' }}>

        {/* Sidebar */}
        <div style={{ width:220,background:T.white,borderRight:`1px solid ${T.border}`,padding:'24px 0',flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              width:'100%',padding:'12px 24px',background:tab===t?T.mint:'none',
              border:'none',borderLeft:`3px solid ${tab===t?T.forest:'transparent'}`,
              color:tab===t?T.forest:T.inkSoft,
              fontSize:13,fontWeight:tab===t?600:400,cursor:'pointer',
              textAlign:'left',textTransform:'capitalize',transition:'all 0.15s',
            }}>{t}</button>
          ))}
          <div style={{ margin:'24px 16px 0',padding:'14px 16px',background:T.mint,borderRadius:10,border:`1px solid ${T.sagePale}` }}>
            <div style={{ fontSize:10,color:T.moss,fontWeight:700,letterSpacing:1,marginBottom:6 }}>YOUR PLAN</div>
            <div style={{ fontFamily:F.display,fontSize:18,color:T.forest }}>{salon?.plan === 'premium' ? 'Premium' : salon?.plan === 'standard' ? 'Growth' : 'Starter'}</div>
            <button onClick={() => setTab('payments')} style={{ fontSize:10,color:T.sage,background:'none',border:'none',cursor:'pointer',padding:'4px 0',fontWeight:600 }}>Manage →</button>
          </div>
          {!salon && (
            <div style={{ margin:'16px 16px 0',padding:'14px 16px',background:T.goldPale,borderRadius:10,border:`1px solid ${T.goldLight}` }}>
              <div style={{ fontSize:11,color:T.gold,fontWeight:600,marginBottom:6 }}>No listing yet</div>
              <button onClick={() => navigate('/list-business')} style={{ fontSize:11,color:T.forest,background:T.goldLight,border:'none',borderRadius:6,padding:'6px 12px',cursor:'pointer',fontWeight:700 }}>Create Listing →</button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex:1,overflowY:'auto',padding:'32px' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display,fontSize:28,color:T.forest,marginBottom:4 }}>Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 🌿</div>
              <div style={{ fontSize:14,color:T.inkSoft,marginBottom:28 }}>Here's how your business is performing.</div>

              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:32 }}>
                {[
                  { icon:'💷', label:'Revenue This Month', val:'£5,820', chg:'+12.1%' },
                  { icon:'📅', label:'Bookings This Month', val:'48',     chg:'+8 vs last month' },
                  { icon:'⭐', label:'Average Rating',      val:'4.9',    chg:'↑ 0.1 this month' },
                  { icon:'👁', label:'Profile Views',       val:'2,140',  chg:'+340 this week' },
                ].map(s => (
                  <div key={s.label} style={{ background:T.white,borderRadius:12,padding:'20px 18px',border:`1px solid ${T.border}`,boxShadow:`0 2px 8px ${T.shadow}` }}>
                    <div style={{ fontSize:26,marginBottom:10 }}>{s.icon}</div>
                    <div style={{ fontFamily:F.display,fontSize:28,color:T.forest,lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11,color:T.inkSoft,marginTop:4 }}>{s.label}</div>
                    <div style={{ fontSize:10,color:T.success,marginTop:6,fontWeight:700 }}>{s.chg}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:T.white,borderRadius:14,padding:24,border:`1px solid ${T.border}`,marginBottom:24 }}>
                <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:20 }}>Revenue (6 months)</div>
                <div style={{ display:'flex',gap:10,alignItems:'flex-end',height:140 }}>
                  {REVENUE.map(r => (
                    <div key={r.m} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
                      <div style={{ fontSize:9,color:T.inkFaint }}>£{(r.v/1000).toFixed(1)}k</div>
                      <div style={{ width:'100%',background:`linear-gradient(to top,${T.forest},${T.sage})`,borderRadius:'4px 4px 0 0',height:`${(r.v/maxR)*100}px`,transition:'height 0.6s ease',minHeight:4 }}/>
                      <div style={{ fontSize:11,color:T.inkMid,fontWeight:600 }}>{r.m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:T.mint,borderRadius:12,padding:20,border:`1px solid ${T.sagePale}` }}>
                <div style={{ fontFamily:F.display,fontSize:16,color:T.forest,marginBottom:10 }}>Quick Actions</div>
                <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                  <Button variant="primary" size="sm" onClick={() => setTab('bookings')}>View Bookings</Button>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/list-business')}>Edit Listing</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('analytics')}>View Analytics</Button>
                  <Button variant="secondary" size="sm" onClick={() => setTab('payments')}>Payout History</Button>
                </div>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab === 'bookings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
                <div style={{ fontFamily:F.display,fontSize:24,color:T.forest }}>Upcoming Appointments</div>
                <div style={{ fontSize:12,color:T.inkSoft }}>Commission: 10% per booking</div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                {DEMO_BOOKINGS.map(b => (
                  <div key={b.id} style={{ display:'flex',alignItems:'center',gap:16,background:T.white,borderRadius:10,padding:'16px 20px',border:`1px solid ${T.border}`,boxShadow:`0 1px 6px ${T.shadow}` }}>
                    <div style={{ width:44,height:44,borderRadius:'50%',background:T.mint,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:20,color:T.forest,flexShrink:0 }}>{b.client[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600,color:T.ink,fontSize:14 }}>{b.client}</div>
                      <div style={{ fontSize:12,color:T.inkSoft }}>{b.service}</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{b.date}</div>
                      <div style={{ fontSize:11,color:T.inkFaint }}>{b.time}</div>
                    </div>
                    <Badge variant={b.status==='confirmed'?'green':'gold'} small>{b.status}</Badge>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:700,color:T.forest,fontSize:15 }}>£{b.amount}</div>
                      <div style={{ fontSize:10,color:T.error }}>−£{(b.amount*0.1).toFixed(2)} fee</div>
                      <div style={{ fontSize:11,color:T.success,fontWeight:600 }}>£{(b.amount*0.9).toFixed(2)} net</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16,padding:14,background:T.mint,borderRadius:10,border:`1px solid ${T.sagePale}`,fontSize:12,color:T.moss,lineHeight:1.8 }}>
                💷 <strong>This week's net earnings:</strong> £693.00 after Eden's 10% commission.<br/>
                Payouts are processed every Monday and arrive within 2–3 business days via Stripe.
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display,fontSize:24,color:T.forest,marginBottom:24 }}>Analytics & Insights</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
                <div style={{ background:T.white,borderRadius:14,padding:22,border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:F.display,fontSize:16,color:T.forest,marginBottom:16 }}>Top Services by Revenue</div>
                  {[
                    { name:'Full Balayage',       pct:34, rev:'£1,980' },
                    { name:'Highlights',           pct:22, rev:'£1,280' },
                    { name:'Colour Correction',    pct:18, rev:'£1,047' },
                    { name:"Cut & Blowdry",        pct:16, rev:'£930'   },
                    { name:'Keratin Treatment',    pct:10, rev:'£581'   },
                  ].map(s => (
                    <div key={s.name} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4 }}>
                        <span style={{ color:T.ink }}>{s.name}</span>
                        <span style={{ color:T.sage,fontWeight:600 }}>{s.rev}</span>
                      </div>
                      <div style={{ height:6,background:T.border,borderRadius:3 }}>
                        <div style={{ width:`${s.pct}%`,height:'100%',background:`linear-gradient(to right,${T.sage},${T.forest})`,borderRadius:3 }}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:T.white,borderRadius:14,padding:22,border:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:F.display,fontSize:16,color:T.forest,marginBottom:16 }}>Booking Sources</div>
                  {[
                    { src:'Eden Direct',          pct:62, color:T.sage    },
                    { src:'Eden AI Concierge',    pct:18, color:T.forest  },
                    { src:'Featured Placement',   pct:12, color:T.gold    },
                    { src:'Repeat Customers',     pct:8,  color:'#c4788a' },
                  ].map(s => (
                    <div key={s.src} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:12 }}>
                      <div style={{ width:10,height:10,borderRadius:'50%',background:s.color,flexShrink:0 }}/>
                      <div style={{ flex:1,fontSize:12,color:T.ink }}>{s.src}</div>
                      <div style={{ width:80,height:6,background:T.border,borderRadius:3 }}>
                        <div style={{ width:`${s.pct}%`,height:'100%',background:s.color,borderRadius:3 }}/>
                      </div>
                      <div style={{ fontSize:12,fontWeight:600,color:T.inkMid,width:30,textAlign:'right' }}>{s.pct}%</div>
                    </div>
                  ))}
                  <div style={{ marginTop:16,padding:12,background:T.mint,borderRadius:8,fontSize:11,color:T.moss,border:`1px solid ${T.sagePale}` }}>
                    📈 Upgrade to Premium for even more visibility and Featured placement.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display,fontSize:24,color:T.forest,marginBottom:6 }}>Notification Settings</div>
              <div style={{ fontSize:13,color:T.inkSoft,marginBottom:24 }}>Control when Eden notifies you and your customers.</div>
              {[
                { label:'Customer email confirmation',     sub:'Sent instantly on booking',            on:true,  icon:'📧' },
                { label:'Customer SMS reminder (24 hrs)',  sub:'24 hours before appointment',          on:true,  icon:'📱' },
                { label:'Customer SMS reminder (2 hrs)',   sub:'2 hours before appointment',           on:true,  icon:'📱' },
                { label:'Business email on new booking',   sub:'Instant to your business email',       on:true,  icon:'📧' },
                { label:'Business SMS on new booking',     sub:'Instant SMS to your mobile',           on:false, icon:'📱' },
                { label:'Cancellation alerts',             sub:'When a client cancels',                on:true,  icon:'🔔' },
                { label:'Weekly revenue summary',          sub:'Every Monday at 8am',                  on:true,  icon:'📊' },
                { label:'New review notification',         sub:'When a customer leaves a review',      on:true,  icon:'⭐' },
              ].map((s,i) => (
                <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',background:T.white,borderRadius:10,padding:'14px 20px',marginBottom:8,border:`1px solid ${T.border}` }}>
                  <div style={{ display:'flex',gap:14,alignItems:'center' }}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{s.label}</div>
                      <div style={{ fontSize:11,color:T.inkFaint,marginTop:1 }}>{s.sub}</div>
                    </div>
                  </div>
                  <div style={{ width:44,height:24,borderRadius:12,background:s.on?T.sage:T.border,position:'relative',cursor:'pointer',flexShrink:0,transition:'background 0.2s' }}>
                    <div style={{ position:'absolute',top:3,left:s.on?23:3,width:18,height:18,borderRadius:'50%',background:T.white,boxShadow:'0 1px 4px rgba(0,0,0,0.2)',transition:'left 0.2s' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {tab === 'payments' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display,fontSize:24,color:T.forest,marginBottom:24 }}>Payments & Payouts</div>

              {/* Stripe connect */}
              <div style={{ background:'#f0f4ff',borderRadius:14,padding:24,marginBottom:24,border:'1px solid #d0d8f8' }}>
                <div style={{ display:'flex',gap:16,alignItems:'flex-start' }}>
                  <div style={{ fontSize:36,flexShrink:0 }}>💳</div>
                  <div>
                    <div style={{ fontSize:16,fontWeight:700,color:'#2a3070',marginBottom:6 }}>Connect Stripe to receive payouts</div>
                    <div style={{ fontSize:13,color:'#505898',lineHeight:1.8,marginBottom:14 }}>
                      Your bank account has been authorised — you can now connect Stripe to start receiving payouts.<br/>
                      Eden retains 10% commission per booking. You receive the rest automatically every Monday.
                    </div>
                    <a href="https://stripe.com/connect" target="_blank" rel="noreferrer" style={{ display:'inline-block',padding:'10px 24px',background:'#635bff',border:'none',borderRadius:8,color:'#fff',fontWeight:700,cursor:'pointer',fontSize:13,textDecoration:'none' }}>
                      Connect Stripe Account →
                    </a>
                  </div>
                </div>
              </div>

              {/* Plans */}
              <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:16 }}>Subscription Plan</div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:28 }}>
                {PLANS.map(p => (
                  <div key={p.id} style={{ borderRadius:12,padding:'20px 18px',border:`2px solid ${salon?.plan===p.id?T.sage:T.border}`,background:salon?.plan===p.id?T.mint:T.white,cursor:'pointer',transition:'all 0.2s' }}>
                    {salon?.plan===p.id && <div style={{ fontSize:9,fontWeight:700,color:T.moss,letterSpacing:1,marginBottom:6 }}>✓ CURRENT PLAN</div>}
                    <div style={{ fontFamily:F.display,fontSize:18,color:T.forest }}>{p.name}</div>
                    <div style={{ fontSize:22,fontWeight:700,color:T.sage,margin:'6px 0 12px' }}>{p.price===0?'Free':`£${p.price}/mo`}</div>
                    {p.features.map(f => (
                      <div key={f} style={{ fontSize:11,color:T.inkMid,marginBottom:4,display:'flex',gap:6 }}>
                        <span style={{ color:T.sage }}>✓</span>{f}
                      </div>
                    ))}
                    {salon?.plan !== p.id && (
                      <button style={{ marginTop:14,width:'100%',padding:'9px',background:T.forest,border:'none',borderRadius:8,color:T.white,fontSize:11,fontWeight:700,cursor:'pointer' }}>
                        {p.price > (salon?.plan==='premium'?119:salon?.plan==='standard'?59:0) ? 'Upgrade →' : 'Downgrade'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Payout history */}
              <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:14 }}>Recent Payouts</div>
              {[
                { date:'27 May 2026', bookings:14, gross:'£1,840', commission:'£184', net:'£1,656' },
                { date:'20 May 2026', bookings:12, gross:'£1,540', commission:'£154', net:'£1,386' },
                { date:'13 May 2026', bookings:11, gross:'£1,290', commission:'£129', net:'£1,161' },
              ].map((p,i) => (
                <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',background:T.white,borderRadius:10,padding:'14px 20px',marginBottom:8,border:`1px solid ${T.border}`,fontSize:13,flexWrap:'wrap',gap:8 }}>
                  <span style={{ fontWeight:500,color:T.ink }}>{p.date}</span>
                  <span style={{ color:T.inkSoft }}>{p.bookings} bookings</span>
                  <span style={{ color:T.inkSoft }}>Gross {p.gross}</span>
                  <span style={{ color:T.error }}>−{p.commission} fee</span>
                  <span style={{ color:T.success,fontWeight:700 }}>{p.net} net</span>
                  <Badge variant="green" small>paid</Badge>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontFamily:F.display,fontSize:24,color:T.forest,marginBottom:24 }}>Account Settings</div>
              <div style={{ background:T.white,borderRadius:14,padding:28,border:`1px solid ${T.border}`,marginBottom:20 }}>
                <div style={{ fontFamily:F.display,fontSize:18,color:T.forest,marginBottom:20 }}>Personal Details</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:0 }}>
                  <div style={{ paddingRight:16 }}>
                    <Input label="Full Name"      defaultValue={profile?.full_name || ''} placeholder="Your full name"/>
                    <Input label="Email Address"  defaultValue={user?.email || ''} placeholder="you@example.com"/>
                  </div>
                  <div style={{ paddingLeft:16 }}>
                    <Input label="Phone Number"   defaultValue={profile?.phone || ''} placeholder="+44 7700 000000"/>
                    <Input label="New Password"   type="password" placeholder="Leave blank to keep current"/>
                  </div>
                </div>
                <Button variant="primary" size="md">Save Changes</Button>
              </div>
              <div style={{ background:'#fff8f8',borderRadius:14,padding:24,border:'1px solid #f0d0d0' }}>
                <div style={{ fontFamily:F.display,fontSize:16,color:T.error,marginBottom:8 }}>Danger Zone</div>
                <div style={{ fontSize:13,color:T.inkSoft,marginBottom:14 }}>Permanently delete your Eden account and all associated data. This cannot be undone.</div>
                <Button variant="danger" size="sm">Delete Account</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
