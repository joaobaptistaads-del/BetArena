import { recordHold, upsertPayment, verifyMercadoPagoSignature } from '../lib/payments.js';
import { recordLoginAudit, detectMultipleAccountsInTournament } from '../lib/antifraud.js';

const fetchPayment = async ({ accessToken, paymentId }) => {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Mercado Pago fetch failed');
  }

  return response.json();
};

export async function handleMercadoPagoWebhook(req, res) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!accessToken) {
    return res.status(400).json({ error: 'MERCADOPAGO_ACCESS_TOKEN not configured' });
  }

  if (!verifyMercadoPagoSignature({
    signature,
    requestId,
    dataId: req.body?.data?.id,
    secret,
  })) {
    return res.status(400).json({ error: 'Invalid Mercado Pago signature' });
  }

  try {
    const event = req.body;

    if (event.type === 'payment') {
      const payment = await fetchPayment({ accessToken, paymentId: event.data.id });
      const metadata = payment.metadata || {};
      const amount = Number(payment.transaction_amount || 0);
      const currency = payment.currency_id || 'USD';

      await upsertPayment({
        provider: 'mercadopago',
        externalId: String(payment.id),
        status: payment.status === 'approved' ? 'captured' : 'pending',
        amount,
        currency,
        kind: metadata.kind || 'entry_fee',
        userId: metadata.user_id,
        tournamentId: metadata.tournament_id,
      });

      if (payment.status === 'approved' && metadata.user_id) {
        await recordHold({
          userId: metadata.user_id,
          amount,
          currency,
        });

        // Detecção de fraude
        const ipAddress = metadata.ip_address;
        if (ipAddress && metadata.tournament_id) {
          await recordLoginAudit(metadata.user_id, ipAddress, 'mercadopago_payment');
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
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(400).json({ error: 'Mercado Pago webhook error' });
  }
}
