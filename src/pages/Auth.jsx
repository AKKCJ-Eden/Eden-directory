import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/supabase'
import { GLOBAL_CSS, T, F, Input, Button, Spinner, Nav } from '../lib/design'

export default function Auth({ user }) {
  const [mode,     setMode]     = useState('signin') // signin | signup
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true)
    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else navigate('/dashboard')
    } else {
      const { error } = await signUp(email, password, { full_name: name })
      if (error) setError(error.message)
      else setSuccess('Account created! Check your email to confirm, then sign in.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh',background:T.cream,fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user}/>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 62px)',padding:24 }}>
        <div style={{ background:T.white,borderRadius:20,padding:'40px 36px',width:420,maxWidth:'100%',boxShadow:`0 8px 40px ${T.shadow}`,border:`1px solid ${T.border}`,animation:'bloom 0.3s ease' }}>
          <div style={{ textAlign:'center',marginBottom:28 }}>
            <div style={{ fontSize:36,marginBottom:12 }}>🌿</div>
            <div style={{ fontFamily:F.display,fontSize:26,color:T.forest,marginBottom:4 }}>
              {mode==='signin' ? 'Welcome back' : 'Join Eden'}
            </div>
            <div style={{ fontSize:13,color:T.inkSoft }}>
              {mode==='signin' ? 'Sign in to your Eden account' : 'Create your free account'}
            </div>
          </div>

          {mode==='signup' && (
            <Input label="Full Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
          )}
          <Input label="Email Address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>

          {error   && <div style={{ background:'#fff0f0',border:'1px solid #f0c0c0',borderRadius:8,padding:'10px 14px',fontSize:13,color:T.error,marginBottom:16 }}>{error}</div>}
          {success && <div style={{ background:T.mint,border:`1px solid ${T.sagePale}`,borderRadius:8,padding:'10px 14px',fontSize:13,color:T.moss,marginBottom:16 }}>{success}</div>}

          <Button variant="primary" style={{ width:'100%',justifyContent:'center',marginBottom:16 }} onClick={handleSubmit} disabled={loading}>
            {loading ? <><Spinner size={14} color={T.white}/> {mode==='signin'?'Signing in…':'Creating account…'}</> : mode==='signin' ? 'Sign In →' : 'Create Account →'}
          </Button>

          <div style={{ textAlign:'center',fontSize:13,color:T.inkSoft }}>
            {mode==='signin' ? (
              <>Don't have an account? <button onClick={()=>{setMode('signup');setError('');setSuccess('');}} style={{ background:'none',border:'none',color:T.sage,cursor:'pointer',fontWeight:600 }}>Sign up free</button></>
            ) : (
              <>Already have an account? <button onClick={()=>{setMode('signin');setError('');setSuccess('');}} style={{ background:'none',border:'none',color:T.sage,cursor:'pointer',fontWeight:600 }}>Sign in</button></>
            )}
          </div>

          <div style={{ marginTop:20,padding:'14px 16px',background:T.mint,borderRadius:8,border:`1px solid ${T.sagePale}`,fontSize:11,color:T.moss,textAlign:'center',lineHeight:1.7 }}>
            🔒 Your data is encrypted and secure.<br/>
            Eden never shares your details with third parties.
          </div>
        </div>
      </div>
    </div>
  )
}
