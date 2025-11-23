import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';

import produtoRoutes from './routes/produtos.js';
import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import fornecedoresRoutes from './routes/fornecedores.js';
import publicRoutes from './routes/public.js';
import clienteAuthRoutes from './routes/clienteauth.js';
import dashboardRoutes from './routes/dashboard.js';
import vendasRoutes from './routes/vendas.js';
import openApiSpec from './config/scalar.js';

const app = express();
const PORT = process.env.PORT || 2024;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'auth-token', 'auth-token-loja', 'auth-token-cliente']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce')
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => console.error('❌ Erro no Mongo:', err));

app.use('/produtos', produtoRoutes);
app.use('/api/loja', authRoutes);
app.use('/clientes', clientesRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/public', publicRoutes);
app.use('/api/cliente', clienteAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/vendas', vendasRoutes);

app.get('/', (req, res) => {
  res.send('API E-Com+ Rodando! 🚀');
});

app.use(
  '/docs',
  apiReference({
    spec: {
      content: openApiSpec,
    },
  }),
);

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

export default app;