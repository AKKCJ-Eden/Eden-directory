// Eden - Email Notification System (Resend)
// Handles all transactional emails: confirmations, reminders, cancellations, fees

const FROM = process.env.RESEND_FROM || 'Eden <onboarding@resend.dev>'

const wrap = (title, body) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:#1a3a24;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
      <div style="font-size:28px;margin-bottom:6px;">&#127807;</div>
      <div style="color:#ffffff;font-size:24px;letter-spacing:1px;">Eden</div>
      <div style="color:#a8c4ae;font-size:11px;letter-spacing:3px;margin-top:4px;">THE UK BEAUTY DIRECTORY</div>
    </div>
    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:32px;">
      <h2 style="color:#1a3a24;font-size:20px;margin:0 0 16px;">${title}</h2>
      ${body}
      <div style="border-top:1px solid #e8e4dc;margin-top:28px;padding-top:18px;font-size:11px;color:#999;line-height:1.7;">
        The Eden App LTD &middot; theedenappltd.com<br/>
        Questions? Reply to this email or contact hello@theedenappltd.com
      </div>
    </div>
  </div>
</body>
</html>`

const row = (label, value) => `
  <tr>
    <td style="padding:8px 0;font-size:12px;color:#888;width:120px;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#222;font-weight:bold;">${value}</td>
  </tr>`

const detailsTable = (d) => `
  <table style="width:100%;background:#f4f8f4;border-radius:10px;padding:8px 16px;margin:16px 0;border-collapse:separate;">
    ${d.salonName ? row('Salon', d.salonName) : ''}
    ${d.serviceName ? row('Treatment', d.serviceName) : ''}
    ${d.date ? row('Date', d.date) : ''}
    ${d.time ? row('Time', d.time) : ''}
    ${d.duration ? row('Duration', d.duration + ' minutes') : ''}
    ${d.amount ? row('Price', '&pound;' + Number(d.amount).toFixed(2)) : ''}
    ${d.customerName ? row('Customer', d.customerName) : ''}
    ${d.customerPhone ? row('Phone', d.customerPhone) : ''}
  </table>`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const KEY = process.env.RESEND_API_KEY
  if (!KEY) return res.status(500).json({ error: 'Email service not configured' })

  const { type, to, data = {} } = req.body || {}
  if (!type || !to) return res.status(400).json({ error: 'Missing type or recipient' })

  const templates = {
    booking_confirmation: {
      subject: `Booking confirmed at ${data.salonName || 'your salon'} \u2014 Eden`,
      html: wrap('Your booking is confirmed!', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, great news \u2014 your appointment is booked. Here are your details:</p>
        ${detailsTable(data)}
        <p style="font-size:13px;color:#666;line-height:1.7;">Need to change anything? You can cancel free of charge up to 24 hours before your appointment. Late cancellations may incur a fee of up to 50% at the salon's discretion.</p>
      `),
    },
    new_booking_salon: {
      subject: `New booking: ${data.serviceName || 'treatment'} on ${data.date || ''} \u2014 Eden`,
      html: wrap('You have a new booking!', `
        <p style="font-size:14px;color:#444;line-height:1.7;">A new appointment has just been booked through Eden:</p>
        ${detailsTable(data)}
        <p style="font-size:13px;color:#666;line-height:1.7;">Manage this booking in your dashboard at theedenappltd.com/dashboard</p>
      `),
    },
    booking_reminder: {
      subject: `Reminder: your appointment at ${data.salonName || 'your salon'} \u2014 Eden`,
      html: wrap('Your appointment is coming up', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, just a friendly reminder about your upcoming appointment:</p>
        ${detailsTable(data)}
        <p style="font-size:13px;color:#666;line-height:1.7;">We look forward to seeing you. If you can no longer make it, please cancel as soon as possible.</p>
      `),
    },
    booking_rescheduled: {
      subject: `Your booking has been rescheduled \u2014 Eden`,
      html: wrap('Booking rescheduled', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, your appointment at ${data.salonName || 'your salon'} has been rescheduled. Your new details:</p>
        ${detailsTable(data)}
        <p style="font-size:13px;color:#666;line-height:1.7;">If this new time does not work for you, please contact the salon or manage your booking on Eden.</p>
      `),
    },
    booking_cancelled: {
      subject: `Booking cancelled \u2014 Eden`,
      html: wrap('Booking cancelled', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, your appointment at ${data.salonName || 'your salon'} has been cancelled:</p>
        ${detailsTable(data)}
        <p style="font-size:13px;color:#666;line-height:1.7;">We hope to see you again soon. Browse hundreds of trusted venues at theedenappltd.com</p>
      `),
    },
    fee_applied: {
      subject: `Late cancellation fee applied \u2014 Eden`,
      html: wrap('Cancellation fee applied', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, because your booking at ${data.salonName || 'the salon'} was cancelled within 24 hours of the appointment, the salon has applied a late cancellation fee of <strong>&pound;${Number(data.fee || 0).toFixed(2)}</strong> (50% of the treatment price).</p>
        ${detailsTable(data)}
        <p style="font-size:13px;color:#666;line-height:1.7;">This is in line with the cancellation policy agreed at the time of booking. If you believe this is a mistake, please contact hello@theedenappltd.com</p>
      `),
    },
    fee_waived: {
      subject: `Good news \u2014 your cancellation fee was waived \u2014 Eden`,
      html: wrap('Cancellation fee waived', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, good news \u2014 ${data.salonName || 'the salon'} has reviewed your late cancellation and decided to waive the fee. No charge will be made.</p>
        <p style="font-size:13px;color:#666;line-height:1.7;">We hope to see you again soon at theedenappltd.com</p>
      `),
    },
    welcome: {
      subject: `Welcome to Eden \u2014 find, book, feel beautiful`,
      html: wrap('Welcome to Eden!', `
        <p style="font-size:14px;color:#444;line-height:1.7;">Hi ${data.customerName || 'there'}, your Eden account is ready. Discover the UK's most trusted salons, barbers, spas and clinics \u2014 and book instantly.</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="https://theedenappltd.com" style="background:#1a3a24;color:#fff;padding:12px 32px;border-radius:30px;text-decoration:none;font-size:14px;">Start Exploring</a>
        </p>
      `),
    },
  }

  const t = templates[type]
  if (!t) return res.status(400).json({ error: 'Unknown email type: ' + type })

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to], subject: t.subject, html: t.html }),
    })
    const result = await resp.json()
    if (!resp.ok) return res.status(500).json({ error: result.message || 'Email send failed' })
    return res.status(200).json({ success: true, id: result.id })
  } catch (err) {
    return res.status(500).json({ error: 'Email send failed: ' + err.message })
  }
}
