import { supabaseAdmin } from './supabase.js';

/**
 * Registra login/acesso para detecção de múltiplas contas
 */
export async function recordLoginAudit(userId, ipAddress, userAgent) {
  const { error } = await supabaseAdmin.from('login_audit').insert({
    user_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  if (error) {
    console.error('Error recording login audit:', error);
  }
}

/**
 * Detecta múltiplas contas do mesmo IP em torneios pagos
 */
export async function detectMultipleAccountsInTournament(tournamentId, userId, ipAddress) {
  if (!ipAddress) {
    return { suspicious: false };
  }

  // Busca outros participantes do torneio com o mesmo IP
  const { data: participants } = await supabaseAdmin
    .from('tournament_participants')
    .select('user_id')
    .eq('tournament_id', tournamentId)
    .neq('user_id', userId);

  if (!participants || participants.length === 0) {
    return { suspicious: false };
  }

  const userIds = participants.map((p) => p.user_id);

  // Verifica login_audit para esses usuários
  const { data: audits } = await supabaseAdmin
    .from('login_audit')
    .select('user_id')
    .eq('ip_address', ipAddress)
    .in('user_id', userIds);

  if (audits && audits.length > 0) {
    return {
      suspicious: true,
      reason: 'Multiple accounts from same IP detected',
      affectedUsers: audits.map((a) => a.user_id),
    };
  }

  return { suspicious: false };
}

/**
 * Valida taxa do torneio vs pool arrecadado
 */
export function validateTournamentFees(entryFee, participantCount, expectedPool) {
  const calculatedPool = entryFee * participantCount;
  const tolerance = 0.01; // 1% de tolerância

  if (Math.abs(calculatedPool - expectedPool) > calculatedPool * tolerance) {
    return {
      valid: false,
      reason: 'Pool mismatch',
      calculated: calculatedPool,
      expected: expectedPool,
    };
  }

  return { valid: true };
}
