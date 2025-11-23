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

const MONGO_URI = 'mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce?retryWrites=true&w=majority';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI, {
    family: 4, 
    serverSelectionTimeoutMS: 5000 
  });
};

connectDB().catch(err => console.error('Erro inicial:', err));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/produtos', produtoRoutes);      
app.use('/api/loja', authRoutes);         
app.use('/clientes', clientesRoutes);    
app.use('/fornecedores', fornecedoresRoutes);
app.use('/public', publicRoutes);        
app.use('/api/cliente', clienteAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/vendas', vendasRoutes);

app.get('/status', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, { family: 4, serverSelectionTimeoutMS: 5000 });
    }
    
    res.json({
      status: 'OK',
      message: 'MongoDB Conectado com Sucesso!',
      host: mongoose.connection.host
    });

  } catch (error) {
    res.status(500).json({
      status: 'ERRO FATAL DE CONEXÃO',
      erro_mensagem: error.message,
      erro_codigo: error.code,
      erro_nome: error.name
    });
  }
});

app.get('/', (req, res) => {
    res.send('API Rodando. Acesse /status para diagnosticar o banco.');
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));

module.exports = app;