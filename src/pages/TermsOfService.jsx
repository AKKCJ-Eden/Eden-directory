import { useNavigate } from 'react-router-dom'
import { GLOBAL_CSS, T, F, Nav, Button } from '../lib/design'

const LAST_UPDATED = '8 June 2026'

function Section({ number, title, children, last }) {
  return (
    <div id={`section-${number}`} style={{ marginBottom: 48, scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: T.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.white, flexShrink: 0 }}>
          {number}
        </div>
        <h2 style={{ fontFamily: F.display, fontSize: 'clamp(18px,3vw,26px)', color: T.forest, fontWeight: 400, margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ paddingLeft: 50 }}>{children}</div>
      {!last && <div style={{ height: 1, background: T.border, marginTop: 48 }} />}
    </div>
  )
}

function P({ children }) {
  return <p style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.85, marginBottom: 14 }}>{children}</p>
}

function SH({ children }) {
  return <div style={{ fontSize: 15, fontWeight: 700, color: T.forest, margin: '20px 0 10px', fontFamily: F.display }}>{children}</div>
}

function InfoBox({ children }) {
  return (
    <div style={{ background: T.mint, borderRadius: 10, padding: '16px 18px', margin: '14px 0', border: `1px solid ${T.sagePale}`, fontSize: 13, color: T.inkMid, lineHeight: 1.9 }}>
      {children}
    </div>
  )
}

