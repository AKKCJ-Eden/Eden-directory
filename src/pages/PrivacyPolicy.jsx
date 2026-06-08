import { useNavigate } from 'react-router-dom'
import { GLOBAL_CSS, T, F, Nav, Button } from '../lib/design'

export default function PrivacyPolicy({ user }) {
  const navigate = useNavigate()
  const lastUpdated = '7 June 2026'

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')}/>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${T.forestDark},${T.forest})`, padding:'60px 24px 50px', textAlign:'center' }}>
        <div style={{ fontSize:10, letterSpacing:5, color:T.sageLight, textTransform:'uppercase', marginBottom:14, fontWeight:600 }}>Legal</div>
        <h1 style={{ fontFamily:F.display, fontSize:'clamp(28px,5vw,46px)', fontWeight:300, color:T.white, marginBottom:12 }}>Privacy Policy</h1>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>Last updated: {lastUpdated}</p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', maxWidth:560, margin:'0 auto' }}>
          The Eden App LTD trading as The Eden App LTD is committed to protecting your personal data and respecting your privacy in accordance with UK and EU law.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth:820, margin:'0 auto', padding:'56px 24px 80px' }}>

        {/* Quick nav */}
        <div style={{ background:T.white, borderRadius:14, padding:'24px 28px', marginBottom:40, border:`1px solid ${T.border}`, boxShadow:`0 2px 12px ${T.shadow}` }}>
          <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:14 }}>Contents</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 20px' }}>
            {[
              ['1','Who we are'],
              ['2','What data we collect'],
              ['3','How we use your data'],
              ['4','Legal basis for processing'],
              ['5','Cookies'],
              ['6','Data sharing'],
              ['7','Data retention'],
              ['8','Your rights'],
              ['9','International transfers'],
              ['10','Children'],
              ['11','Security'],
              ['12','Contact us'],
            ].map(([n,t]) => (
              <a key={n} href={`#section-${n}`} style={{ fontSize:13, color:T.sage, textDecoration:'none', padding:'4px 0', borderBottom:`1px solid transparent` }}
                onMouseEnter={e=>e.target.style.color=T.forest}
                onMouseLeave={e=>e.target.style.color=T.sage}>
                {n}. {t}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        {[
          {
            id:'1',
            title:'Who We Are',
            content: (
              <>
                <P>This Privacy Policy is issued by <strong>The Eden App LTD</strong>, a company registered in England and Wales, trading as <strong>The Eden App LTD</strong> (referred to as "Eden", "we", "us" or "our").</P>
                <InfoBox>
                  <strong>Data Controller:</strong> The Eden App LTD<br/>
                  <strong>Trading as:</strong> The Eden App LTD<br/>
                  <strong>Website:</strong> theedenappltd.com<br/>
                  <strong>Contact:</strong> <a href="mailto:privacy@theedenappltd.com" style={{ color:T.sage }}>privacy@theedenappltd.com</a><br/>
                  <strong>Registered in:</strong> England and Wales
                </InfoBox>
                <P>We operate Eden, a UK-based beauty and wellness directory and booking platform. This policy explains how we collect, use, store and protect your personal data when you use our website and services.</P>
                <P>We are committed to complying with the <strong>UK General Data Protection Regulation (UK GDPR)</strong>, the <strong>Data Protection Act 2018</strong>, and the <strong>Privacy and Electronic Communications Regulations 2003 (PECR)</strong>.</P>
              </>
            )
          },
          {
            id:'2',
            title:'What Data We Collect',
            content: (
              <>
                <P>We collect personal data in the following categories depending on how you use Eden:</P>
                <SubHeading>2.1 Data you provide directly</SubHeading>
                <Table rows={[
                  ['Full name', 'Account registration, booking form'],
                  ['Email address', 'Account registration, booking confirmation, marketing'],
                  ['Mobile number', 'SMS appointment reminders (if provided)'],
                  ['Postal address and postcode', 'Searching for salons, business registration'],
                  ['Payment card details', 'Processed securely by Stripe — we never store card data'],
                  ['Business information', 'Salon name, address, services, opening hours (for business owners)'],
                  ['Profile information', 'Bio, photos uploaded by business owners'],
                  ['Communications', 'Messages, reviews, support enquiries you send us'],
                  ['Notes and preferences', 'Treatment notes, allergy information provided at booking'],
                ]}/>
                <SubHeading>2.2 Data collected automatically</SubHeading>
                <Table rows={[
                  ['IP address', 'Security, fraud prevention, approximate location'],
                  ['Browser type and version', 'Technical compatibility and security'],
                  ['Device information', 'Ensuring the site works correctly on your device'],
                  ['Pages visited and time spent', 'Understanding how people use Eden (analytics)'],
                  ['Referring website', 'Understanding how you found Eden'],
                  ['Cookie data', 'See Section 5 for full details'],
                ]}/>
                <SubHeading>2.3 Data from third parties</SubHeading>
                <Table rows={[
                  ['Payment status', 'Stripe informs us whether a payment succeeded or failed'],
                  ['Postcode validation', 'Postcodes.io verifies UK postcode format'],
                  ['Business verification', 'Companies House data for business owner verification'],
                ]}/>
              </>
            )
          },
          {
            id:'3',
            title:'How We Use Your Data',
            content: (
              <>
                <P>We use personal data only for the purposes for which it was collected. These purposes are:</P>
                <SubHeading>For customers</SubHeading>
                <BulletList items={[
                  'To process your booking and send confirmation by email and SMS',
                  'To send appointment reminders (24 hours and 2 hours before your appointment)',
                  'To enable you to search for, compare and contact beauty businesses',
                  'To process payments securely through Stripe',
                  'To maintain your account and allow you to view your booking history',
                  'To send service-related communications (e.g. booking changes, cancellations)',
                  'To send marketing emails where you have given explicit consent (you can opt out at any time)',
                  'To handle complaints, refund requests and customer service enquiries',
                  'To detect and prevent fraud and abuse of our platform',
                  'To improve Eden through anonymised analytics data',
                ]}/>
                <SubHeading>For business owners</SubHeading>
                <BulletList items={[
                  'To create and display your listing on Eden',
                  'To provide you with your business dashboard',
                  'To send booking notifications and alerts',
                  'To process subscription payments and manage your plan',
                  'To facilitate Stripe Connect payouts to your bank account',
                  'To send weekly performance summaries and payout reports',
                  'To verify your business identity and listing',
                  'To communicate changes to Eden's terms, features or policies',
                  'To detect fraudulent or misleading listings',
                ]}/>
                <P>We do not sell your personal data. We do not use your personal data for automated decision-making or profiling that produces significant legal effects.</P>
              </>
            )
          },
          {
            id:'4',
            title:'Legal Basis for Processing',
            content: (
              <>
                <P>Under UK GDPR, we must have a lawful basis for processing your personal data. We rely on the following legal bases:</P>
                <Table headers={['Legal Basis','When We Use It']} rows={[
                  ['Contract (Article 6(1)(b))', 'Processing bookings, account management, payment processing, sending confirmations — necessary to fulfil our contract with you'],
                  ['Legitimate Interests (Article 6(1)(f))', 'Platform security, fraud prevention, analytics, improving our service, communicating important service updates'],
                  ['Consent (Article 6(1)(a))', 'Marketing emails, SMS marketing, non-essential cookies — you can withdraw consent at any time'],
                  ['Legal Obligation (Article 6(1)(c))', 'Complying with financial regulations, responding to lawful requests from authorities, maintaining required records'],
                ]}/>
                <P>Where we rely on <strong>legitimate interests</strong>, we have carefully balanced those interests against your rights and determined they do not override your privacy interests. You have the right to object to processing based on legitimate interests — see Section 8.</P>
              </>
            )
          },
          {
            id:'5',
            title:'Cookies',
            content: (
              <>
                <P>Eden uses cookies and similar technologies to make our website work and to understand how people use it. A cookie is a small text file stored on your device.</P>
                <SubHeading>Essential cookies (no consent required)</SubHeading>
                <Table rows={[
                  ['Session cookie', 'Keeps you logged in during your visit — deleted when you close your browser'],
                  ['Security cookie', 'Protects against cross-site request forgery attacks'],
                  ['Preference cookie', 'Remembers your search radius and category preferences'],
                ]}/>
                <SubHeading>Analytics cookies (consent required)</SubHeading>
                <Table rows={[
                  ['Vercel Analytics', 'Anonymous page view and performance data — no personal identifiers'],
                ]}/>
                <SubHeading>Payment cookies (set by Stripe)</SubHeading>
                <Table rows={[
                  ['Stripe fraud prevention', 'Required by Stripe to process payments safely — governed by Stripe\'s own privacy policy'],
                ]}/>
                <P>You can manage cookie preferences in your browser settings. Disabling essential cookies may affect the functionality of Eden. We do not use advertising or tracking cookies.</P>
              </>
            )
          },
          {
            id:'6',
            title:'Data Sharing',
            content: (
              <>
                <P>We share your personal data only where necessary and with appropriate safeguards in place. We never sell your data.</P>
                <SubHeading>We share data with:</SubHeading>
                <Table rows={[
                  ['Salon/business you book with', 'Your name, contact details, treatment booked, notes — shared to fulfil your booking'],
                  ['Stripe (payment processor)', 'Payment card details are processed directly by Stripe. Eden does not store card data. Stripe is PCI-DSS Level 1 certified.'],
                  ['Vercel (website hosting)', 'Your IP address and browser data are processed by Vercel to serve the website. Vercel is EU-US Data Privacy Framework certified.'],
                  ['Supabase (database)', 'Your account data is stored securely on Supabase infrastructure in the EU. Supabase complies with UK GDPR.'],
                  ['Twilio (SMS notifications)', 'Your mobile number is shared with Twilio solely to send appointment reminders you have requested.'],
                  ['Resend/SendGrid (email)', 'Your email address is shared to deliver transactional emails (booking confirmations, reminders).'],
                  ['Law enforcement or regulators', 'Only where required by law, court order, or to protect the safety of individuals. We will notify you where legally permitted.'],
                ]}/>
                <P>All third-party processors are bound by data processing agreements requiring them to process your data only on our instructions and in compliance with UK GDPR.</P>
                <P>We do not transfer your personal data outside the UK or EEA except where appropriate safeguards are in place (Standard Contractual Clauses or equivalent adequacy decisions).</P>
              </>
            )
          },
          {
            id:'7',
            title:'Data Retention',
            content: (
              <>
                <P>We keep your personal data only for as long as necessary for the purposes it was collected, or as required by law.</P>
                <Table headers={['Data Type','Retention Period','Reason']} rows={[
                  ['Customer account data', '3 years after last activity', 'Account management and dispute resolution'],
                  ['Booking records', '7 years', 'Financial and legal compliance (HMRC requirements)'],
                  ['Payment records', '7 years', 'Financial regulation and fraud prevention'],
                  ['Marketing consent records', '5 years after withdrawal of consent', 'Demonstrating compliance with consent obligations'],
                  ['Support communications', '3 years', 'Dispute resolution and service improvement'],
                  ['Business owner data', '7 years after account closure', 'Financial and contractual records'],
                  ['Analytics data', '26 months (anonymised)', 'Service improvement — no personal identifiers retained'],
                  ['Cancelled booking data', '3 years', 'Dispute resolution, cancellation fee records'],
                ]}/>
                <P>After the retention period, your data is securely deleted or permanently anonymised. You may request earlier deletion — see Section 8.</P>
              </>
            )
          },
          {
            id:'8',
            title:'Your Rights',
            content: (
              <>
                <P>Under UK GDPR and the Data Protection Act 2018, you have the following rights regarding your personal data. These rights are free to exercise and we will respond within <strong>one calendar month</strong>.</P>
                <Table headers={['Your Right','What It Means']} rows={[
                  ['Right of Access (Article 15)', 'Request a copy of all personal data we hold about you (Subject Access Request)'],
                  ['Right to Rectification (Article 16)', 'Ask us to correct inaccurate or incomplete data about you'],
                  ['Right to Erasure (Article 17)', 'Ask us to delete your personal data — "right to be forgotten" — subject to legal exceptions such as financial record obligations'],
                  ['Right to Restrict Processing (Article 18)', 'Ask us to pause processing your data while accuracy or lawfulness is contested'],
                  ['Right to Data Portability (Article 20)', 'Receive your personal data in a structured, machine-readable format to transfer to another service'],
                  ['Right to Object (Article 21)', 'Object to processing based on legitimate interests or for direct marketing — we will stop unless we have compelling legitimate grounds'],
                  ['Right to Withdraw Consent', 'Where processing is based on consent (e.g. marketing emails), withdraw at any time without affecting prior processing'],
                  ['Rights related to automated decisions', 'Not to be subject to solely automated decisions that significantly affect you — Eden does not use such automated decision-making'],
                ]}/>
                <InfoBox>
                  <strong>To exercise any of these rights, contact us at:</strong><br/>
                  📧 <a href="mailto:privacy@theedenappltd.com" style={{ color:T.sage }}>privacy@theedenappltd.com</a><br/>
                  We may ask you to verify your identity before processing your request.
                </InfoBox>
                <SubHeading>Right to complain</SubHeading>
                <P>If you are unhappy with how we handle your personal data, you have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong> — the UK's supervisory authority for data protection:</P>
                <InfoBox>
                  Information Commissioner's Office<br/>
                  Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF<br/>
                  📞 0303 123 1113<br/>
                  🌐 <a href="https://ico.org.uk" target="_blank" rel="noreferrer" style={{ color:T.sage }}>ico.org.uk</a>
                </InfoBox>
                <P>We would always appreciate the opportunity to resolve your concerns directly before you contact the ICO.</P>
              </>
            )
          },
          {
            id:'9',
            title:'International Transfers',
            content: (
              <>
                <P>Some of our third-party service providers are based outside the UK or EEA. Where we transfer personal data internationally, we ensure appropriate safeguards are in place:</P>
                <BulletList items={[
                  'Standard Contractual Clauses (SCCs) approved by the UK ICO or European Commission',
                  'Adequacy decisions recognising equivalent data protection standards',
                  'UK-US Data Privacy Framework certification (where applicable)',
                  'Binding Corporate Rules where relevant',
                ]}/>
                <P>Specifically, Stripe (USA) is certified under the UK-US Data Privacy Framework. Vercel (USA) and Supabase operate under Standard Contractual Clauses. You may request a copy of the relevant safeguards by contacting privacy@theedenappltd.com.</P>
              </>
            )
          },
          {
            id:'10',
            title:'Children',
            content: (
              <>
                <P>Eden is not directed at children under the age of 13 and we do not knowingly collect personal data from children under 13. If you are under 13, please do not use Eden or provide any personal data to us.</P>
                <P>If you are between 13 and 17, you should have a parent or guardian's permission before using Eden or providing personal data. Some aesthetic treatments listed on Eden are only available to adults — individual salon terms apply.</P>
                <P>If we become aware that we have inadvertently collected data from a child under 13 without appropriate consent, we will delete it promptly. Please contact us at privacy@theedenappltd.com if you believe a child's data has been collected inappropriately.</P>
              </>
            )
          },
          {
            id:'11',
            title:'Security',
            content: (
              <>
                <P>We take the security of your personal data seriously and implement appropriate technical and organisational measures including:</P>
                <BulletList items={[
                  'All data transmitted between your device and Eden is encrypted using TLS (HTTPS)',
                  'Passwords are hashed using industry-standard algorithms — we cannot see your password',
                  'Payment card data is processed exclusively by Stripe — we never see or store card numbers',
                  'Database access is controlled by Row Level Security — each user can only access their own data',
                  'Our infrastructure providers (Vercel, Supabase) maintain ISO 27001 and SOC 2 compliance',
                  'We conduct regular reviews of our security practices',
                  'Access to personal data within Eden is restricted to authorised personnel on a need-to-know basis',
                  'We maintain an incident response plan for data breaches',
                ]}/>
                <P>In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify the ICO within 72 hours and notify affected individuals without undue delay as required by UK GDPR Article 33 and 34.</P>
                <P>While we take all reasonable steps to protect your data, no internet transmission is completely secure. You are responsible for keeping your Eden account password confidential.</P>
              </>
            )
          },
          {
            id:'12',
            title:'Contact Us',
            content: (
              <>
                <P>If you have any questions, concerns or requests regarding this Privacy Policy or how we handle your personal data, please contact us:</P>
                <InfoBox>
                  <strong>Data Controller:</strong> The Eden App LTD<br/>
                  <strong>Trading as:</strong> The Eden App LTD<br/>
                  <strong>Privacy enquiries:</strong> <a href="mailto:privacy@theedenappltd.com" style={{ color:T.sage }}>privacy@theedenappltd.com</a><br/>
                  <strong>General enquiries:</strong> <a href="mailto:hello@theedenappltd.com" style={{ color:T.sage }}>hello@theedenappltd.com</a><br/>
                  <strong>Website:</strong> <a href="https://theedenappltd.com" style={{ color:T.sage }}>theedenappltd.com</a>
                </InfoBox>
                <SubHeading>Changes to this policy</SubHeading>
                <P>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify registered users of material changes by email at least 30 days before they take effect. The "last updated" date at the top of this page will always reflect the most recent version.</P>
                <P>Continued use of Eden after a policy update constitutes your acceptance of the revised policy.</P>
                <SubHeading>Governing law</SubHeading>
                <P>This Privacy Policy is governed by the laws of England and Wales. Any disputes relating to this policy shall be subject to the exclusive jurisdiction of the courts of England and Wales.</P>
              </>
            )
          },
        ].map(section => (
          <div key={section.id} id={`section-${section.id}`} style={{ marginBottom:48, scrollMarginTop:80 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:T.forest, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:T.white, flexShrink:0 }}>{section.id}</div>
              <h2 style={{ fontFamily:F.display, fontSize:'clamp(20px,3vw,28px)', color:T.forest, fontWeight:400, margin:0 }}>{section.title}</h2>
            </div>
            <div style={{ paddingLeft:50 }}>
              {section.content}
            </div>
            {section.id !== '12' && <div style={{ height:1, background:T.border, marginTop:48 }}/>}
          </div>
        ))}

        {/* Footer */}
        <div style={{ background:T.mint, borderRadius:14, padding:'24px 28px', border:`1px solid ${T.sagePale}`, textAlign:'center' }}>
          <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:8 }}>Questions about your data?</div>
          <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16 }}>We're committed to transparency. Get in touch and we'll be happy to help.</div>
          <a href="mailto:privacy@theedenappltd.com">
            <Button variant="primary">Contact our Privacy Team</Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:T.forestDark, padding:'32px 24px', color:'rgba(255,255,255,0.4)', fontSize:12, textAlign:'center', lineHeight:2 }}>
        <div style={{ fontFamily:F.display, fontSize:18, color:T.white, marginBottom:6 }}>Eden</div>
        <div>© 2026 The Eden App LTD · Trading as The Eden App LTD · Registered in England & Wales</div>
        <div style={{ marginTop:4 }}>
          <a href="/privacy" style={{ color:T.sageLight }}>Privacy Policy</a>
          {' · '}
          <a href="/terms" style={{ color:'rgba(255,255,255,0.4)' }}>Terms of Service</a>
          {' · '}
          <a href="mailto:hello@theedenappltd.com" style={{ color:'rgba(255,255,255,0.4)' }}>hello@theedenappltd.com</a>
        </div>
      </footer>
    </div>
  )
}

