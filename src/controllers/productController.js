const db = require('../config/db');
exports.getProdutoPorId = async (req, res) => {
const { id } = req.params;

try {
    const produto = await db.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (produto.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json(produto.rows[0]);

} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o produto.' });
}
};