# SmartSitter - Aplicação Fullstack de E-commerce

Este é um projeto fullstack de um e-commerce para o produto SmartSitter. A aplicação inclui um backend construído com Node.js e Express, conectado a um banco de dados PostgreSQL, e um frontend moderno e reativo construído com React e Vite.

## ✨ Funcionalidades

-   **Autenticação de Usuários:** Sistema completo de cadastro e login com senhas criptografadas e tokens JWT para gerenciamento de sessão.
-   **Visualização de Produtos:** Páginas dedicadas para exibir detalhes dos produtos.
-   **Carrinho de Compras:** Funcionalidade completa para adicionar, visualizar, atualizar quantidade, remover itens e limpar o carrinho. O estado do carrinho é persistido no banco de dados para usuários logados.
-   **Sistema de Suporte:** Rota protegida para usuários autenticados enviarem tickets de suporte, incluindo a funcionalidade de upload de imagens.
-   **Notificações Dinâmicas:** Interface do usuário com feedback visual para ações como login bem-sucedido, adição ao carrinho e finalização de compra.
-   **Rotas Protegidas:** Acesso a páginas como "Suporte" e "Carrinho" restrito a usuários autenticados.

## 🛠️ Tecnologias Utilizadas

#### **Backend**
-   **Node.js:** Ambiente de execução JavaScript.
-   **Express.js:** Framework para criação da API RESTful.
-   **PostgreSQL:** Banco de dados relacional para armazenamento de dados.
-   **pg (Node-Postgres):** Driver para conectar o Node.js ao PostgreSQL.
-   **JSON Web Token (JWT):** Para autenticação e gerenciamento de sessões seguras.
-   **Bcrypt.js:** Para criptografia de senhas.
-   **Multer:** Middleware para manipulação de uploads de arquivos.
-   **Dotenv:** Para gerenciamento de variáveis de ambiente.

#### **Frontend**
-   **React 18:** Biblioteca para construção da interface de usuário.
-   **Vite:** Ferramenta de build moderna e rápida para o frontend.
-   **React Router DOM:** Para gerenciamento de rotas (navegação).
-   **Axios:** Cliente HTTP para comunicação com a API do backend.
-   **Bootstrap & React-Bootstrap:** Para componentes de UI e layout responsivo.
-   **Framer Motion:** Para animações suaves na interface.
-   **Lucide React:** Para ícones SVG.

---

## 🚀 Como Baixar e Rodar o Projeto Localmente

Siga este guia passo a passo para configurar e executar o projeto em uma nova máquina.

### **1. Pré-requisitos**

Antes de começar, garanta que você tenha os seguintes programas instalados:

-   **Node.js (versão LTS):** [Baixe aqui](https://nodejs.org/)
-   **npm:** (Já vem instalado com o Node.js)
-   **PostgreSQL:** [Baixe aqui](https://www.postgresql.org/download/)
    -   *Durante a instalação, você precisará definir uma senha para o superusuário `postgres`. **Anote esta senha!***
-   **Git:** [Baixe aqui](https://git-scm.com/) (Opcional, mas recomendado)

### **2. Configuração do Banco de Dados**

O projeto precisa de um banco de dados configurado para funcionar.

1.  Abra sua ferramenta de gerenciamento de PostgreSQL (como **pgAdmin**).
2.  Crie um novo banco de dados com o nome `smartsitter`.
3.  Abra a **Query Tool** para este banco de dados e execute o script SQL abaixo para criar todas as tabelas e inserir um produto de exemplo.

```sql
-- Cria a tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, nome VARCHAR(50) NOT NULL, sobrenome VARCHAR(50) NOT NULL,
    data_nascimento DATE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, preco NUMERIC(10, 2) NOT NULL,
    detalhes TEXT[], imagem_url VARCHAR(255)
);

-- Cria a tabela de tickets de suporte
CREATE TABLE suporte_tickets (
    id SERIAL PRIMARY KEY, usuario_id INT NOT NULL, assunto VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL, mensagem TEXT NOT NULL, imagem_url VARCHAR(255),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, status VARCHAR(20) DEFAULT 'aberto',
    CONSTRAINT fk_usuario_suporte FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Cria a tabela do carrinho
CREATE TABLE carrinho_itens (
    usuario_id INT NOT NULL, produto_id INT NOT NULL, quantidade INT NOT NULL DEFAULT 1,
    PRIMARY KEY (usuario_id, produto_id),
    CONSTRAINT fk_usuario_carrinho FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_produto_carrinho FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Insere um produto de exemplo para testes
INSERT INTO produtos (id, nome, preco, detalhes, imagem_url) 
VALUES (1, 'Aparelho Inteligente SmartSitter', 499.90,
    ARRAY['Monitoramento em tempo real','Sensor de temperatura e umidade','Notificações inteligentes no seu celular','Visão noturna de alta qualidade'],
    'https://i.imgur.com/URL_DA_IMAGEM.png' -- TROQUE PELA URL DA SUA IMAGEM
) ON CONFLICT (id) DO NOTHING;

-- Atualiza o contador de IDs
SELECT setval('produtos_id_seq', (SELECT MAX(id) FROM produtos));
3. Configuração do Projeto
Clone ou baixe o código:
code
Bash
git clone https://github.com/seu-usuario/seu-repositorio.git
# Ou simplesmente descompacte os arquivos do projeto em uma pasta.
Configure o Backend:
Navegue até a pasta Backend: cd Backend
Crie um arquivo chamado .env e cole o conteúdo abaixo, substituindo os valores pelos seus:
code
Env
# Configuração do Servidor
PORT=3001

# Chave Secreta para JWT (Mude para algo único e secreto)
JWT_SECRET=sua-chave-secreta-forte-aqui-123

# Configuração do Banco de Dados PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=smartsitter
DB_PASSWORD=a_senha_que_voce_anotou
DB_PORT=5432
Instale as dependências:
code
Bash
npm install
Configure o Frontend:
Em um novo terminal, navegue até a pasta Frontend: cd Frontend
Instale as dependências:
code
Bash
npm install
4. Executando a Aplicação
Você precisará de dois terminais abertos simultaneamente.
No primeiro terminal (para o Backend):
code
Bash
# Navegue para a pasta Backend
cd Backend

# Inicie o servidor em modo de desenvolvimento
npm run dev
O terminal deverá exibir: Servidor rodando na porta 3001. Deixe este terminal aberto.
No segundo terminal (para o Frontend):
code
Bash
# Navegue para a pasta Frontend
cd Frontend

# Inicie a aplicação React
npm run dev
O terminal fornecerá uma URL local, como http://localhost:5173. Abra este link no seu navegador para ver e usar a aplicação.
