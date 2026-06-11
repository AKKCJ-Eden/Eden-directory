// Eden - Subscription Checkout (Growth £59/mo, Premium £119/mo)
// Creates a Stripe Checkout session. The webhook activates the plan on payment.

import Stripe from 'stripe'

const PLANS = {
  standard: { name: 'Eden Growth Plan',  amount: 5900  },
  premium:  { name: 'Eden Premium Plan', amount: 11900 },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Payments not configured yet' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { plan, salonId, email } = req.body || {}

  const selected = PLANS[plan]
  if (!selected) return res.status(400).json({ error: 'Invalid plan' })
  if (!salonId)  return res.status(400).json({ error: 'Missing salon ID' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: selected.name,
            description: 'Monthly subscription - The Eden App LTD',
          },
          unit_amount: selected.amount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      metadata: { salonId, plan },
      subscription_data: { metadata: { salonId, plan } },
      success_url: 'https://theedenappltd.com/dashboard?upgraded=' + plan,
      cancel_url: 'https://theedenappltd.com/dashboard',
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
