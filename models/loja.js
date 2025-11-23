import mongoose from 'mongoose';

const lojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  nomeFantasia: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true
  },
  telefone: {
    type: String
  },
  imagem: {
    type: String,
  },
  endereco: {
    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String
  }
});

const Loja = mongoose.models.Loja || mongoose.model('Loja', lojaSchema);

export default Loja;