import mongoose from 'mongoose';

const FornecedoresSchema = new mongoose.Schema({
    RazaoSocial: { type: String, required: true },
    email: String,
    telefone: String,
    endereco: String,
    CNPJ: String,
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    lojaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    }
});

const Fornecedores = mongoose.model('Fornecedores', FornecedoresSchema);

export default Fornecedores;