const db = require('../config/db');

exports.criarTicket = async (req, res) => {
    // LOG ADICIONADO: Vamos ver o que o middleware nos entregou
    console.log('[supportController] req.user recebido:', req.user);

    const { assunto, TituloSuporte, MensagemSuporte } = req.body;
    const imagemPath = req.file ? req.file.path : null;
    
    // Tentamos pegar o ID do usuário a partir do req.user
    // O '?' (optional chaining) previne um erro caso req.user seja undefined
    const usuarioId = req.user?.id;

    // Verificamos se conseguimos pegar o ID
    if (!usuarioId) {
        // Se não conseguirmos, enviamos um erro claro.
        // Isso nos ajuda a saber que o problema está na comunicação entre o middleware e o controller.
        console.error('[supportController] Erro: ID do usuário não encontrado no objeto da requisição (req.user).');
        // Mantemos o ticket sendo criado, mas sem o usuario_id, para não quebrar a funcionalidade principal.
        // Em um ambiente de produção, você poderia decidir retornar um erro 400 aqui.
    }

    try {
        const novoTicket = await db.query(
            'INSERT INTO suporte_tickets (assunto, titulo, mensagem, imagem_url, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [assunto, TituloSuporte, MensagemSuporte, imagemPath, usuarioId] // A variável usuarioId será 'null' se não for encontrada
        );

        res.status(201).json({ 
            message: 'Ticket de suporte enviado com sucesso!', 
            ticketId: novoTicket.rows[0].id 
        });

    } catch (error) {
        console.error('Erro ao inserir ticket no banco de dados:', error);
        res.status(500).json({ error: 'Erro ao enviar ticket de suporte.' });
    }
};