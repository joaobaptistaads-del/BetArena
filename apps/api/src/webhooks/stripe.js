import Stripe from 'stripe';
import { recordHold, upsertPayment } from '../lib/payments.js';
import { recordLoginAudit, detectMultipleAccountsInTournament } from '../lib/antifraud.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
});

export async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return res.status(400).json({ error: 'Webhook secret/signature missing' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};

        await upsertPayment({
          provider: 'stripe',
          externalId: session.id,
          status: 'captured',
          amount: Number(session.amount_total ?? 0) / 100,
          currency: (session.currency || 'usd').toUpperCase(),
          kind: metadata.kind || 'entry_fee',
          userId: metadata.user_id,
          tournamentId: metadata.tournament_id,
        });

        if (metadata.user_id) {
          await recordHold({
            userId: metadata.user_id,
            amount: Number(session.amount_total ?? 0) / 100,
            currency: (session.currency || 'usd').toUpperCase(),
          });

          // Detecção de fraude
          const ipAddress = metadata.ip_address;
          if (ipAddress && metadata.tournament_id) {
            await recordLoginAudit(metadata.user_id, ipAddress, 'stripe_checkout');
            const fraud = await detectMultipleAccountsInTournament(
              metadata.tournament_id,
              metadata.user_id,
              ipAddress
            );
            if (fraud.suspicious) {
              console.warn('Suspicious activity detected:', fraud);
            }
          }
        }
        break;
      }
      case 'payment_intent.succeeded':
        break;
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ error: 'Processing failed' });
  }

  return res.json({ received: true });
}
