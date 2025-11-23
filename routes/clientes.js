import express from 'express';
import Cliente from '../models/cliente.js';
import verificarAuth from '../middleware/auth.js';

const router = express.Router();

router.post('/', verificarAuth, async (req, res) => {
    try {
        const novoCliente = new Cliente({
            ...req.body,
            lojaId: req.loja._id
        });
        const savedCliente = await novoCliente.save();
        res.status(201).json(savedCliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', verificarAuth, async (req, res) => {
    try {
        const clientes = await Cliente.find({ lojaId: req.loja._id });
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', verificarAuth, async (req, res) => {
    try {
        const updatedCliente = await Cliente.findOneAndUpdate(
            { _id: req.params.id, lojaId: req.loja._id },
            req.body,
            { new: true }
        );

        if (!updatedCliente) return res.status(404).send('Cliente não encontrado.');
        res.json(updatedCliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', verificarAuth, async (req, res) => {
    try {
        const deleted = await Cliente.findOneAndDelete(
            { _id: req.params.id, lojaId: req.loja._id }
        );

        if (!deleted) return res.status(404).send('Cliente não encontrado.');
        res.json({ message: 'Cliente removido!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;