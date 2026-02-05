const http = require('http');

const server = http.createServer((req, res) => {
  console.log('📥 Request recebido:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Teste - Servidor Node funcionando!</h1><p>Se vês isto, Node.js está OK.</p>');
});

server.listen(5555, '127.0.0.1', () => {
  console.log('✅ Servidor teste rodando em http://127.0.0.1:5555');
  console.log('Pressiona Ctrl+C para parar');
});

server.on('error', (err) => {
  console.error('❌ Erro no servidor:', err);
});

// Keep alive
setInterval(() => {
  console.log('💓 Servidor ainda ativo...');
}, 5000);
