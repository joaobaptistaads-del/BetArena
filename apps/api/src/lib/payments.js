import crypto from 'node:crypto';
import { supabaseAdmin } from './supabase.js';

export const PLATFORM_DEFAULT_PCT = 0.2;

export const assertEnv = (value, name) => {
  if (!value) {
    throw new Error(`${name} not configured`);
  }
};

export const upsertPayment = async ({
  provider,
  externalId,
  status,
  amount,
  currency,
  kind,
  userId,
  tournamentId,
}) => {
  const { error } = await supabaseAdmin.from('payments').upsert(
    {
      provider,
      external_id: externalId,
      status,
      amount,
      currency,
      kind,
      user_id: userId,
      tournament_id: tournamentId,
    },
    { onConflict: 'external_id' }
  );

  if (error) {
    throw error;
  }
};

export const recordHold = async ({ userId, amount, currency }) => {
  const { data: wallet } = await supabaseAdmin
    .from('wallets')
    .select('id')
    .eq('user_id', userId)
    .eq('currency', currency)
    .maybeSingle();

  let walletId = wallet?.id;

  if (!walletId) {
    const { data, error } = await supabaseAdmin
      .from('wallets')
      .insert({ user_id: userId, currency })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    walletId = data.id;
  }

  const { error: txError } = await supabaseAdmin.from('wallet_transactions').insert({
    wallet_id: walletId,
    type: 'hold',
    amount,
    metadata: { reason: 'escrow_hold' },
  });

  if (txError) {
    throw txError;
  }
};

export const settleTournamentPayouts = async ({ tournamentId, winnerId, runnerupId }) => {
  const { data: tournament, error } = await supabaseAdmin
    .from('tournaments')
    .select('id, organizer_id, winner_pct, runnerup_pct, organizer_pct, platform_pct, currency')
    .eq('id', tournamentId)
    .single();

  if (error || !tournament) {
    throw error || new Error('Tournament not found');
  }

  const { data: payments, error: paymentsError } = await supabaseAdmin
    .from('payments')
    .select('amount')
    .eq('tournament_id', tournamentId)
    .eq('status', 'captured')
    .in('kind', ['entry_fee', 'bet']);

  if (paymentsError) {
    throw paymentsError;
  }

  const total = (payments ?? []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const platformPct = Number(tournament.platform_pct ?? PLATFORM_DEFAULT_PCT);
  const prizePool = total * (1 - platformPct);

  const payouts = [
    {
      user_id: winnerId,
      amount: prizePool * Number(tournament.winner_pct ?? 0.6),
    },
    {
      user_id: runnerupId,
      amount: prizePool * Number(tournament.runnerup_pct ?? 0.3),
    },
    {
      user_id: tournament.organizer_id,
      amount: prizePool * Number(tournament.organizer_pct ?? 0.1),
    },
  ];

  const { error: payoutError } = await supabaseAdmin.from('payouts').insert(
    payouts.map((p) => ({
      tournament_id: tournamentId,
      user_id: p.user_id,
      amount: p.amount,
      status: 'pending',
    }))
  );

  if (payoutError) {
    throw payoutError;
  }

  return { total, prizePool, payouts };
};

export const verifyMercadoPagoSignature = ({ signature, requestId, dataId, secret }) => {
  if (!signature || !requestId || !dataId || !secret) {
    return false;
  }

  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  if (!parts.ts || !parts.v1) {
    return false;
  }

  const payload = `${dataId}:${requestId}:${parts.ts}`;
  const digest = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(digest));
};
