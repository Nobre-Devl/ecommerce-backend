require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const produtoRoutes = require('./routes/produtos');
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const fornecedoresRoutes = require('./routes/fornecedores');
const publicRoutes = require('./routes/public');
const clienteAuthRoutes = require('./routes/clienteauth');
const dashboardRoutes = require('./routes/dashboard');
const vendasRoutes = require('./routes/vendas');
const despesasRoutes = require('./routes/despesas');

const app = express();
const PORT = process.env.PORT || 2024;

const swaggerDocument = require('./config/scalar');

const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js'
  ]
};

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

const MONGO_URI = 'mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce?retryWrites=true&w=majority';

const connectDBMiddleware = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    await mongoose.connect(MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Nova conexão MongoDB estabelecida');
    next();
  } catch (error) {
    console.error('❌ Erro Crítico no Middleware de DB:', error);
    res.status(500).json({ error: 'Erro de conexão com o banco de dados', details: error.message });
  }
};

app.use(connectDBMiddleware);

app.get('/status', async (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'Desconectado', 1: 'Conectado', 2: 'Conectando', 3: 'Desconectando' };

  try {
    if (state === 1) {
      await mongoose.connection.db.admin().ping();
      return res.json({ status: 'OK', mongoState: states[state], message: 'Banco respondendo.' });
    } else {
      return res.status(500).json({ status: 'ERRO', mongoState: states[state] });
    }
  } catch (error) {
    return res.status(500).json({ status: 'ERRO CRÍTICO', error: error.message });
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
app.use('/despesas', despesasRoutes);

app.get('/', (req, res) => {
  res.send('API Rodando. Acesse /status para testar o banco ou /docs para documentação.');
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));

module.exports = app;