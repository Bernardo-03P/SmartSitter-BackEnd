const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    // Pega o token do cabeçalho da requisição (geralmente 'Authorization')
    const authHeader = req.header('Authorization');

    // Verifica se o cabeçalho de autorização existe
    if (!authHeader) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        // O token vem no formato "Bearer TOKEN_AQUI"
        // O split(' ')[1] pega apenas a parte do token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
             return res.status(401).json({ msg: 'Token malformado, autorização negada.' });
        }

        // Verifica se o token é válido usando a sua chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('[authMiddleware] Token decodificado:', decoded);
        // Adiciona o payload decodificado (que contém o id e email do usuário)
        // ao objeto da requisição (req). Assim, as próximas rotas terão acesso a quem fez a requisição.
        req.user = decoded;
        
        // Continua para a próxima função (o controller da rota)
        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token inválido.' });
    }
};