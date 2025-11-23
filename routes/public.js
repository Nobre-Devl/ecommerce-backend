import express from 'express';
import Produto from '../models/produto.js';

const router = express.Router();

router.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find()
            .populate('lojaId', 'nome nomeFantasia email');

        res.json(produtos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
});

export default router;