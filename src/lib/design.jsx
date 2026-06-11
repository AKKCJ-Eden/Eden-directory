// ═══════════════════════════════════════════
//  EDEN — Design System
// ═══════════════════════════════════════════
import { useEffect } from "react"

export const T = {
  forest:      '#1a3a1f',
  forestDark:  '#0f2412',
  moss:        '#2d5c34',
  sage:        '#5a8a62',
  sageMid:     '#7aaa82',
  sageLight:   '#a8c8ae',
  sagePale:    '#d4e8d7',
  mint:        '#eaf4ec',
  cream:       '#faf8f4',
  offwhite:    '#f4f1eb',
  warmgrey:    '#e8e4dc',
  border:      '#d8d4cc',
  borderMid:   '#c4c0b8',
  ink:         '#1a1c18',
  inkMid:      '#3a3d35',
  inkSoft:     '#6a7065',
  inkFaint:    '#9a9f95',
  gold:        '#c49a3c',
  goldLight:   '#e8c870',
  goldPale:    '#f8f0d8',
  rose:        '#c4788a',
  white:       '#ffffff',
  shadow:      'rgba(26,58,31,0.10)',
  shadowMd:    'rgba(26,58,31,0.16)',
  shadowLg:    'rgba(26,58,31,0.24)',
  success:     '#3a8a4a',
  warning:     '#b87a20',
  error:       '#b84040',
}

export const F = {
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  body:    "'DM Sans', 'Trebuchet MS', sans-serif",
}

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #faf8f4; font-family: 'DM Sans', sans-serif; color: #1a1c18; -webkit-font-smoothing: antialiased; }
  ::selection { background: #d4e8d7; color: #1a3a1f; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f4f1eb; }
  ::-webkit-scrollbar-thumb { background: #a8c8ae; border-radius: 3px; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
  a { color: inherit; text-decoration: none; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes bloom    { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
  @keyframes slideUp  { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
`

// ─── REUSABLE COMPONENTS ─────────────────────────

export const Spinner = ({ size = 18, color = '#5a8a62' }) => (
  <span style={{
    display: 'inline-block', width: size, height: size,
    border: `2px solid #d4e8d7`, borderTop: `2px solid ${color}`,
    borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0
  }}/>
)

export const Stars = ({ r, size = 13 }) => (
  <span style={{ letterSpacing: 1 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(r) ? '#c49a3c' : '#d8d4cc', fontSize: size }}>★</span>
    ))}
  </span>
)

export const Badge = ({ children, variant = 'green', small }) => {
  const styles = {
    green:  { bg: '#eaf4ec', color: '#2d5c34', border: '#d4e8d7' },
    gold:   { bg: '#f8f0d8', color: '#c49a3c', border: '#e8c870' },
    forest: { bg: '#1a3a1f', color: '#ffffff', border: '#1a3a1f' },
    grey:   { bg: '#f4f1eb', color: '#6a7065', border: '#d8d4cc' },
    rose:   { bg: '#fdf0f3', color: '#c4788a', border: '#f0c0cc' },
  }
  const s = styles[variant] || styles.grey
  return (
    <span style={{
      padding: small ? '2px 7px' : '3px 10px',
      borderRadius: 20, fontSize: small ? 9 : 10,
      fontWeight: 600, letterSpacing: 0.6,
      textTransform: 'uppercase', whiteSpace: 'nowrap',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{children}</span>
  )
}

export const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, style = {}, type = 'button' }) => {
  const variants = {
    primary:   { bg: '#1a3a1f', color: '#ffffff', border: 'none' },
    secondary: { bg: 'transparent', color: '#1a3a1f', border: '1.5px solid #d8d4cc' },
    sage:      { bg: '#5a8a62', color: '#ffffff', border: 'none' },
    ghost:     { bg: 'transparent', color: '#6a7065', border: '1px solid #d8d4cc' },
    gold:      { bg: '#e8c870', color: '#1a3a1f', border: 'none' },
    danger:    { bg: '#b84040', color: '#ffffff', border: 'none' },
  }
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 12 },
    md: { padding: '11px 22px', fontSize: 13 },
    lg: { padding: '14px 32px', fontSize: 15 },
  }
  const v = variants[variant] || variants.primary
  const sz = sizes[size] || sizes.md
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...sz, borderRadius: 10, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#d8d4cc' : v.bg,
      color: disabled ? '#9a9f95' : v.color,
      border: v.border, transition: 'all 0.18s ease',
      opacity: disabled ? 0.7 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      letterSpacing: 0.2, ...style,
    }}>{children}</button>
  )
}

