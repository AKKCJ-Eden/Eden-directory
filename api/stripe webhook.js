// Eden - Stripe Webhook Handler
// Activates subscriptions, confirms paid bookings, downgrades cancelled plans.

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

async function rawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  let event
  try {
    const body = await rawBody(req)
    const sig = req.headers['stripe-signature']
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    switch (event.type) {

      // Salon paid for a subscription OR customer paid for a booking
      case 'checkout.session.completed': {
        const session = event.data.object

        if (session.mode === 'subscription') {
          const { salonId, plan } = session.metadata || {}
          if (salonId && plan) {
            await supabase.from('salons').update({
              plan: plan,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            }).eq('id', salonId)
          }
        }

        if (session.mode === 'payment') {
          const { bookingId } = session.metadata || {}
          if (bookingId) {
            await supabase.from('bookings').update({
              status: 'confirmed',
              payment_intent_id: session.payment_intent,
            }).eq('id', bookingId)
          }
        }
        break
      }

      // Salon cancelled their subscription - downgrade to free
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await supabase.from('salons').update({
          plan: 'free',
          stripe_subscription_id: null,
        }).eq('stripe_subscription_id', sub.id)
        break
      }

      // Subscription payment failed - flag for admin attention
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        if (invoice.subscription) {
          await supabase.from('salons').update({
            status: 'payment_overdue',
          }).eq('stripe_subscription_id', invoice.subscription)
        }
        break
      }
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
