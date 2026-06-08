import { useNavigate } from 'react-router-dom'
import { GLOBAL_CSS, T, F, Nav, Button } from '../lib/design'

export default function TermsOfService({ user }) {
  const navigate = useNavigate()
  const lastUpdated = '8 June 2026'

  return (
    <div style={{ minHeight:'100vh', background:T.cream, fontFamily:F.body }}>
      <style>{GLOBAL_CSS}</style>
      <Nav user={user} onListBusiness={() => navigate('/list-business')}/>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${T.forestDark},${T.forest})`, padding:'60px 24px 50px', textAlign:'center' }}>
        <div style={{ fontSize:10, letterSpacing:5, color:T.sageLight, textTransform:'uppercase', marginBottom:14, fontWeight:600 }}>Legal</div>
        <h1 style={{ fontFamily:F.display, fontSize:'clamp(28px,5vw,46px)', fontWeight:300, color:T.white, marginBottom:12 }}>Terms of Service</h1>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>Last updated: {lastUpdated}</p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', maxWidth:560, margin:'0 auto' }}>
          Please read these terms carefully before using Eden. By using our platform you agree to be bound by these terms.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth:820, margin:'0 auto', padding:'56px 24px 80px' }}>

        {/* Quick nav */}
        <div style={{ background:T.white, borderRadius:14, padding:'24px 28px', marginBottom:40, border:`1px solid ${T.border}`, boxShadow:`0 2px 12px ${T.shadow}` }}>
          <div style={{ fontFamily:F.display, fontSize:16, color:T.forest, marginBottom:14 }}>Contents</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 20px' }}>
            {[
              ['1','About Eden'],
              ['2','Acceptance of terms'],
              ['3','Customer terms'],
              ['4','Business owner terms'],
              ['5','Bookings and payments'],
              ['6','Cancellation policy'],
              ['7','Reviews'],
              ['8','Prohibited conduct'],
              ['9','Intellectual property'],
              ['10','Liability'],
              ['11','Termination'],
              ['12','Governing law'],
            ].map(([n,t]) => (
              <a key={n} href={`#section-${n}`} style={{ fontSize:13, color:T.sage, textDecoration:'none', padding:'4px 0' }}
                onMouseEnter={e=>e.target.style.color=T.forest}
                onMouseLeave={e=>e.target.style.color=T.sage}>
                {n}. {t}
              </a>
            ))}
          </div>
        </div>

        {/* Important notice */}
        <div style={{ background:'#fff8e8', borderRadius:12, padding:'18px 22px', marginBottom:36, border:'1px solid #f0d890' }}>
          <div style={{ fontSize:13, color:'#a06010', lineHeight:1.8 }}>
            <strong>Important:</strong> These Terms of Service constitute a legally binding agreement between you and The Eden App LTD. If you do not agree to these terms, please do not use Eden. These terms were last updated on {lastUpdated} and supersede all previous versions.
          </div>
        </div>

        {[
          {
            id:'1',
            title:'About Eden',
            content:(
              <>
                <P>Eden is a UK-based online beauty and wellness marketplace operated by <strong>The Eden App LTD</strong>, a company registered in England and Wales (referred to as "Eden", "we", "us" or "our").</P>
                <InfoBox>
                  <strong>Company:</strong> The Eden App LTD<br/>
                  <strong>Website:</strong> theedenappltd.com<br/>
                  <strong>Contact:</strong> <a href="mailto:hello@theedenappltd.com" style={{ color:T.sage }}>hello@theedenappltd.com</a><br/>
                  <strong>Registered in:</strong> England and Wales
                </InfoBox>
                <P>Eden provides a platform that connects customers with beauty and wellness businesses ("salons") across the United Kingdom. Eden acts as an <strong>introduction and booking agent</strong> — we facilitate the booking but the contract for the actual treatment or service is between the customer and the salon directly.</P>
                <P>Eden is not a beauty or wellness service provider. We do not employ stylists, therapists or any beauty professionals. All treatments are provided by independent salon businesses listed on our platform.</P>
              </>
            )
          },
          {
            id:'2',
            title:'Acceptance of Terms',
            content:(
              <>
                <P>By accessing or using Eden — whether as a customer, a business owner, or a visitor — you confirm that:</P>
                <BulletList items={[
                  'You are at least 18 years old, or have the consent of a parent or guardian if aged 13–17',
                  'You have read, understood and agree to be bound by these Terms of Service',
                  'You have read and understood our Privacy Policy',
                  'You have the legal capacity to enter into a binding contract',
                  'You will use Eden only for lawful purposes and in accordance with these terms',
                ]}/>
                <P>We reserve the right to update these terms at any time. We will notify registered users of material changes by email at least 30 days before they take effect. Continued use of Eden after changes constitutes acceptance of the updated terms.</P>
              </>
            )
          },
          {
            id:'3',
            title:'Customer Terms',
            content:(
              <>
                <SubHeading>3.1 Your account</SubHeading>
                <P>You may browse Eden without creating an account. To make bookings you will need to provide your name, email address and optionally a mobile number. You are responsible for ensuring your contact details are accurate and up to date.</P>
                <SubHeading>3.2 Accuracy of information</SubHeading>
                <P>You agree to provide accurate and truthful information when making a booking, including any relevant health information, allergies or contraindications that may affect your treatment. Eden and the salon cannot be held responsible for adverse outcomes resulting from information you failed to disclose.</P>
                <SubHeading>3.3 Your relationship with salons</SubHeading>
                <P>When you book through Eden, you enter into a direct contract with the salon for the provision of the treatment. Eden is not a party to that contract. Any disputes about the quality of treatment should be raised directly with the salon in the first instance.</P>
                <SubHeading>3.4 Appropriate use</SubHeading>
                <P>You agree not to make bookings you do not intend to keep, submit false reviews, or use Eden to harass or abuse salon staff. Eden reserves the right to suspend accounts that misuse the platform.</P>
              </>
            )
          },
          {
            id:'4',
            title:'Business Owner Terms',
            content:(
              <>
                <SubHeading>4.1 Listing requirements</SubHeading>
                <P>To list your business on Eden you must:</P>
                <BulletList items={[
                  'Be a legitimate, legally registered business or sole trader operating in the UK',
                  'Hold all relevant licences, insurance and qualifications required by law for the treatments you offer',
                  'Provide accurate information about your business, services, prices and location',
                  'Comply with all applicable UK consumer protection, health and safety, and equality legislation',
                  'For aesthetics clinics offering prescription-only treatments — be registered with the CQC or equivalent regulatory body',
                ]}/>
                <SubHeading>4.2 Your listing</SubHeading>
                <P>You are responsible for keeping your listing accurate and up to date, including service prices, availability and opening hours. Misleading pricing or false claims in your listing may result in immediate removal from Eden.</P>
                <SubHeading>4.3 Responding to bookings</SubHeading>
                <P>You agree to honour confirmed bookings made through Eden. Repeatedly cancelling confirmed bookings without good reason may result in your listing being suspended or removed.</P>
                <SubHeading>4.4 Eden's role</SubHeading>
                <P>Eden provides a platform and booking infrastructure. We do not supervise, direct or control the treatments you provide. You remain solely responsible for the safety, quality and legality of all services you offer.</P>
                <SubHeading>4.5 Subscription plans</SubHeading>
                <P>Subscription fees are billed monthly in advance. Plans auto-renew unless cancelled at least 24 hours before the renewal date. No refunds are given for partial months. You may upgrade, downgrade or cancel your plan at any time from your dashboard.</P>
                <SubHeading>4.6 Commission</SubHeading>
                <P>Eden charges a platform commission on bookings processed through Eden. The current commission rate is displayed on your dashboard and in your plan details. Eden reserves the right to adjust commission rates with 30 days' notice to business owners.</P>
              </>
            )
          },
          {
            id:'5',
            title:'Bookings and Payments',
            content:(
              <>
                <SubHeading>5.1 Booking confirmation</SubHeading>
                <P>A booking is confirmed when you receive a confirmation email from Eden. Until that email is received, your booking is not guaranteed. Eden reserves the right to cancel a booking if a salon becomes unavailable, with a full refund issued to the customer.</P>
                <SubHeading>5.2 Payments</SubHeading>
                <P>All payments are processed securely by Stripe. By making a payment through Eden you agree to Stripe's terms of service. Eden does not store your payment card details.</P>
                <SubHeading>5.3 Pricing</SubHeading>
                <P>Prices displayed on Eden are set by individual salons and are inclusive of VAT where applicable. Eden is not responsible for pricing errors made by salons, though we will endeavour to resolve these fairly. Eden's platform fee is included within the total price shown at checkout.</P>
                <SubHeading>5.4 Payouts to salons</SubHeading>
                <P>Salon earnings are paid out weekly via Stripe Connect, less Eden's platform commission. Payouts are typically processed every Monday and arrive within 2–3 business days. Eden reserves the right to withhold payouts where there is a reasonable suspicion of fraud or a dispute in progress.</P>
              </>
            )
          },
          {
            id:'6',
            title:'Cancellation Policy',
            content:(
              <>
                <SubHeading>6.1 Customer cancellations</SubHeading>
                <P>Customers may cancel a booking free of charge up to <strong>24 hours before</strong> the scheduled appointment time. Cancellations made within 24 hours of the appointment may be subject to a cancellation fee at the salon's discretion.</P>
                <SubHeading>6.2 Cancellation fees</SubHeading>
                <P>Where a customer cancels within 24 hours and provides a reason, the salon owner has full discretion to apply a cancellation fee of up to <strong>50% of the booking value</strong>. The customer will be notified of the salon's decision by email. Any cancellation fee charged is non-refundable.</P>
                <SubHeading>6.3 No-shows</SubHeading>
                <P>If a customer fails to attend their appointment without prior cancellation (a "no-show"), the salon may charge the full booking amount. Repeated no-shows may result in the customer's Eden account being restricted.</P>
                <SubHeading>6.4 Salon cancellations</SubHeading>
                <P>If a salon cancels a confirmed booking, the customer will receive a full refund within 5–10 business days. Salons that repeatedly cancel confirmed bookings may be suspended from Eden.</P>
                <SubHeading>6.5 Refunds</SubHeading>
                <P>Refunds are processed to the original payment method. Processing times depend on your bank but are typically 5–10 business days. Eden's platform fee is non-refundable except where a booking is cancelled by the salon.</P>
              </>
            )
          },
          {
            id:'7',
            title:'Reviews',
            content:(
              <>
                <P>Eden allows customers to leave reviews of salons they have visited. By submitting a review you agree that:</P>
                <BulletList items={[
                  'Your review is honest, accurate and based on your genuine experience',
                  'You will not submit a review for a business you own, manage or have a financial interest in',
                  'Your review does not contain defamatory, offensive, discriminatory or unlawful content',
                  'Your review does not contain personal information about staff members',
                  'You grant Eden a non-exclusive licence to display your review on the platform',
                ]}/>
                <P>Eden reserves the right to remove reviews that violate these guidelines or that we reasonably believe are fraudulent. We do not edit reviews for content. Salons may report reviews they believe are false or malicious — these will be investigated and removed if found to be in breach of these terms.</P>
                <P>Eden aggregates ratings from verified bookings. Only customers who have completed a booking through Eden may leave a review for that salon.</P>
              </>
            )
          },
          {
            id:'8',
            title:'Prohibited Conduct',
            content:(
              <>
                <P>You agree not to use Eden to:</P>
                <BulletList items={[
                  'Violate any applicable UK or international law or regulation',
                  'Impersonate any person or entity or misrepresent your affiliation with any person or entity',
                  'Submit false, misleading or fraudulent bookings, reviews or business listings',
                  'Scrape, harvest or systematically extract data from Eden without our written permission',
                  'Attempt to gain unauthorised access to any part of Eden or its systems',
                  'Transmit any malware, viruses or malicious code',
                  'Use Eden for any commercial purpose other than as a legitimate beauty business listed on the platform',
                  'Circumvent Eden\'s booking and payment system by arranging bookings off-platform after initial contact through Eden',
                  'Harass, abuse or threaten other users, salon staff or Eden employees',
                  'Post content that is discriminatory, offensive, sexually explicit or promotes illegal activity',
                ]}/>
                <P>Breach of these prohibitions may result in immediate account suspension, removal from the platform, and where appropriate, referral to law enforcement authorities.</P>
              </>
            )
          },
          {
            id:'9',
            title:'Intellectual Property',
            content:(
              <>
                <P>The Eden platform, including its design, code, branding, logos, written content and AI-powered features, is the intellectual property of <strong>The Eden App LTD</strong> and is protected by UK and international copyright, trademark and design laws.</P>
                <P>You may not reproduce, distribute, modify or create derivative works from any part of Eden without our express written permission.</P>
                <SubHeading>Your content</SubHeading>
                <P>By submitting content to Eden — including business listings, photos, service descriptions and reviews — you grant The Eden App LTD a non-exclusive, royalty-free, worldwide licence to use, display and distribute that content on the platform and in our marketing materials.</P>
                <P>You retain ownership of your content and may request its removal at any time by contacting us. You confirm that any content you submit does not infringe the intellectual property rights of any third party.</P>
              </>
            )
          },
          {
            id:'10',
            title:'Limitation of Liability',
            content:(
              <>
                <P>To the fullest extent permitted by UK law, The Eden App LTD's liability to you is limited as follows:</P>
                <SubHeading>10.1 What Eden is not responsible for</SubHeading>
                <BulletList items={[
                  'The quality, safety or outcome of any treatment or service provided by a salon',
                  'Inaccurate information provided by salons in their listings',
                  'Loss or damage arising from your reliance on reviews or ratings on the platform',
                  'Any injury, allergic reaction or adverse outcome from a treatment booked through Eden',
                  'Loss of earnings, business or profits arising from use of the platform',
                  'Temporary unavailability of the platform due to maintenance or technical issues',
                ]}/>
                <SubHeading>10.2 Our liability cap</SubHeading>
                <P>Where Eden is found liable for any loss or damage, our total liability to you shall not exceed the total amount you paid to Eden in the 12 months preceding the claim, or £100, whichever is greater.</P>
                <SubHeading>10.3 Consumer rights</SubHeading>
                <P>Nothing in these terms affects your statutory rights as a consumer under UK law, including your rights under the Consumer Rights Act 2015, the Consumer Contracts Regulations 2013, and the Consumer Protection from Unfair Trading Regulations 2008.</P>
              </>
            )
          },
          {
            id:'11',
            title:'Termination',
            content:(
              <>
                <SubHeading>11.1 By you</SubHeading>
                <P>You may close your Eden account at any time from your account settings or by contacting us at hello@theedenappltd.com. Closing your account does not affect any bookings already confirmed. Business owners who close their account remain liable for any outstanding commission owed to Eden.</P>
                <SubHeading>11.2 By Eden</SubHeading>
                <P>Eden reserves the right to suspend or terminate your access to the platform immediately and without notice if you:</P>
                <BulletList items={[
                  'Breach any provision of these Terms of Service',
                  'Provide false or misleading information',
                  'Engage in fraudulent activity',
                  'Repeatedly fail to honour confirmed bookings (business owners)',
                  'Repeatedly fail to attend booked appointments (customers)',
                  'Use the platform in a way that causes harm to other users or brings Eden into disrepute',
                ]}/>
                <P>On termination, your right to use Eden ceases immediately. We will retain your data as required by law — see our Privacy Policy for details.</P>
              </>
            )
          },
          {
            id:'12',
            title:'Governing Law and Disputes',
            content:(
              <>
                <P>These Terms of Service are governed by the laws of <strong>England and Wales</strong>. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</P>
                <SubHeading>Dispute resolution</SubHeading>
                <P>If you have a complaint about Eden, please contact us first at <a href="mailto:hello@theedenappltd.com" style={{ color:T.sage }}>hello@theedenappltd.com</a>. We aim to resolve all complaints within 10 business days.</P>
                <P>If we cannot resolve your complaint directly, you may refer it to an alternative dispute resolution (ADR) scheme. As a UK-based online marketplace, Eden is subject to the EU Online Dispute Resolution platform for consumers in Northern Ireland: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color:T.sage }}>ec.europa.eu/consumers/odr</a></P>
                <SubHeading>Severability</SubHeading>
                <P>If any provision of these terms is found to be invalid or unenforceable by a court, the remaining provisions will continue in full force and effect.</P>
                <SubHeading>Entire agreement</SubHeading>
                <P>These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and The Eden App LTD regarding your use of Eden and supersede all prior agreements and understandings.</P>
                <InfoBox>
                  <strong>The Eden App LTD</strong><br/>
                  Registered in England and Wales<br/>
                  📧 <a href="mailto:hello@theedenappltd.com" style={{ color:T.sage }}>hello@theedenappltd.com</a><br/>
                  🌐 <a href="https://theedenappltd.com" style={{ color:T.sage }}>theedenappltd.com</a>
                </InfoBox>
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

        {/* Footer CTA */}
        <div style={{ background:T.mint, borderRadius:14, padding:'24px 28px', border:`1px solid ${T.sagePale}`, textAlign:'center' }}>
          <div style={{ fontFamily:F.display, fontSize:18, color:T.forest, marginBottom:8 }}>Questions about these terms?</div>
          <div style={{ fontSize:13, color:T.inkSoft, marginBottom:16 }}>We're happy to explain anything in plain English.</div>
          <a href="mailto:hello@theedenappltd.com">
            <Button variant="primary">Contact Us</Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:T.forestDark, padding:'32px 24px', color:'rgba(255,255,255,0.4)', fontSize:12, textAlign:'center', lineHeight:2 }}>
        <div style={{ fontFamily:F.display, fontSize:18, color:T.white, marginBottom:6 }}>Eden</div>
        <div>© 2026 The Eden App LTD · Registered in England & Wales</div>
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
