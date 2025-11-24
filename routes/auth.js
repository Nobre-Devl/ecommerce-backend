const express = require('express');
const router = express.Router();
const Loja = require('../models/loja');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary'); 
const verificarAuth = require('../middleware/auth');

router.get('/perfil', verificarAuth, async (req, res) => {
    try {
        const loja = await Loja.findById(req.loja._id).select('-password'); 
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
            nomeFantasia, 
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
            nomeFantasia, 
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
        res.status(400).json({ message: err.message, error: err });
    }
});


router.post('/login', async (req, res) => {
    try {
        console.log("1. Tentativa de Login:", req.body); 

        const loja = await Loja.findOne({ email: req.body.email }).select('+password');

        if (!loja) {
            console.log("2. Email não encontrado no banco.");
            return res.status(400).send({ message: 'Email ou senha inválidos.' });
        }

        console.log("3. Loja encontrada. Hash da senha:", loja.password);

        if (!loja.password) {
            console.log("ERRO: Usuário existe mas não tem senha salva!");
            return res.status(500).json({ message: 'Erro no cadastro deste usuário. Contate o suporte.' });
        }

        const validPassword = await bcrypt.compare(req.body.password, loja.password);
        
        if (!validPassword) {
            console.log("4. Senha incorreta.");
            return res.status(400).send({ message: 'Email ou senha inválidos.' });
        }

        const token = jwt.sign({ _id: loja._id }, 'SEGREDO_SUPER_SECRETO'); 
        res.header('auth-token', token).send({ token: token });

    } catch (err) {
        console.error("ERRO NO LOGIN:", err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;