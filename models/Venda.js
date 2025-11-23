import mongoose from 'mongoose';

const VendaSchema = new mongoose.Schema({
  numero: { type: String },
  data: { type: Date, default: Date.now },
  vendedor: { type: String, required: true },

  cliente: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
    nome: String,
    cpf: String
  },

  itens: [{
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
    nome: String,
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],

  valorTotal: { type: Number, required: true },
  formaPagamento: { type: String, default: 'Dinheiro' },
  observacoes: String,

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja',
    required: true
  }
});

const Venda = mongoose.model('Venda', VendaSchema);
export default Venda;