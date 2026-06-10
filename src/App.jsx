import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Results from './pages/Results'
import SalonPage from './pages/SalonPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import ListBusiness from './pages/ListBusiness'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f4f7f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg, #1a3a1f, #5a8a62)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
        }}>🌿</div>
        <div style={{ color: '#6a7065', fontSize: 14 }}>Loading Eden...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/"              element={<Home user={user} />} />
      <Route path="/search"        element={<Results user={user} />} />
      <Route path="/salon/:id"     element={<SalonPage user={user} />} />
      <Route path="/dashboard"     element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
      <Route path="/auth"          element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
      <Route path="/list-business" element={<ListBusiness user={user} />} />
      <Route path="/privacy"       element={<PrivacyPolicy user={user} />} />
      <Route path="/terms"         element={<TermsOfService user={user} />} />
      <Route path="/admin"         element={user ? <AdminPanel user={user} /> : <Navigate to="/auth" />} />
      <Route path="*"              element={<NotFound />} />
    </Routes>
  )
}
