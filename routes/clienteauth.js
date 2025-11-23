import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ClienteUsuario from '../models/clienteusuario.js';

const router = express.Router();

router.post('/registro', async (req, res) => {
  try {
    let { nome, email, senha, cpf, telefone } = req.body;

    const usuarioExistente = await ClienteUsuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    if (!cpf || typeof cpf !== 'string' || cpf.trim() === '') {
      cpf = undefined;
    } else {
      const cpfExistente = await ClienteUsuario.findOne({ cpf });
      if (cpfExistente) {
        return res.status(400).json({ message: 'CPF já cadastrado.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const novoUsuario = new ClienteUsuario({
      nome,
      email,
      senha: hashedPassword,
      cpf,
      telefone
    });

    const usuarioSalvo = await novoUsuario.save();

    const token = jwt.sign(
      { _id: usuarioSalvo._id, tipo: 'cliente' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.header('auth-token', token).json({
      token,
      user: {
        id: usuarioSalvo._id,
        nome: usuarioSalvo.nome,
        email: usuarioSalvo.email
      }
    });

  } catch (err) {
    console.error("Erro no Registro:", err);

    if (err.code === 11000) {
      const campo = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `Erro: ${campo.toUpperCase()} já está em uso.` });
    }

    res.status(500).json({ message: 'Erro interno no servidor ao registrar.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await ClienteUsuario.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Email ou senha incorretos.' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).json({ message: 'Email ou senha incorretos.' });

    const token = jwt.sign(
      { _id: usuario._id, tipo: 'cliente' },
      process.env.JWT_SECRET || 'secret_key',
    );

    res.header('auth-token', token).json({
      token,
      user: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no login." });
  }
});

export default router;