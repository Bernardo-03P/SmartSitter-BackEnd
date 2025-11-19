const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplica o middleware de autenticação a todas as rotas do carrinho
router.use(authMiddleware);

// Rotas agrupadas para o carrinho inteiro (/api/cart)
router.route('/')
    .get(cartController.getCart)
    .post(cartController.addToCart)
    .delete(cartController.clearCart);

// Rotas agrupadas para um item específico do carrinho (/api/cart/:produtoId)
router.route('/:produtoId')
    .put(cartController.updateItemQuantity)
    .delete(cartController.removeFromCart);

module.exports = router;