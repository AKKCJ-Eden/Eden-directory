import { GLOBAL_CSS, T, F, Button, Nav } from '../lib/design'

export default function NotFound({ user }) {
  return (
    <div style={{ minHeight:'100vh',background:T.cream,fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user}/>
      <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 62px)',textAlign:'center',padding:24 }}>
        <div style={{ fontSize:64,marginBottom:20 }}>🌿</div>
        <div style={{ fontFamily:F.display,fontSize:48,color:T.forest,marginBottom:8,fontWeight:300 }}>404</div>
        <div style={{ fontFamily:F.display,fontSize:24,color:T.inkMid,marginBottom:12 }}>Page not found</div>
        <div style={{ fontSize:14,color:T.inkSoft,marginBottom:28,maxWidth:340,lineHeight:1.7 }}>
          The page you're looking for doesn't exist. Let's get you back to finding beautiful things.
        </div>
        <Button variant="primary" size="lg" onClick={() => window.location.href='/'}>← Back to Eden</Button>
      </div>
    </div>
  )
}
