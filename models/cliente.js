import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: String,
    telefone: String,
    endereco: String,
    cpf: String,
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

const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', clienteSchema);

export default Cliente;