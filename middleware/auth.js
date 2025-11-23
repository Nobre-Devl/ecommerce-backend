import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    const token = req.header('auth-token');

    if (!token) return res.status(401).send('Acesso negado. Faça o login.');

    try {
        const verified = jwt.verify(token, 'SEGREDO_SUPER_SECRETO');

        req.loja = verified;

        next();
    } catch (err) {
        res.status(400).send('Token inválido.');
    }
}