function UL({ items }) {
  return (
    <ul style={{ margin: '10px 0 14px', paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.8, marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  )
}

export default function TermsOfService({ user }) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: T.cream, fontFamily: F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')} />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${T.forestDark}, ${T.forest})`, padding: '60px 24px 50px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: T.sageLight, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Legal</div>
        <h1 style={{ fontFamily: F.display, fontSize: 'clamp(28px,5vw,46px)', fontWeight: 300, color: T.white, marginBottom: 12 }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Last updated: {LAST_UPDATED}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto' }}>
          Please read these terms carefully. By using Eden you agree to be bound by them.
        </p>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Warning box */}
        <div style={{ background: '#fff8e8', borderRadius: 12, padding: '18px 22px', marginBottom: 36, border: '1px solid #f0d890' }}>
          <div style={{ fontSize: 13, color: '#a06010', lineHeight: 1.8 }}>
            <strong>Important:</strong> These Terms of Service form a legally binding agreement between you and The Eden App LTD. If you do not agree, please do not use Eden.
          </div>
        </div>

        {/* Contents */}
        <div style={{ background: T.white, borderRadius: 14, padding: '24px 28px', marginBottom: 40, border: `1px solid ${T.border}`, boxShadow: `0 2px 12px ${T.shadow}` }}>
          <div style={{ fontFamily: F.display, fontSize: 16, color: T.forest, marginBottom: 14 }}>Contents</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
            {[
              ['1', 'About Eden'],
              ['2', 'Acceptance of terms'],
              ['3', 'Customer terms'],
              ['4', 'Business owner terms'],
              ['5', 'Bookings and payments'],
              ['6', 'Cancellation policy'],
              ['7', 'Reviews'],
              ['8', 'Prohibited conduct'],
              ['9', 'Intellectual property'],
              ['10', 'Limitation of liability'],
              ['11', 'Termination'],
              ['12', 'Governing law'],
            ].map(([n, t]) => (
              <a key={n} href={`#section-${n}`} style={{ fontSize: 13, color: T.sage, textDecoration: 'none', padding: '4px 0' }}>
                {n}. {t}
              </a>
            ))}
          </div>
        </div>

        {/* Section 1 */}
        <Section number="1" title="About Eden">
          <P>Eden is a UK-based online beauty and wellness marketplace operated by The Eden App LTD, registered in England and Wales.</P>
          <InfoBox>
            <strong>Company:</strong> The Eden App LTD<br />
            <strong>Website:</strong> theedenappltd.com<br />
            <strong>Contact:</strong>{' '}
            <a href="mailto:hello@theedenappltd.com" style={{ color: T.sage }}>hello@theedenappltd.com</a>
          </InfoBox>
          <P>Eden acts as an introduction and booking agent — we facilitate bookings but the contract for the actual treatment is between the customer and the salon directly. Eden is not a beauty service provider and does not employ beauty professionals.</P>
        </Section>

        {/* Section 2 */}
        <Section number="2" title="Acceptance of Terms">
          <P>By using Eden you confirm that:</P>
          <UL items={[
            'You are at least 18 years old, or have parental consent if aged 13 to 17',
            'You have read and agree to these Terms of Service',
            'You have read and understood our Privacy Policy',
            'You have the legal capacity to enter into a binding contract',
            'You will use Eden only for lawful purposes',
          ]} />
          <P>We reserve the right to update these terms at any time with 30 days notice to registered users.</P>
        </Section>

        {/* Section 3 */}
        <Section number="3" title="Customer Terms">
          <SH>Your account</SH>
          <P>You may browse Eden without an account. To make bookings you must provide accurate contact details. You are responsible for keeping your details up to date.</P>
          <SH>Accuracy of information</SH>
          <P>You agree to provide truthful information when booking, including any allergies or health conditions relevant to your treatment. Eden and the salon cannot be responsible for adverse outcomes from information you did not disclose.</P>
          <SH>Your relationship with salons</SH>
          <P>When you book through Eden you enter a direct contract with the salon. Eden is not a party to that contract. Disputes about treatment quality should be raised with the salon first.</P>
          <SH>Appropriate use</SH>
          <P>You agree not to make bookings you do not intend to keep, submit false reviews, or use Eden to harass salon staff. Accounts that misuse the platform may be suspended.</P>
        </Section>

        {/* Section 4 */}
        <Section number="4" title="Business Owner Terms">
          <SH>Listing requirements</SH>
          <P>To list on Eden your business must be legally registered in the UK and hold all required licences and insurance for the treatments you offer. Aesthetics clinics providing prescription treatments must be registered with the CQC or equivalent body.</P>
          <SH>Your listing</SH>
          <P>You are responsible for keeping your listing accurate, including prices, availability and opening hours. Misleading content may result in immediate removal.</P>
          <SH>Responding to bookings</SH>
          <P>You agree to honour confirmed bookings made through Eden. Repeatedly cancelling confirmed bookings may result in suspension from the platform.</P>
          <SH>Subscription plans</SH>
          <P>Subscription fees are billed monthly in advance and auto-renew unless cancelled at least 24 hours before renewal. No refunds are given for partial months. You may change or cancel your plan at any time from your dashboard.</P>
          <SH>Commission</SH>
          <P>Eden charges a platform commission on bookings processed through Eden. The current rate is shown in your dashboard. Eden reserves the right to adjust commission rates with 30 days notice.</P>
        </Section>

        {/* Section 5 */}
        <Section number="5" title="Bookings and Payments">
          <SH>Booking confirmation</SH>
          <P>A booking is confirmed when you receive a confirmation email from Eden. Eden may cancel a booking if a salon becomes unavailable, with a full refund to the customer.</P>
          <SH>Payments</SH>
          <P>All payments are processed by Stripe. By paying through Eden you agree to Stripe terms of service. Eden does not store your payment card details.</P>
          <SH>Pricing</SH>
          <P>Prices are set by salons and are inclusive of VAT where applicable. The Eden platform fee is included in the total shown at checkout.</P>
          <SH>Payouts to salons</SH>
          <P>Salon earnings are paid weekly via Stripe Connect, less the Eden platform commission. Payouts are processed every Monday and arrive within 2 to 3 business days. Eden may withhold payouts where fraud is suspected or a dispute is in progress.</P>
        </Section>

        {/* Section 6 */}
        <Section number="6" title="Cancellation Policy">
          <SH>Customer cancellations</SH>
          <P>Customers may cancel free of charge up to 24 hours before their appointment. Cancellations within 24 hours may be subject to a cancellation fee at the salon owner's sole discretion.</P>
          <SH>Cancellation fees</SH>
          <P>Where a customer cancels within 24 hours and provides a reason, the salon may apply a cancellation fee of up to 50% of the booking value. The customer will be notified of this decision by email. Cancellation fees are non-refundable.</P>
          <SH>No-shows</SH>
          <P>If a customer fails to attend without cancelling, the salon may charge the full booking amount. Repeated no-shows may result in account restrictions.</P>
          <SH>Salon cancellations</SH>
          <P>If a salon cancels a confirmed booking the customer will receive a full refund within 5 to 10 business days. Salons that repeatedly cancel may be suspended.</P>
          <SH>Refunds</SH>
          <P>Refunds are processed to the original payment method within 5 to 10 business days. The Eden platform fee is non-refundable except where a salon cancels the booking.</P>
        </Section>

        {/* Section 7 */}
        <Section number="7" title="Reviews">
          <P>By submitting a review you confirm that:</P>
          <UL items={[
            'Your review is honest and based on your genuine experience',
            'You will not review a business you own or have a financial interest in',
            'Your review does not contain defamatory or offensive content',
            'Your review does not include personal information about staff members',
            'You grant Eden a licence to display your review on the platform',
          ]} />
          <P>Eden may remove reviews that violate these guidelines or that we believe are fraudulent. Only customers who have completed a booking through Eden may review that salon.</P>
        </Section>

        {/* Section 8 */}
        <Section number="8" title="Prohibited Conduct">
          <P>You agree not to use Eden to:</P>
          <UL items={[
            'Violate any UK or international law or regulation',
            'Impersonate any person or misrepresent your identity',
            'Submit false, misleading or fraudulent bookings or reviews',
            'Scrape or harvest data from Eden without written permission',
            'Attempt unauthorised access to any part of Eden or its systems',
            'Transmit malware, viruses or malicious code',
            'Arrange bookings off-platform after initial contact through Eden',
            'Harass or threaten other users, salon staff or Eden employees',
            'Post discriminatory, offensive or sexually explicit content',
          ]} />
          <P>Breach of these terms may result in immediate account suspension and referral to law enforcement where appropriate.</P>
        </Section>

        {/* Section 9 */}
        <Section number="9" title="Intellectual Property">
          <P>The Eden platform, including its design, code, branding, logos and AI features, is the intellectual property of The Eden App LTD and is protected by UK and international copyright and trademark law.</P>
          <P>You may not reproduce or distribute any part of Eden without our express written permission.</P>
          <SH>Your content</SH>
          <P>By submitting content to Eden — including photos, service descriptions and reviews — you grant The Eden App LTD a non-exclusive, royalty-free licence to use and display that content on the platform and in our marketing. You retain ownership of your content and may request its removal at any time.</P>
        </Section>

        {/* Section 10 */}
        <Section number="10" title="Limitation of Liability">
          <SH>What Eden is not responsible for</SH>
          <UL items={[
            'The quality, safety or outcome of any treatment provided by a salon',
            'Inaccurate information provided by salons in their listings',
            'Loss arising from your reliance on reviews or ratings',
            'Any injury or adverse outcome from a treatment booked through Eden',
            'Loss of earnings or profits arising from use of the platform',
            'Temporary unavailability of the platform',
          ]} />
          <SH>Our liability cap</SH>
          <P>Where Eden is found liable, our total liability shall not exceed the total amount you paid to Eden in the 12 months before the claim, or 100 pounds, whichever is greater.</P>
          <SH>Consumer rights</SH>
          <P>Nothing in these terms affects your statutory rights under UK law, including the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013.</P>
        </Section>

        {/* Section 11 */}
        <Section number="11" title="Termination">
          <SH>By you</SH>
          <P>You may close your Eden account at any time from your settings or by emailing hello@theedenappltd.com. Closing your account does not affect confirmed bookings already made.</P>
          <SH>By Eden</SH>
          <P>Eden may suspend or terminate your access immediately if you breach these terms, provide false information, engage in fraud, or use the platform in a way that causes harm to others.</P>
        </Section>

        {/* Section 12 */}
        <Section number="12" title="Governing Law" last>
          <P>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</P>
          <SH>Complaints</SH>
          <P>If you have a complaint please contact us first at hello@theedenappltd.com. We aim to resolve all complaints within 10 business days.</P>
          <InfoBox>
            <strong>The Eden App LTD</strong><br />
            Registered in England and Wales<br />
            <a href="mailto:hello@theedenappltd.com" style={{ color: T.sage }}>hello@theedenappltd.com</a>{' — '}
            <a href="https://theedenappltd.com" style={{ color: T.sage }}>theedenappltd.com</a>
          </InfoBox>
        </Section>

        {/* CTA */}
        <div style={{ background: T.mint, borderRadius: 14, padding: '24px 28px', border: `1px solid ${T.sagePale}`, textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontSize: 18, color: T.forest, marginBottom: 8 }}>Questions about these terms?</div>
          <div style={{ fontSize: 13, color: T.inkSoft, marginBottom: 16 }}>We are happy to explain anything in plain English.</div>
          <a href="mailto:hello@theedenappltd.com">
            <Button variant="primary">Contact Us</Button>
          </a>
        </div>
      </div>

      <footer style={{ background: T.forestDark, padding: '32px 24px', color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', lineHeight: 2 }}>
        <div style={{ fontFamily: F.display, fontSize: 18, color: T.white, marginBottom: 6 }}>Eden</div>
        <div>2026 The Eden App LTD - Registered in England and Wales</div>
        <div style={{ marginTop: 4 }}>
          <a href="/privacy" style={{ color: T.sageLight }}>Privacy Policy</a>
          {' - '}
          <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms of Service</a>
          {' - '}
          <a href="mailto:hello@theedenappltd.com" style={{ color: 'rgba(255,255,255,0.4)' }}>hello@theedenappltd.com</a>
        </div>
      </footer>
    </div>
  )
}
