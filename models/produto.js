import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: String,
  categoria: String,
  preco: Number,
  estoque: Number,
  desc: String,
  imagem: String,
  data: String,
  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja',
    required: true
  }
});

const Produto = mongoose.models.Produto || mongoose.model('Produto', produtoSchema);

export default Produto;