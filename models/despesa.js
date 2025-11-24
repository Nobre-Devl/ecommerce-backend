const mongoose = require('mongoose');

const DespesaSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true, 
    },
    valor: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        enum: ['Fixa', 'Variavel', 'Emergencia'],
        default: 'Variavel'
    },
    dataVencimento: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pendente', 'Pago', 'Atrasado'],
        default: 'Pendente'
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Despesa', DespesaSchema);