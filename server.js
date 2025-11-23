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
  info: {
    title: 'API E-Com+',
    version: '1.0.0',
    description: 'Documentação da API do projeto de E-commerce'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Servidor Local'
    },
    {
      url: 'https://ecommerce-backend-green-iota.vercel.app/', 
      description: 'Produção (Vercel)'
    }
  ]
};

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'auth-token', 'auth-token-loja', 'auth-token-cliente']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose
  .connect('mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce') 
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => console.error('❌ Erro no Mongo:', err));

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCssUrl: CSS_URL
}));

app.use('/produtos', produtoRoutes);      
app.use('/api/loja', authRoutes);         
app.use('/clientes', clientesRoutes);    
app.use('/fornecedores', fornecedoresRoutes);
app.use('/public', publicRoutes);        
app.use('/api/cliente', clienteAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/vendas', vendasRoutes);

app.get('/', (req, res) => {
    res.send('API E-Com+ Rodando! 🚀 Acesse /docs para ver a documentação.');
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

module.exports = app;