export const Input = ({ label, error, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <label style={{ display: 'block', fontSize: 11, color: '#6a7065', fontWeight: 600, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' }}>
        {label}
      </label>
    )}
    <input {...props} style={{
      width: '100%', padding: '11px 14px',
      background: '#f4f1eb', border: `1.5px solid ${error ? '#b84040' : '#d8d4cc'}`,
      borderRadius: 8, color: '#1a1c18', fontSize: 14, outline: 'none',
      boxSizing: 'border-box', transition: 'border-color 0.15s',
      ...(props.style || {}),
    }}
    onFocus={e => { e.target.style.borderColor = '#5a8a62'; e.target.style.background = '#ffffff' }}
    onBlur={e => { e.target.style.borderColor = error ? '#b84040' : '#d8d4cc'; e.target.style.background = '#f4f1eb' }}
    />
    {error && <div style={{ fontSize: 11, color: '#b84040', marginTop: 4 }}>{error}</div>}
  </div>
)

export const Select = ({ label, options = [], error, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <label style={{ display: 'block', fontSize: 11, color: '#6a7065', fontWeight: 600, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' }}>
        {label}
      </label>
    )}
    <select {...props} style={{
      width: '100%', padding: '11px 14px',
      background: '#f4f1eb', border: `1.5px solid ${error ? '#b84040' : '#d8d4cc'}`,
      borderRadius: 8, color: '#1a1c18', fontSize: 14, outline: 'none',
      ...(props.style || {}),
    }}>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
    {error && <div style={{ fontSize: 11, color: '#b84040', marginTop: 4 }}>{error}</div>}
  </div>
)

export const Modal = ({ open, onClose, children, width = 500, title }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 600,
      background: 'rgba(15,36,18,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff', borderRadius: 20, width, maxWidth: '100%',
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 32px 100px rgba(26,58,31,0.24)',
        animation: 'bloom 0.28s ease both',
      }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export const Nav = ({ user, onListBusiness }) => (
  <nav style={{
    position: 'sticky', top: 0, zIndex: 200,
    background: 'rgba(250,248,244,0.96)', backdropFilter: 'blur(16px)',
    borderBottom: '1px solid #d8d4cc',
    padding: '0 24px', height: 62,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 1px 20px rgba(26,58,31,0.08)',
  }}>
    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'linear-gradient(135deg, #1a3a1f, #5a8a62)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, boxShadow: '0 2px 10px rgba(26,58,31,0.2)',
      }}>🌿</div>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: '#1a3a1f', fontWeight: 500 }}>Eden</span>
      <span style={{ fontSize: 9, color: '#9a9f95', letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>UK</span>
    </a>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {user ? (
        <>
          <a href="/dashboard" style={{ fontSize: 13, color: '#6a7065', textDecoration: 'none' }}>Dashboard</a>
          <Button variant="secondary" size="sm" onClick={onListBusiness}>My Business</Button>
        </>
      ) : (
        <>
          <a href="/auth" style={{ fontSize: 13, color: '#6a7065', textDecoration: 'none' }}>Sign In</a>
          <Button variant="primary" size="sm" onClick={onListBusiness}>List Your Business</Button>
        </>
      )}
    </div>
  </nav>
)
