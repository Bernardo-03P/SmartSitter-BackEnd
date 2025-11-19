const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- CORREÇÃO DE CAMINHOS ---
// Se estamos em 'src/config', precisamos subir um nível ('../') para encontrar a pasta 'routes'.
const userRoutes = require('../routes/userRoutes');
const supportRoutes = require('../routes/supportRoutes');
const productRoutes = require('../routes/productRoutes');
const cartRoutes = require('../routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORREÇÃO DE CAMINHO PARA 'uploads' ---
// Se estamos em 'src/config', precisamos subir dois níveis ('../../') para chegar na raiz do 'backend' onde a pasta 'uploads' está.
const uploadsDirectory = path.resolve(__dirname, '../../uploads');

// 2. MOSTRAMOS O CAMINHO EXATO NO CONSOLE QUANDO O SERVIDOR INICIA.
console.log(`[DEPURAÇÃO] Servidor está configurado para servir arquivos da pasta: ${uploadsDirectory}`);

// 3. Usamos essa variável para garantir que o caminho é o mesmo.
app.use('/uploads', express.static(uploadsDirectory));

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API SmartSitter está no ar!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});