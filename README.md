# SmartSitter - Backup Completo do Projeto (Fullstack E-commerce)

Este documento serve como um guia de instalação completo e um backup de código-fonte para a aplicação fullstack **SmartSitter**. A aplicação inclui um backend construído com Node.js e Express, e um frontend com React e Vite.

## 🚀 Guia de Instalação e Execução Local

Siga este guia para configurar e executar o projeto em uma nova máquina do zero.

### **Passo 1: Instalação dos Programas Essenciais**

Garanta que os seguintes programas estejam instalados no seu computador:

1.  **Node.js (versão LTS):** Essencial para executar o projeto. Inclui o `npm`. [Baixe aqui](https://nodejs.org/).
2.  **PostgreSQL:** O banco de dados da aplicação. [Baixe aqui](https://www.postgresql.org/download/).
    -   Durante a instalação, você definirá uma senha para o superusuário (`postgres`). **Guarde esta senha!**

### **Passo 2: Configuração do Banco de Dados**

1.  Abra sua ferramenta de gerenciamento de banco de dados (ex: **pgAdmin**).
2.  Crie um novo banco de dados chamado `smartsitter`.
3.  Execute o script SQL abaixo para criar todas as tabelas e inserir dados de exemplo.

```sql
-- TABELA DE USUÁRIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, nome VARCHAR(50) NOT NULL, sobrenome VARCHAR(50) NOT NULL,
    data_nascimento DATE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE PRODUTOS
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, preco NUMERIC(10, 2) NOT NULL,
    detalhes TEXT[], imagem_url VARCHAR(255)
);

-- TABELA PARA TICKETS DE SUPORTE
CREATE TABLE suporte_tickets (
    id SERIAL PRIMARY KEY, usuario_id INT NOT NULL, assunto VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL, mensagem TEXT NOT NULL, imagem_url VARCHAR(255),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, status VARCHAR(20) DEFAULT 'aberto',
    CONSTRAINT fk_usuario_suporte FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- TABELA PARA OS ITENS DO CARRINHO
CREATE TABLE carrinho_itens (
    usuario_id INT NOT NULL, produto_id INT NOT NULL, quantidade INT NOT NULL DEFAULT 1,
    PRIMARY KEY (usuario_id, produto_id),
    CONSTRAINT fk_usuario_carrinho FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_produto_carrinho FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- INSERIR PRODUTO DE EXEMPLO
INSERT INTO produtos (id, nome, preco, detalhes, imagem_url) 
VALUES (
    1, 'Aparelho Inteligente SmartSitter', 499.90,
    ARRAY['Monitoramento em tempo real','Sensor de temperatura e umidade','Notificações inteligentes no seu celular','Visão noturna de alta qualidade'],
    'https://i.imgur.com/URL_DA_SUA_IMAGEM.png' -- IMPORTANTE: Troque por uma URL de imagem válida
) ON CONFLICT (id) DO NOTHING;

-- ATUALIZA O CONTADOR DO ID
SELECT setval('produtos_id_seq', (SELECT MAX(id) FROM produtos));
