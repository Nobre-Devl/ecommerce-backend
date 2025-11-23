import express from 'express';
import Produto from '../models/produto.js';
import verificarAuth from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.post('/', verificarAuth, async (req, res) => {
  try {
    const lojaIdDona = req.loja._id;
    const { imagem, ...outrosDados } = req.body;

    let imageUrl = '';

    if (imagem) {
      const uploadResponse = await cloudinary.uploader.upload(imagem, {
        folder: "produtos_imagens"
      });
      imageUrl = uploadResponse.secure_url;
    }

    const novoProduto = new Produto({
      ...outrosDados,
      imagem: imageUrl,
      lojaId: lojaIdDona
    });

    const savedProduto = await novoProduto.save();
    res.status(201).json(savedProduto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', verificarAuth, async (req, res) => {
  try {
    const lojaIdDona = req.loja._id;
    const produtos = await Produto.find({ lojaId: lojaIdDona });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', verificarAuth, async (req, res) => {
  try {
    const lojaIdDona = req.loja._id;
    const dadosAtualizados = req.body;

    if (dadosAtualizados.imagem && dadosAtualizados.imagem.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(dadosAtualizados.imagem, {
        folder: "produtos_imagens"
      });
      dadosAtualizados.imagem = uploadResponse.secure_url;

    }

    const updatedProduto = await Produto.findOneAndUpdate(
      { _id: req.params.id, lojaId: lojaIdDona },
      dadosAtualizados,
      { new: true }
    );

    if (!updatedProduto) return res.status(404).send('Produto não encontrado ou não pertence a esta loja.');

    res.json(updatedProduto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', verificarAuth, async (req, res) => {
  try {
    const lojaIdDona = req.loja._id;
    const deletedProduto = await Produto.findOneAndDelete(
      { _id: req.params.id, lojaId: lojaIdDona }
    );

    if (!deletedProduto) return res.status(404).send('Produto não encontrado ou não pertence a esta loja.');

    res.json({ message: 'Produto removido!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;