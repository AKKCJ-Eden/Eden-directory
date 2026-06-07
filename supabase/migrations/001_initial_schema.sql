-- ═══════════════════════════════════════════════════
--  EDEN DIRECTORY — Complete Database Schema
--  Run this in Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (extends Supabase auth.users) ──────
CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'business', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── SALONS ───────────────────────────────────────
CREATE TABLE salons (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id        UUID REFERENCES profiles(id),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  category        TEXT NOT NULL CHECK (category IN ('hair','barber','nails','aesthetics','beauty','spa','makeup')),
  bio             TEXT,
  address_line1   TEXT,
  address_line2   TEXT,
  city            TEXT,
  postcode        TEXT NOT NULL,
  latitude        DECIMAL(10,8),
  longitude       DECIMAL(11,8),
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  rating          DECIMAL(3,2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  promoted        BOOLEAN DEFAULT FALSE,
  featured        BOOLEAN DEFAULT FALSE,
  verified        BOOLEAN DEFAULT FALSE,
  active          BOOLEAN DEFAULT TRUE,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free','standard','premium')),
  stripe_account_id TEXT,
  response_time   TEXT DEFAULT '~1 hour',
  open_hours      JSONB,
  images          TEXT[],
  tags            TEXT[],
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SERVICES ─────────────────────────────────────
CREATE TABLE services (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  category    TEXT,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  duration    INTEGER NOT NULL, -- minutes
  popular     BOOLEAN DEFAULT FALSE,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STAFF ────────────────────────────────────────
CREATE TABLE staff (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT,
  bio         TEXT,
  experience  TEXT,
  avatar_url  TEXT,
  active      BOOLEAN DEFAULT TRUE
);

-- ─── BOOKINGS ─────────────────────────────────────
CREATE TABLE bookings (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id          UUID REFERENCES salons(id),
  service_id        UUID REFERENCES services(id),
  customer_id       UUID REFERENCES profiles(id),
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT,
  booking_date      DATE NOT NULL,
  booking_time      TIME NOT NULL,
  duration_minutes  INTEGER,
  notes             TEXT,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  -- Payment
  subtotal          DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  net_amount        DECIMAL(10,2),
  stripe_payment_id TEXT,
  stripe_transfer_id TEXT,
  payment_status    TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  -- Notifications
  email_sent        BOOLEAN DEFAULT FALSE,
  sms_sent          BOOLEAN DEFAULT FALSE,
  reminder_sent     BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REVIEWS ──────────────────────────────────────
CREATE TABLE reviews (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES bookings(id),
  reviewer_id UUID REFERENCES profiles(id),
  author_name TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  service_name TEXT,
  verified    BOOLEAN DEFAULT FALSE,
  approved    BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update salon rating when review added
CREATE OR REPLACE FUNCTION update_salon_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE salons
  SET
    rating = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM reviews WHERE salon_id = NEW.salon_id AND approved = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE salon_id = NEW.salon_id AND approved = TRUE)
  WHERE id = NEW.salon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_created
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_salon_rating();

-- ─── FAVOURITES ───────────────────────────────────
CREATE TABLE favourites (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  salon_id   UUID REFERENCES salons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, salon_id)
);

-- ─── SUBSCRIPTIONS ────────────────────────────────
CREATE TABLE subscriptions (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id              UUID REFERENCES salons(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id    TEXT,
  plan                  TEXT CHECK (plan IN ('free','standard','premium')),
  status                TEXT CHECK (status IN ('active','cancelled','past_due','trialing')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS LOG ────────────────────────────
CREATE TABLE notifications (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id  UUID REFERENCES bookings(id),
  type        TEXT CHECK (type IN ('email_confirmation','sms_reminder','email_reminder','cancellation')),
  recipient   TEXT,
  sent_at     TIMESTAMPTZ DEFAULT NOW(),
  success     BOOLEAN DEFAULT TRUE,
  error_msg   TEXT
);

-- ─── ROW LEVEL SECURITY ───────────────────────────

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Salons: anyone can read active salons
CREATE POLICY "Anyone can view active salons" ON salons FOR SELECT USING (active = TRUE);
CREATE POLICY "Owners can update their salon" ON salons FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert salons"      ON salons FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Services: anyone can read
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (active = TRUE);
CREATE POLICY "Salon owners can manage services" ON services FOR ALL
  USING (EXISTS (SELECT 1 FROM salons WHERE salons.id = services.salon_id AND salons.owner_id = auth.uid()));

-- Staff: anyone can read
CREATE POLICY "Anyone can view staff" ON staff FOR SELECT USING (active = TRUE);

-- Bookings: customers see own, salon owners see their bookings
CREATE POLICY "Customers see own bookings" ON bookings FOR SELECT
  USING (auth.uid() = customer_id);
CREATE POLICY "Salon owners see their bookings" ON bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM salons WHERE salons.id = bookings.salon_id AND salons.owner_id = auth.uid()));
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (TRUE);

-- Reviews: anyone can read approved
CREATE POLICY "Anyone can read approved reviews" ON reviews FOR SELECT USING (approved = TRUE);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Favourites: users manage their own
CREATE POLICY "Users manage own favourites" ON favourites FOR ALL USING (auth.uid() = user_id);

-- ─── SAMPLE DATA ──────────────────────────────────
-- (Add your first salons here after setup)
-- INSERT INTO salons (name, category, postcode, city, ...) VALUES (...);
