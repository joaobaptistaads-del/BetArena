-- Inserir dados de exemplo no BetArena

-- 1. Inserir um jogo (EA FC 26)
INSERT INTO public.games (name, slug, active) VALUES
('EA FC 26', 'ea-fc-26', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Obter o ID do jogo
DO $$
DECLARE
  v_game_id uuid;
  v_organizer_id uuid;
BEGIN
  SELECT id INTO v_game_id FROM public.games WHERE slug = 'ea-fc-26' LIMIT 1;
  
  -- 3. Para demonstração, usar um UUID fixo como organizador
  -- Em produção, você criaria usuários reais via auth
  v_organizer_id := '00000000-0000-0000-0000-000000000001'::uuid;

  -- 4. Inserir campeonatos de exemplo
  INSERT INTO public.tournaments (
    game_id, 
    organizer_id, 
    title, 
    platform, 
    status, 
    entry_fee, 
    currency, 
    max_players, 
    prize_pool,
    winner_pct,
    runnerup_pct,
    organizer_pct,
    platform_pct
  ) VALUES
  (
    v_game_id,
    v_organizer_id,
    '🏆 Torneio Regional PS5 - Eliminatórias',
    'ps5',
    'open',
    50.00,
    'BRL',
    32,
    1600.00,
    0.6,
    0.3,
    0.08,
    0.02
  ),
  (
    v_game_id,
    v_organizer_id,
    '🎮 Copa PC - Fase de Grupos',
    'ps4',
    'ongoing',
    25.00,
    'BRL',
    16,
    400.00,
    0.6,
    0.3,
    0.08,
    0.02
  ),
  (
    v_game_id,
    v_organizer_id,
    '⚡ Pro League Xbox - Início em Breve',
    'xbox',
    'draft',
    75.00,
    'BRL',
    64,
    4800.00,
    0.6,
    0.3,
    0.08,
    0.02
  )
  ON CONFLICT DO NOTHING;

END $$;
