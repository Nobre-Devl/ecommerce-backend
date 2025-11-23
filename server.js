import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import produtoRoutes from './routes/produtos.js';
import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import fornecedoresRoutes from './routes/fornecedores.js';
import publicRoutes from './routes/public.js';
import clienteAuthRoutes from './routes/clienteauth.js';
import dashboardRoutes from './routes/dashboard.js';
import vendasRoutes from './routes/vendas.js';

const app = express();
const PORT = process.env.PORT || 2024;

const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'API E-Com+', version: '1.0.0' },
  servers: [
    { url: 'https://ecommerce-backend-green-iota.vercel.app', description: 'Vercel' },
    { url: `http://localhost:${PORT}`, description: 'Local' }
  ]
};

const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js'
  ]
};

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

const MONGO_URI = 'mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      family: 4, // Força IPv4
    });
    console.log('✅ MongoDB Conectado!');
  } catch (err) {
    console.error('❌ Erro de Conexão:', err);
  }
};
connectDB();
app.get('/status', async (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'Desconectado', 1: 'Conectado', 2: 'Conectando', 3: 'Desconectando' };

  try {
    if (state === 1) {
      await mongoose.connection.db.admin().ping();
      return res.json({
        status: 'OK',
        mongoState: states[state],
        message: 'Banco respondendo corretamente.'
      });
    } else {
      return res.status(500).json({
        status: 'ERRO',
        mongoState: states[state],
        message: 'Mongoose não está conectado.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'ERRO CRÍTICO',
      error: error.message,
      detail: error
    });
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/produtos', produtoRoutes);
app.use('/api/loja', authRoutes);
app.use('/clientes', clientesRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/public', publicRoutes);
app.use('/api/cliente', clienteAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/vendas', vendasRoutes);

app.get('/', (req, res) => {
  res.send('API Rodando. Acesse /status para testar o banco ou /docs para documentação.');
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));

export default app;