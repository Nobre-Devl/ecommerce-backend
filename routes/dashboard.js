import express from 'express';
import mongoose from 'mongoose';
import Venda from '../models/Venda.js';
import Produto from '../models/produto.js';
import Cliente from '../models/cliente.js';
import verificarAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/resumo', verificarAuth, async (req, res) => {
  try {
    // IMPORTANTE: Converter para ObjectId para a agregação funcionar
    const lojaObjectId = new mongoose.Types.ObjectId(req.loja._id);

    console.log("Calculando dashboard para Loja ID:", lojaObjectId);

    const [resultadoFaturamento, qtdVendas, qtdProdutos, qtdClientes, ultimasVendas] = await Promise.all([

      // 1. Soma EXATA dos valores (Aggregation)
      Venda.aggregate([
        { $match: { lojaId: lojaObjectId } },
        { $group: { _id: null, total: { $sum: "$valorTotal" } } }
      ]),

      // 2. Contagens
      Venda.countDocuments({ lojaId: lojaObjectId }),
      Produto.countDocuments({ lojaId: lojaObjectId }),
      Cliente.countDocuments({ lojaId: lojaObjectId }), // Se der erro aqui, comente essa linha se não tiver Model Cliente

      // 3. Últimas vendas
      Venda.find({ lojaId: lojaObjectId })
        .sort({ data: -1 })
        .limit(5)
        .populate('cliente', 'nome')
    ]);

    // Pega o total ou assume 0 se não tiver vendas
    const faturamentoTotal = resultadoFaturamento.length > 0 ? resultadoFaturamento[0].total : 0;

    console.log("Faturamento encontrado:", faturamentoTotal); // Veja isso no terminal

    res.json({
      faturamento: faturamentoTotal,
      qtdVendas: qtdVendas,
      qtdProdutos: qtdProdutos,
      qtdClientes: qtdClientes,
      ultimasVendas: ultimasVendas
    });

  } catch (err) {
    console.error("Erro no Dashboard:", err);
    res.status(500).json({ message: "Erro ao carregar dashboard" });
  }
});

export default router;