// ─── LOCAL COMPONENTS ─────────────────────────────

function P({ children }) {
  return <p style={{ fontSize:14, color:T.inkMid, lineHeight:1.85, marginBottom:14 }}>{children}</p>
}

function SubHeading({ children }) {
  return <div style={{ fontSize:15, fontWeight:700, color:T.forest, margin:'20px 0 10px', fontFamily:F.display }}>{children}</div>
}

function InfoBox({ children }) {
  return (
    <div style={{ background:T.mint, borderRadius:10, padding:'16px 18px', margin:'14px 0', border:`1px solid ${T.sagePale}`, fontSize:13, color:T.inkMid, lineHeight:1.9 }}>
      {children}
    </div>
  )
}

function BulletList({ items }) {
  return (
    <ul style={{ margin:'10px 0 14px', paddingLeft:20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize:14, color:T.inkMid, lineHeight:1.8, marginBottom:4 }}>{item}</li>
      ))}
    </ul>
  )
}

function Table({ rows, headers }) {
  return (
    <div style={{ overflowX:'auto', margin:'12px 0 16px' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        {headers && (
          <thead>
            <tr>
              {headers.map(h => (
                <th key={h} style={{ textAlign:'left', padding:'10px 14px', background:T.forest, color:T.white, fontWeight:600, fontSize:12, letterSpacing:0.3 }}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i%2===0 ? T.white : T.offwhite }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding:'10px 14px', color:j===0?T.forest:T.inkMid, fontWeight:j===0?600:400, borderBottom:`1px solid ${T.border}`, verticalAlign:'top', lineHeight:1.6 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
