import Link from 'next/link';

export default function LandingPage() {

  return (
    <main style={{ background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>ARENA</div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#" style={{ fontSize: '0.9rem', textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Comunidade</a>
          <a href="#" style={{ fontSize: '0.9rem', textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Desafios</a>
          <a href="#" style={{ fontSize: '0.9rem', textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Torneios</a>
          <a href="/login" style={{ fontSize: '0.9rem', fontWeight: 700, padding: '10px 30px', background: '#fff', color: '#000', textDecoration: 'none', borderRadius: '4px', cursor: 'pointer' }}>ENTRAR</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ height: '80vh', background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), linear-gradient(180deg, #1a1a1a 0%, #000 100%)', display: 'flex', alignItems: 'center', padding: '0 50px', position: 'relative' }}>
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>COMPETIÇÃO EM TEMPO REAL</div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '30px' }}>Desafie seus amigos. Conquiste prêmios.</h1>
          <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '40px', lineHeight: 1.6, maxWidth: '500px' }}>Conecte sua PSN, Xbox ou conta Steam. Crie torneios. Desafie amigos. Compita por prêmios reais.</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="/register" style={{ padding: '15px 40px', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 700, borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', display: 'inline-block' }}>COMEÇAR AGORA</a>
            <a href="#features" style={{ padding: '15px 40px', background: 'transparent', color: '#fff', textDecoration: 'none', fontWeight: 700, borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', border: '2px solid #fff', display: 'inline-block' }}>SAIBA MAIS</a>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg, rgba(100,200,255,0.1) 0%, rgba(0,0,0,0) 100%)' }} />
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 50px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '60px', textAlign: 'center' }}>Como funciona</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '80px' }}>
            {[
              { num: '1', title: 'CONECTE SUA CONTA', desc: 'PSN, Xbox, Steam. Suas estatísticas reais sincronizadas.' },
              { num: '2', title: 'DESAFIE AMIGOS', desc: 'Crie desafios 1v1 ou junte-se a campeonatos comunitários.' },
              { num: '3', title: 'GANHE PRÊMIOS', desc: 'Compita por prêmios reais. Saque direto na sua conta.' },
            ].map((item, i) => (
              <div key={i} style={{ borderLeft: '3px solid #fff', paddingLeft: '30px' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#666', marginBottom: '15px' }}>{item.num}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#999', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div style={{ background: '#111', padding: '40px 50px', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
            {[
              { num: '2.5M+', label: 'Jogadores ativos' },
              { num: '500K+', label: 'Partidas/mês' },
              { num: '150+', label: 'Jogos suportados' },
              { num: 'R$ 100M+', label: 'Em prêmios' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>{stat.num}</div>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODOS DE JOGO */}
      <section style={{ padding: '80px 50px', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '60px', textAlign: 'center' }}>Modos de competição</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
            {[
              { title: 'DESAFIO 1v1', desc: 'Desafie amigos em partidas rápidas. Apostas customizáveis. Resultados instantâneos.' },
              { title: 'TORNEIOS ABERTOS', desc: 'Qualquer um cria. Qualquer um participa. A plataforma apenas hospeda e valida.' },
              { title: 'RANKEDS', desc: 'Sistema de rating como FACEIT. Suba de nível competindo. Recompensas mensais.' },
              { title: 'GRUPOS PRIVADOS', desc: 'Crie ligas entre amigos. Competição semanal. Tabelas de posição.' },
            ].map((modo, i) => (
              <div key={i} style={{ background: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #222' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>{modo.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#999', lineHeight: 1.6 }}>{modo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATAFORMAS SUPORTADAS */}
      <section style={{ padding: '80px 50px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '60px', textAlign: 'center' }}>Suportamos suas contas</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {['PlayStation Network (PSN)', 'Xbox Live', 'Steam', 'Epic Games'].map((platform, i) => (
              <div key={i} style={{ background: '#111', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #222', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.background = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.background = '#111';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎮</div>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{platform}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 50px', background: '#000', textAlign: 'center', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>Pronto para competir?</h2>
        <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '40px' }}>Junte-se a milhões de jogadores competindo por prêmios reais.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a href="/register" style={{ padding: '15px 40px', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 700, borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', display: 'inline-block' }}>CRIAR CONTA</a>
          <a href="/login" style={{ padding: '15px 40px', background: 'transparent', color: '#fff', textDecoration: 'none', fontWeight: 700, borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', border: '2px solid #fff', display: 'inline-block' }}>JÁ TENHO CONTA</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 50px', background: '#0a0a0a', borderTop: '1px solid #222', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
        <p>© 2026 ARENA. Todos os direitos reservados. | Plataforma de competição em tempo real.</p>
      </footer>
    </main>
  );
}

