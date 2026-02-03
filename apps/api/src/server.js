import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { handleStripeWebhook } from './webhooks/stripe.js';
import { handlePayPalWebhook } from './webhooks/paypal.js';
import { handleMercadoPagoWebhook } from './webhooks/mercadopago.js';
import { settleTournamentPayouts } from './lib/payments.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: frontendOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.post('/webhooks/paypal', express.json({ limit: '1mb' }), handlePayPalWebhook);
app.post('/webhooks/mercadopago', express.json({ limit: '1mb' }), handleMercadoPagoWebhook);

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/admin/tournaments/:id/settle', async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || req.headers['x-admin-key'] !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await settleTournamentPayouts({
      tournamentId: req.params.id,
      winnerId: req.body.winnerId,
      runnerupId: req.body.runnerupId,
    });

    return res.json({ status: 'settled', ...result });
  } catch (error) {
    return res.status(400).json({ error: 'Settlement failed' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.use((err, _req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
