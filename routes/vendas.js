import express from 'express';
import Venda from '../models/Venda.js';
import Produto from '../models/produto.js';
import verificarAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarAuth, async (req, res) => {
  try {
    const vendas = await Venda.find({ lojaId: req.loja._id }).sort({ data: -1 });
    res.json(vendas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', verificarAuth, async (req, res) => {
  try {
    const { itens } = req.body;

    for (const item of itens) {
      const prod = await Produto.findOne({ _id: item.produtoId, lojaId: req.loja._id });
      if (!prod || prod.estoque < item.quantidade) {
        return res.status(400).json({ message: `Sem estoque suficiente para: ${item.nome}` });
      }
    }

    for (const item of itens) {
      await Produto.findOneAndUpdate(
        { _id: item.produtoId, lojaId: req.loja._id },
        { $inc: { estoque: -item.quantidade } }
      );
    }

    const novaVenda = new Venda({
      ...req.body,
      lojaId: req.loja._id,
      numero: Date.now().toString()
    });
    const savedVenda = await novaVenda.save();
    res.status(201).json(savedVenda);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', verificarAuth, async (req, res) => {
  try {
    const venda = await Venda.findOne({ _id: req.params.id, lojaId: req.loja._id });
    if (!venda) return res.status(404).json({ message: 'Venda não encontrada' });

    for (const item of venda.itens) {
      await Produto.findOneAndUpdate(
        { _id: item.produtoId, lojaId: req.loja._id },
        { $inc: { estoque: +item.quantidade } }
      );
    }

    // 2. Deletar a venda
    await Venda.findByIdAndDelete(req.params.id);
    res.json({ message: 'Venda excluída e estoque estornado com sucesso!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', verificarAuth, async (req, res) => {
  try {
    const vendaAntiga = await Venda.findOne({ _id: req.params.id, lojaId: req.loja._id });
    if (!vendaAntiga) return res.status(404).json({ message: 'Venda não encontrada' });

    const { itens: novosItens } = req.body;

    for (const item of vendaAntiga.itens) {
      await Produto.findOneAndUpdate(
        { _id: item.produtoId, lojaId: req.loja._id },
        { $inc: { estoque: +item.quantidade } }
      );
    }

    for (const item of novosItens) {
      const prod = await Produto.findOne({ _id: item.produtoId, lojaId: req.loja._id });

      if (!prod || prod.estoque < item.quantidade) {

        for (const itemAntigo of vendaAntiga.itens) {
          await Produto.findOneAndUpdate({ _id: itemAntigo.produtoId }, { $inc: { estoque: -itemAntigo.quantidade } });
        }

        return res.status(400).json({ message: `Estoque insuficiente para a alteração: ${item.nome}` });
      }
    }

    for (const item of novosItens) {
      await Produto.findOneAndUpdate(
        { _id: item.produtoId, lojaId: req.loja._id },
        { $inc: { estoque: -item.quantidade } }
      );
    }

    const vendaAtualizada = await Venda.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          cliente: req.body.cliente,
          itens: novosItens,
          valorTotal: req.body.valorTotal,
          vendedor: req.body.vendedor
        }
      },
      { new: true }
    );

    res.json(vendaAtualizada);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;