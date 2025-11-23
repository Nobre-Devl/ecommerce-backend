# Backend E-Commerce API

API RESTful para gerenciamento de e-commerce, construída com Node.js, Express e MongoDB.

## 🚀 Tecnologias

-   **Node.js** (v18+ recomendado)
-   **Express**
-   **MongoDB** (Mongoose)
-   **JWT** (Autenticação)
-   **Cloudinary** (Upload de imagens)
-   **Scalar** (Documentação da API)

## 🛠️ Instalação

1.  Clone o repositório:
    ```bash
    git clone <seu-repositorio>
    cd ecommerce-backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    # ou
    bun install
    ```

3.  Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com o seguinte modelo:

    ```env
    PORT=2024
    MONGO_URI=sua_string_de_conexao_mongodb
    
    # Autenticação
    JWT_SECRET=seu_segredo_jwt
    CLIENTE_TOKEN_SECRET=seu_segredo_cliente
    
    # Cloudinary (Upload de Imagens)
    CLOUDINARY_CLOUD_NAME=seu_cloud_name
    CLOUDINARY_API_KEY=sua_api_key
    CLOUDINARY_API_SECRET=sua_api_secret
    ```

## ▶️ Execução

### Desenvolvimento
Para rodar o servidor em modo de desenvolvimento (com reinício automático):
```bash
npm run dev
```

### Produção
Para rodar o servidor em modo de produção:
```bash
npm start
```

O servidor iniciará na porta definida no `.env` (padrão: 2024).

## 📚 Documentação da API

A documentação interativa da API (Swagger/OpenAPI) está disponível na rota `/docs`.

Após iniciar o servidor, acesse:
[http://localhost:2024/docs](http://localhost:2024/docs)

## 📂 Estrutura do Projeto

-   `config/`: Configurações (Cloudinary, Scalar/Swagger)
-   `middleware/`: Middlewares de autenticação (`auth.js`, `clienteauth.js`)
-   `models/`: Modelos do Mongoose (Schema do Banco de Dados)
-   `routes/`: Rotas da API
-   `server.js`: Ponto de entrada da aplicação

## 🔗 Rotas Principais

-   `/api/loja`: Autenticação e gestão de lojas
-   `/api/cliente`: Autenticação e gestão de clientes finais
-   `/produtos`: Gestão de produtos
-   `/vendas`: Gestão de vendas
-   `/fornecedores`: Gestão de fornecedores
-   `/clientes`: Gestão de clientes (pela loja)
-   `/api/dashboard`: Dados analíticos
-   `/public`: Rotas públicas
