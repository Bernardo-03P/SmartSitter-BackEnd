const db = require('../config/db');

// Adiciona um item ao carrinho ou atualiza a quantidade se já existir
exports.addToCart = async (req, res) => {
    const usuarioId = req.user.id;
    const { produtoId, quantidade } = req.body;

    if (!produtoId || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'ID do produto e quantidade são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO carrinho_itens (usuario_id, produto_id, quantidade)
            VALUES ($1, $2, $3)
            ON CONFLICT (usuario_id, produto_id)
            DO UPDATE SET quantidade = carrinho_itens.quantidade + $3
            RETURNING *;
        `;
        const { rows } = await db.query(query, [usuarioId, produtoId, quantidade]);
        res.status(201).json({ message: 'Produto adicionado ao carrinho!', item: rows[0] });
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        res.status(500).json({ error: 'Erro no servidor ao adicionar produto ao carrinho.' });
    }
};

// Busca todos os itens do carrinho de um usuário
exports.getCart = async (req, res) => {
    const usuarioId = req.user.id;
    try {
        const query = `
            SELECT p.id, p.nome, p.preco, p.imagem_url, ci.quantidade
            FROM carrinho_itens ci
            JOIN produtos p ON ci.produto_id = p.id
            WHERE ci.usuario_id = $1
            ORDER BY p.nome;
        `;
        const { rows } = await db.query(query, [usuarioId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        res.status(500).json({ error: 'Erro no servidor ao buscar o carrinho.' });
    }
};

// Atualiza a quantidade de um item específico e retorna o item completo
exports.updateItemQuantity = async (req, res) => {
    const usuarioId = req.user.id;
    const { produtoId } = req.params;
    const { quantidade } = req.body;

    const quantityNum = parseInt(quantidade, 10);
    if (isNaN(quantityNum) || quantityNum < 0) {
        return res.status(400).json({ error: 'A quantidade é inválida.' });
    }

    if (quantityNum === 0) {
        return exports.removeFromCart(req, res);
    }

    try {
        const updateQuery = `
            UPDATE carrinho_itens SET quantidade = $1
            WHERE usuario_id = $2 AND produto_id = $3
            RETURNING produto_id;
        `;
        const { rows: updatedRows } = await db.query(updateQuery, [quantityNum, usuarioId, produtoId]);

        if (updatedRows.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
        }

        const selectQuery = `
            SELECT p.id, p.nome, p.preco, p.imagem_url, ci.quantidade
            FROM carrinho_itens ci
            JOIN produtos p ON ci.produto_id = p.id
            WHERE ci.usuario_id = $1 AND ci.produto_id = $2;
        `;
        const { rows } = await db.query(selectQuery, [usuarioId, produtoId]);

        res.json({ message: 'Quantidade atualizada!', item: rows[0] });

    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        res.status(500).json({ error: 'Erro no servidor ao atualizar a quantidade.' });
    }
};

// Remove um item do carrinho
exports.removeFromCart = async (req, res) => {
    const usuarioId = req.user.id;
    const { produtoId } = req.params;
    try {
        const query = 'DELETE FROM carrinho_itens WHERE usuario_id = $1 AND produto_id = $2 RETURNING *;';
        const { rowCount } = await db.query(query, [usuarioId, produtoId]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
        }
        res.json({ message: 'Item removido do carrinho com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        res.status(500).json({ error: 'Erro no servidor ao remover item do carrinho.' });
    }
};

// Limpa todos os itens do carrinho de um usuário
exports.clearCart = async (req, res) => {
    const usuarioId = req.user.id;
    try {
        await db.query('DELETE FROM carrinho_itens WHERE usuario_id = $1', [usuarioId]);
        res.status(200).json({ message: 'Carrinho limpo com sucesso!' });
    } catch (error) {
        console.error('Erro ao limpar o carrinho:', error);
        res.status(500).json({ error: 'Erro no servidor ao limpar o carrinho.' });
    }
};