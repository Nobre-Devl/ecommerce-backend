import express from 'express';
import Fornecedor from '../models/Fornecedores.js';
import verificarAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarAuth, async (req, res) => {
  try {
    const fornecedores = await Fornecedor.find({ lojaId: req.loja._id });
    res.json(fornecedores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', verificarAuth, async (req, res) => {
  const novoFornecedor = new Fornecedor({
    ...req.body,
    lojaId: req.loja._id
  });

  try {
    const savedFornecedor = await novoFornecedor.save();
    res.status(201).json(savedFornecedor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', verificarAuth, async (req, res) => {
  try {
    const updatedFornecedor = await Fornecedor.findOneAndUpdate(
      { _id: req.params.id, lojaId: req.loja._id },
      req.body,
      { new: true }
    );
    if (!updatedFornecedor) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    res.json(updatedFornecedor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', verificarAuth, async (req, res) => {
  try {
    const deletedFornecedor = await Fornecedor.findOneAndDelete({
      _id: req.params.id,
      lojaId: req.loja._id
    });
    if (!deletedFornecedor) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    res.json({ message: 'Fornecedor removido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;