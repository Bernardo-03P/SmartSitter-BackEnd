const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path'); // Precisamos do 'path' para pegar a extensão do arquivo

// --- NOVA CONFIGURAÇÃO DO MULTER ---
const storage = multer.diskStorage({
  // Define a pasta de destino para os uploads
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Define como o arquivo será nomeado
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar conflitos:
    // Pega o nome do campo ('imagem') + timestamp + extensão original do arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Aplica a configuração de storage ao multer
const upload = multer({ storage: storage });
// --- FIM DA NOVA CONFIGURAÇÃO ---


// A rota continua a mesma, mas agora usa a nova configuração de 'upload'
router.post(
  '/tickets', 
  authMiddleware, 
  upload.single('imagem'), 
  supportController.criarTicket
);

module.exports = router;