import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.CLIENTE_TOKEN_SECRET || 'SEGREDO_CLIENTE_SUPER_SECRETO';

export default function (req, res, next) {
  const token = req.header('auth-token-cliente');

  if (!token) return res.status(401).send('Acesso negado. Token de cliente não fornecido.');

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.cliente = verified;
    next();
  } catch (err) {
    res.status(400).send('Token de cliente inválido.');
  }
};