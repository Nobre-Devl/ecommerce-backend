const express = require('express');
const router = express.Router();
const Despesa = require('../models/despesa');

router.post('/', async (req, res) => {
    try {
        const novaDespesa = new Despesa(req.body);
        const despesaSalva = await novaDespesa.save();
        res.status(201).json({ message: 'Despesa registrada!', despesa: despesaSalva });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const despesas = await Despesa.find().sort({ dataVencimento: 1 });
        res.json(despesas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/resumo', async (req, res) => {
    try {
        const pendentes = await Despesa.find({ status: 'Pendente' });
        const totalPendente = pendentes.reduce((acc, curr) => acc + curr.valor, 0);
        res.json({ totalPendente, quantidade: pendentes.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const despesaAtualizada = await Despesa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        res.json(despesaAtualizada);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Despesa.findByIdAndDelete(req.params.id);
        res.json({ message: 'Despesa removida com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;