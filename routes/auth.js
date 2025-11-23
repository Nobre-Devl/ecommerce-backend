import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Loja from '../models/loja.js';
import cloudinary from '../config/cloudinary.js';
import verificarAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/perfil', verificarAuth, async (req, res) => {
    try {
        // req.loja._id é o ID da loja logada, anexado pelo middleware
        const loja = await Loja.findById(req.loja._id).select('-password'); // Busca e remove a senha

        if (!loja) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }
        res.json(loja);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar perfil.' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const {
            nome,
            email,
            password,
            cnpj,
            telefone,
            imagem,
            endereco
        } = req.body;

        let imageUrl = '';

        if (imagem) {
            const uploadResponse = await cloudinary.uploader.upload(imagem, {
                folder: "lojas_logos",
                resource_type: "image"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const novaLoja = new Loja({
            nome,
            email,
            password: hashedPassword,
            cnpj,
            telefone,
            imagem: imageUrl,
            endereco
        });

        const savedLoja = await novaLoja.save();
        res.status(201).json({ message: "Loja cadastrada!", id: savedLoja._id });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const loja = await Loja.findOne({ email: req.body.email });
        if (!loja) return res.status(400).send('Email ou senha inválidos.');

        const validPassword = await bcrypt.compare(req.body.password, loja.password);
        if (!validPassword) return res.status(400).send('Email ou senha inválidos.');

        // 🚨 Aviso: 'SEGREDO_SUPER_SECRETO' deve ser substituído pela variável de ambiente
        const token = jwt.sign({ _id: loja._id }, 'SEGREDO_SUPER_SECRETO');
        res.header('auth-token', token).send({ token: token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;