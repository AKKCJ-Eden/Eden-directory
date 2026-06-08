import { useNavigate } from 'react-router-dom'
import { GLOBAL_CSS, T, F, Nav, Button } from '../lib/design'

const LAST_UPDATED = '8 June 2026'

function Section({ id, number, title, children }) {
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
      <div style={{ height: 1, background: T.border, marginTop: 48 }} />
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

function DataTable({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', margin: '12px 0 16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {headers && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '10px 14px', background: T.forest, color: T.white, fontWeight: 600, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? T.white : T.offwhite }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 14px', color: j === 0 ? T.forest : T.inkMid, fontWeight: j === 0 ? 600 : 400, borderBottom: `1px solid ${T.border}`, verticalAlign: 'top', lineHeight: 1.6 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PrivacyPolicy({ user }) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: T.cream, fontFamily: F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')} />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${T.forestDark}, ${T.forest})`, padding: '60px 24px 50px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: T.sageLight, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Legal</div>
        <h1 style={{ fontFamily: F.display, fontSize: 'clamp(28px,5vw,46px)', fontWeight: 300, color: T.white, marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Last updated: {LAST_UPDATED}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto' }}>
          The Eden App LTD is committed to protecting your personal data in accordance with UK and EU law.
        </p>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Contents */}
        <div style={{ background: T.white, borderRadius: 14, padding: '24px 28px', marginBottom: 40, border: `1px solid ${T.border}`, boxShadow: `0 2px 12px ${T.shadow}` }}>
          <div style={{ fontFamily: F.display, fontSize: 16, color: T.forest, marginBottom: 14 }}>Contents</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
            {[
              ['1', 'Who we are'],
              ['2', 'What data we collect'],
              ['3', 'How we use your data'],
              ['4', 'Legal basis for processing'],
              ['5', 'Cookies'],
              ['6', 'Data sharing'],
              ['7', 'Data retention'],
              ['8', 'Your rights'],
              ['9', 'International transfers'],
              ['10', 'Children'],
              ['11', 'Security'],
              ['12', 'Contact us'],
            ].map(([n, t]) => (
              <a key={n} href={`#section-${n}`} style={{ fontSize: 13, color: T.sage, textDecoration: 'none', padding: '4px 0' }}>
                {n}. {t}
              </a>
            ))}
          </div>
        </div>

        {/* Section 1 */}
        <Section number="1" title="Who We Are">
          <P>This Privacy Policy is issued by The Eden App LTD, a company registered in England and Wales, operating the Eden beauty and wellness directory at theedenappltd.com.</P>
          <InfoBox>
            <strong>Data Controller:</strong> The Eden App LTD<br />
            <strong>Website:</strong> theedenappltd.com<br />
            <strong>Privacy contact:</strong>{' '}
            <a href="mailto:privacy@theedenappltd.com" style={{ color: T.sage }}>privacy@theedenappltd.com</a><br />
            <strong>Registered in:</strong> England and Wales
          </InfoBox>
          <P>We comply with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations 2003 (PECR).</P>
        </Section>

        {/* Section 2 */}
        <Section number="2" title="What Data We Collect">
          <SH>Data you provide directly</SH>
          <DataTable rows={[
            ['Full name', 'Account registration and booking forms'],
            ['Email address', 'Account registration, confirmations and communications'],
            ['Mobile number', 'SMS appointment reminders — optional'],
            ['Postcode and address', 'Searching for salons and business registration'],
            ['Payment details', 'Processed securely by Stripe — we never store card numbers'],
            ['Business information', 'Salon name, address, services and opening hours'],
            ['Profile photos', 'Uploaded by business owners for their listing'],
            ['Messages and reviews', 'Communications and feedback you submit'],
            ['Treatment notes', 'Allergy or preference information provided at booking'],
          ]} />
          <SH>Data collected automatically</SH>
          <DataTable rows={[
            ['IP address', 'Security and fraud prevention'],
            ['Browser and device', 'Technical compatibility'],
            ['Pages visited', 'Understanding how people use Eden'],
            ['Cookie data', 'See Section 5 for full details'],
          ]} />
        </Section>

        {/* Section 3 */}
        <Section number="3" title="How We Use Your Data">
          <SH>For customers</SH>
          <UL items={[
            'To process your booking and send confirmation by email and SMS',
            'To send appointment reminders 24 hours and 2 hours before your appointment',
            'To enable you to search for, compare and contact beauty businesses',
            'To process payments securely through Stripe',
            'To maintain your account and booking history',
            'To send marketing emails where you have given explicit consent',
            'To handle complaints and customer service enquiries',
            'To detect and prevent fraud and platform abuse',
          ]} />
          <SH>For business owners</SH>
          <UL items={[
            'To create and display your listing on Eden',
            'To provide your business dashboard',
            'To send booking notifications and alerts',
            'To process subscription payments',
            'To facilitate Stripe Connect payouts to your bank account',
            'To send weekly performance summaries',
            'To verify your business identity',
            'To communicate important changes to Eden',
            'To detect fraudulent or misleading listings',
          ]} />
          <P>We do not sell your personal data to any third party.</P>
        </Section>

        {/* Section 4 */}
        <Section number="4" title="Legal Basis for Processing">
          <DataTable headers={['Legal Basis', 'When We Use It']} rows={[
            ['Contract (Article 6(1)(b))', 'Processing bookings, account management, payments and confirmations'],
            ['Legitimate Interests (Article 6(1)(f))', 'Security, fraud prevention, analytics and service improvement'],
            ['Consent (Article 6(1)(a))', 'Marketing emails, SMS marketing and non-essential cookies'],
            ['Legal Obligation (Article 6(1)(c))', 'Financial regulations and responding to lawful authority requests'],
          ]} />
        </Section>

        {/* Section 5 */}
        <Section number="5" title="Cookies">
          <P>Eden uses cookies to make our website work and to understand how people use it.</P>
          <SH>Essential cookies — no consent required</SH>
          <DataTable rows={[
            ['Session cookie', 'Keeps you logged in during your visit'],
            ['Security cookie', 'Protects against cross-site request forgery'],
            ['Preference cookie', 'Remembers your search settings'],
          ]} />
          <SH>Analytics cookies — consent required</SH>
          <DataTable rows={[
            ['Vercel Analytics', 'Anonymous page view data — no personal identifiers'],
          ]} />
          <SH>Payment cookies — set by Stripe</SH>
          <DataTable rows={[
            ['Stripe fraud prevention', 'Required by Stripe to process payments safely'],
          ]} />
          <P>You can manage cookies in your browser settings. We do not use advertising or tracking cookies.</P>
        </Section>

        {/* Section 6 */}
        <Section number="6" title="Data Sharing">
          <P>We share your data only where necessary and never sell it.</P>
          <DataTable rows={[
            ['The salon you book with', 'Your name, contact details, treatment and notes — to fulfil your booking'],
            ['Stripe', 'Payment processing — PCI-DSS Level 1 certified'],
            ['Vercel', 'Website hosting — EU-US Data Privacy Framework certified'],
            ['Supabase', 'Database storage — compliant with UK GDPR, data stored in EU'],
            ['Twilio', 'SMS reminders — only your mobile number, only when requested'],
            ['Resend or SendGrid', 'Email delivery for confirmations and reminders'],
            ['Law enforcement', 'Only where required by law or court order'],
          ]} />
        </Section>

        {/* Section 7 */}
        <Section number="7" title="Data Retention">
          <DataTable headers={['Data Type', 'Retention Period', 'Reason']} rows={[
            ['Customer account', '3 years after last activity', 'Account management'],
            ['Booking records', '7 years', 'Financial and legal compliance'],
            ['Payment records', '7 years', 'HMRC requirements'],
            ['Marketing consent', '5 years after withdrawal', 'Compliance records'],
            ['Support messages', '3 years', 'Dispute resolution'],
            ['Business owner data', '7 years after closure', 'Financial records'],
            ['Analytics data', '26 months anonymised', 'Service improvement'],
          ]} />
        </Section>

        {/* Section 8 */}
        <Section number="8" title="Your Rights">
          <DataTable headers={['Your Right', 'What It Means']} rows={[
            ['Right of Access', 'Request a copy of all personal data we hold about you'],
            ['Right to Rectification', 'Ask us to correct inaccurate data'],
            ['Right to Erasure', 'Ask us to delete your data — subject to legal exceptions'],
            ['Right to Restrict Processing', 'Ask us to pause processing while accuracy is contested'],
            ['Right to Data Portability', 'Receive your data in a machine-readable format'],
            ['Right to Object', 'Object to processing based on legitimate interests'],
            ['Right to Withdraw Consent', 'Withdraw marketing consent at any time'],
          ]} />
          <InfoBox>
            <strong>To exercise your rights, contact us at:</strong><br />
            <a href="mailto:privacy@theedenappltd.com" style={{ color: T.sage }}>privacy@theedenappltd.com</a>
            <br /><br />
            <strong>To complain to the ICO:</strong><br />
            Information Commissioner Office, Wycliffe House, Wilmslow SK9 5AF<br />
            Phone: 0303 123 1113 — Website:{' '}
            <a href="https://ico.org.uk" target="_blank" rel="noreferrer" style={{ color: T.sage }}>ico.org.uk</a>
          </InfoBox>
        </Section>

        {/* Section 9 */}
        <Section number="9" title="International Transfers">
          <P>Where we transfer data outside the UK or EEA, we ensure appropriate safeguards including Standard Contractual Clauses and adequacy decisions. Stripe and Vercel operate under the UK-US Data Privacy Framework.</P>
        </Section>

        {/* Section 10 */}
        <Section number="10" title="Children">
          <P>Eden is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided data without consent, contact us at privacy@theedenappltd.com and we will delete it promptly.</P>
        </Section>

        {/* Section 11 */}
        <Section number="11" title="Security">
          <UL items={[
            'All data is encrypted in transit using TLS (HTTPS)',
            'Passwords are hashed — we cannot see your password',
            'Payment cards are processed exclusively by Stripe — we never see card numbers',
            'Database access is controlled by Row Level Security',
            'Our infrastructure providers maintain ISO 27001 and SOC 2 compliance',
            'Access to personal data is restricted to authorised personnel only',
          ]} />
          <P>In the event of a data breach we will notify the ICO within 72 hours and affected users without undue delay as required by UK GDPR.</P>
        </Section>

        {/* Section 12 */}
        <Section number="12" title="Contact Us">
          <InfoBox>
            <strong>The Eden App LTD</strong><br />
            Registered in England and Wales<br />
            <strong>Privacy:</strong>{' '}
            <a href="mailto:privacy@theedenappltd.com" style={{ color: T.sage }}>privacy@theedenappltd.com</a><br />
            <strong>General:</strong>{' '}
            <a href="mailto:hello@theedenappltd.com" style={{ color: T.sage }}>hello@theedenappltd.com</a>
          </InfoBox>
          <P>We may update this policy from time to time. We will notify registered users of material changes by email at least 30 days before they take effect.</P>
        </Section>

        {/* CTA */}
        <div style={{ background: T.mint, borderRadius: 14, padding: '24px 28px', border: `1px solid ${T.sagePale}`, textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontSize: 18, color: T.forest, marginBottom: 8 }}>Questions about your data?</div>
          <div style={{ fontSize: 13, color: T.inkSoft, marginBottom: 16 }}>We are committed to transparency. Get in touch and we will be happy to help.</div>
          <a href="mailto:privacy@theedenappltd.com">
            <Button variant="primary">Contact our Privacy Team</Button>
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
