const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.cadastrarUsuario = async (req, res) => {
    const { nome, sobrenome, dia, mes, ano, email, senha } = req.body;
    const dataNascimento = `${ano}-${mes}-${dia}`; 

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        
        const novoUsuario = await db.query(
            'INSERT INTO usuarios (nome, sobrenome, data_nascimento, email, senha) VALUES ($1, $2, $3, $4, $5) RETURNING id, email',
            [nome, sobrenome, dataNascimento, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Usuário criado com sucesso!', 
            userId: novoUsuario.rows[0].id 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário. O email pode já estar em uso.' });
    }
};

exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(senha, user.rows[0].senha);
        if (!isMatch) {
            return res.status(400).json({ error: 'Senha inválida.' });
        }

        // --- ALTERAÇÃO AQUI ---
        // Adicionamos o 'nome' do usuário ao payload do token.
        const token = jwt.sign(
            { 
              id: user.rows[0].id, 
              email: user.rows[0].email,
              nome: user.rows[0].nome // Adicionado
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login bem-sucedido!', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor durante o login.' });
    }
};