import { recordHold, upsertPayment } from '../lib/payments.js';
import { recordLoginAudit, detectMultipleAccountsInTournament } from '../lib/antifraud.js';

const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const env = process.env.PAYPAL_ENV || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials missing');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenUrl = env === 'live'
    ? 'https://api-m.paypal.com/v1/oauth2/token'
    : 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('PayPal auth failed');
  }

  const data = await response.json();
  return data.access_token;
};

const verifyPayPalWebhook = async (req) => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const env = process.env.PAYPAL_ENV || 'sandbox';

  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID not configured');
  }

  const accessToken = await getPayPalAccessToken();
  const verifyUrl = env === 'live'
    ? 'https://api-m.paypal.com/v1/notifications/verify-webhook-signature'
    : 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature';

  const response = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: req.body,
    }),
  });

  if (!response.ok) {
    throw new Error('PayPal signature validation failed');
  }

  const data = await response.json();
  return data.verification_status === 'SUCCESS';
};

export async function handlePayPalWebhook(req, res) {
  try {
    const verified = await verifyPayPalWebhook(req);
    if (!verified) {
      return res.status(400).json({ error: 'Invalid PayPal signature' });
    }

    const event = req.body;

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED': {
        const resource = event.resource;
        const metadata = resource.custom_id ? JSON.parse(resource.custom_id) : {};
        const purchaseUnit = resource.purchase_units?.[0];
        const amount = Number(purchaseUnit?.amount?.value || 0);
        const currency = purchaseUnit?.amount?.currency_code || 'USD';

        await upsertPayment({
          provider: 'paypal',
          externalId: resource.id,
          status: 'captured',
          amount,
          currency,
          kind: metadata.kind || 'entry_fee',
          userId: metadata.user_id,
          tournamentId: metadata.tournament_id,
        });

        if (metadata.user_id) {
          await recordHold({
            userId: metadata.user_id,
            amount,
            currency,
          });

          // Detecção de fraude
          const ipAddress = metadata.ip_address;
          if (ipAddress && metadata.tournament_id) {
            await recordLoginAudit(metadata.user_id, ipAddress, 'paypal_checkout');
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
      default:
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(400).json({ error: 'PayPal webhook error' });
  }
}
