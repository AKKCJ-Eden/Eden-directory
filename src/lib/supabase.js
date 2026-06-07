import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── AUTH HELPERS ─────────────────────────────────

export const signUp = async (email, password, meta) => {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: meta }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  await supabase.auth.signOut()
}

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ─── SALON HELPERS ────────────────────────────────

export const getSalons = async ({ category, limit = 50 } = {}) => {
  let query = supabase
    .from('salons')
    .select(`*, services(*), reviews(rating)`)
    .eq('active', true)
    .order('promoted', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  return { data, error }
}

export const getSalonById = async (id) => {
  const { data, error } = await supabase
    .from('salons')
    .select(`*, services(*), reviews(*, profiles(full_name)), staff(*)`)
    .eq('id', id)
    .single()
  return { data, error }
}

// ─── BOOKING HELPERS ──────────────────────────────

export const createBooking = async (booking) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single()
  return { data, error }
}

export const getBookingsForSalon = async (salonId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, services(name, price, duration)`)
    .eq('salon_id', salonId)
    .order('booking_date', { ascending: true })
  return { data, error }
}

// ─── REVIEW HELPERS ───────────────────────────────

export const createReview = async (review) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single()
  return { data, error }
}

// ─── FAVOURITES ───────────────────────────────────

export const toggleFavourite = async (userId, salonId) => {
  const { data: existing } = await supabase
    .from('favourites')
    .select('id')
    .eq('user_id', userId)
    .eq('salon_id', salonId)
    .single()

  if (existing) {
    await supabase.from('favourites').delete().eq('id', existing.id)
    return { favourited: false }
  } else {
    await supabase.from('favourites').insert([{ user_id: userId, salon_id: salonId }])
    return { favourited: true }
  }
}
