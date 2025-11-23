const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API E-Commerce',
    version: '1.0.0',
    description: 'Documentação da API de E-Commerce para gerenciamento de lojas, produtos, clientes, fornecedores e vendas.',
  },
  servers: [
    {
      url: 'https://ecommerce-backend-green-iota.vercel.app/',
      description: 'Servidor Vercel',
    },
    {
      url: 'http://localhost:2024',
      description: 'Servidor Local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'auth-token',
        description: 'Token de autenticação da loja',
      },
    },
  },
  paths: {
    '/api/loja/register': {
      post: {
        summary: 'Registrar nova loja',
        description: 'Cria uma nova conta de loja no sistema.',
        tags: ['Loja'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Minha Loja' },
                  email: { type: 'string', example: 'loja@email.com' },
                  password: { type: 'string', example: 'senha123' },
                  cnpj: { type: 'string', example: '00.000.000/0001-00' },
                  telefone: { type: 'string', example: '11999999999' },
                  imagem: { type: 'string', description: 'URL ou Base64 da imagem' },
                  endereco: { type: 'string', example: 'Rua Exemplo, 123' },
                },
                required: ['nome', 'email', 'password', 'cnpj'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Loja cadastrada com sucesso',
          },
          400: {
            description: 'Erro na requisição',
          },
        },
      },
    },
    '/api/loja/login': {
      post: {
        summary: 'Login da loja',
        description: 'Autentica uma loja e retorna um token de acesso.',
        tags: ['Loja'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'loja@email.com' },
                  password: { type: 'string', example: 'senha123' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Email ou senha inválidos',
          },
        },
      },
    },
    '/api/loja/perfil': {
      get: {
        summary: 'Obter perfil da loja',
        description: 'Retorna os dados da loja autenticada.',
        tags: ['Loja'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dados da loja',
          },
          404: {
            description: 'Loja não encontrada',
          },
        },
      },
    },
    '/produtos': {
      get: {
        summary: 'Listar produtos',
        description: 'Retorna todos os produtos da loja autenticada.',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de produtos',
          },
        },
      },
      post: {
        summary: 'Criar produto',
        description: 'Adiciona um novo produto à loja.',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Camiseta' },
                  descricao: { type: 'string', example: 'Camiseta de algodão' },
                  preco: { type: 'number', example: 49.90 },
                  estoque: { type: 'number', example: 100 },
                  imagem: { type: 'string', description: 'URL ou Base64 da imagem' },
                },
                required: ['nome', 'preco'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Produto criado com sucesso',
          },
          400: {
            description: 'Erro ao criar produto',
          },
        },
      },
    },
    '/produtos/{id}': {
      put: {
        summary: 'Atualizar produto',
        description: 'Atualiza os dados de um produto existente.',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do produto',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  descricao: { type: 'string' },
                  preco: { type: 'number' },
                  estoque: { type: 'number' },
                  imagem: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Produto atualizado com sucesso',
          },
          404: {
            description: 'Produto não encontrado',
          },
        },
      },
      delete: {
        summary: 'Remover produto',
        description: 'Remove um produto da loja.',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do produto',
          },
        ],
        responses: {
          200: {
            description: 'Produto removido com sucesso',
          },
          404: {
            description: 'Produto não encontrado',
          },
        },
      },
    },
    '/clientes': {
      get: {
        summary: 'Listar clientes',
        description: 'Retorna todos os clientes da loja autenticada.',
        tags: ['Clientes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de clientes',
          },
        },
      },
      post: {
        summary: 'Criar cliente',
        description: 'Adiciona um novo cliente à loja.',
        tags: ['Clientes'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@email.com' },
                  telefone: { type: 'string', example: '11988888888' },
                  cpf: { type: 'string', example: '123.456.789-00' },
                },
                required: ['nome'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Cliente criado com sucesso',
          },
          400: {
            description: 'Erro ao criar cliente',
          },
        },
      },
    },
    '/clientes/{id}': {
      put: {
        summary: 'Atualizar cliente',
        description: 'Atualiza os dados de um cliente existente.',
        tags: ['Clientes'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do cliente',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string' },
                  telefone: { type: 'string' },
                  cpf: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cliente atualizado com sucesso',
          },
          404: {
            description: 'Cliente não encontrado',
          },
        },
      },
      delete: {
        summary: 'Remover cliente',
        description: 'Remove um cliente da loja.',
        tags: ['Clientes'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do cliente',
          },
        ],
        responses: {
          200: {
            description: 'Cliente removido com sucesso',
          },
          404: {
            description: 'Cliente não encontrado',
          },
        },
      },
    },
    '/fornecedores': {
      get: {
        summary: 'Listar fornecedores',
        description: 'Retorna todos os fornecedores da loja autenticada.',
        tags: ['Fornecedores'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de fornecedores',
          },
        },
      },
      post: {
        summary: 'Criar fornecedor',
        description: 'Adiciona um novo fornecedor à loja.',
        tags: ['Fornecedores'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Fornecedor ABC' },
                  email: { type: 'string', example: 'contato@fornecedor.com' },
                  telefone: { type: 'string', example: '11977777777' },
                  cnpj: { type: 'string', example: '12.345.678/0001-90' },
                },
                required: ['nome'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Fornecedor criado com sucesso',
          },
          400: {
            description: 'Erro ao criar fornecedor',
          },
        },
      },
    },
    '/fornecedores/{id}': {
      put: {
        summary: 'Atualizar fornecedor',
        description: 'Atualiza os dados de um fornecedor existente.',
        tags: ['Fornecedores'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do fornecedor',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string' },
                  telefone: { type: 'string' },
                  cnpj: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Fornecedor atualizado com sucesso',
          },
          404: {
            description: 'Fornecedor não encontrado',
          },
        },
      },
      delete: {
        summary: 'Remover fornecedor',
        description: 'Remove um fornecedor da loja.',
        tags: ['Fornecedores'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do fornecedor',
          },
        ],
        responses: {
          200: {
            description: 'Fornecedor removido com sucesso',
          },
          404: {
            description: 'Fornecedor não encontrado',
          },
        },
      },
    },
    '/public/produtos': {
      get: {
        summary: 'Listar produtos públicos',
        description: 'Retorna todos os produtos de todas as lojas (acesso público).',
        tags: ['Público'],
        responses: {
          200: {
            description: 'Lista de produtos públicos',
          },
        },
      },
    },
    '/api/cliente/registro': {
      post: {
        summary: 'Registro de cliente final',
        description: 'Cria uma nova conta de cliente final (usuário do e-commerce).',
        tags: ['Cliente Final'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Maria Oliveira' },
                  email: { type: 'string', example: 'maria@email.com' },
                  senha: { type: 'string', example: 'senhaSegura' },
                  cpf: { type: 'string', example: '111.222.333-44' },
                  telefone: { type: 'string', example: '11966666666' },
                },
                required: ['nome', 'email', 'senha'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cliente registrado com sucesso',
          },
          400: {
            description: 'Erro no registro',
          },
        },
      },
    },
    '/api/cliente/login': {
      post: {
        summary: 'Login de cliente final',
        description: 'Autentica um cliente final e retorna um token.',
        tags: ['Cliente Final'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'maria@email.com' },
                  senha: { type: 'string', example: 'senhaSegura' },
                },
                required: ['email', 'senha'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
          },
          400: {
            description: 'Email ou senha incorretos',
          },
        },
      },
    },
    '/api/dashboard/resumo': {
      get: {
        summary: 'Resumo do Dashboard',
        description: 'Retorna métricas principais da loja (faturamento, contagens).',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dados do dashboard',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    faturamento: { type: 'number' },
                    qtdVendas: { type: 'number' },
                    qtdProdutos: { type: 'number' },
                    qtdClientes: { type: 'number' },
                    ultimasVendas: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/vendas': {
      get: {
        summary: 'Listar vendas',
        description: 'Retorna o histórico de vendas da loja.',
        tags: ['Vendas'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Histórico de vendas',
          },
        },
      },
      post: {
        summary: 'Registrar venda',
        description: 'Cria um novo registro de venda e atualiza o estoque.',
        tags: ['Vendas'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  cliente: { type: 'string', description: 'ID do cliente ou nome' },
                  itens: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        produtoId: { type: 'string' },
                        nome: { type: 'string' },
                        quantidade: { type: 'number' },
                        precoUnitario: { type: 'number' },
                      },
                    },
                  },
                  valorTotal: { type: 'number' },
                  vendedor: { type: 'string' },
                },
                required: ['itens', 'valorTotal'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Venda registrada com sucesso',
          },
          400: {
            description: 'Erro ao registrar venda (ex: estoque insuficiente)',
          },
        },
      },
    },
    '/vendas/{id}': {
      put: {
        summary: 'Atualizar venda',
        description: 'Atualiza uma venda existente e ajusta o estoque.',
        tags: ['Vendas'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID da venda',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  cliente: { type: 'string' },
                  itens: { type: 'array', items: { type: 'object' } },
                  valorTotal: { type: 'number' },
                  vendedor: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Venda atualizada com sucesso',
          },
          400: {
            description: 'Erro ao atualizar venda',
          },
        },
      },
      delete: {
        summary: 'Cancelar venda',
        description: 'Remove uma venda e estorna o estoque.',
        tags: ['Vendas'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID da venda',
          },
        ],
        responses: {
          200: {
            description: 'Venda cancelada com sucesso',
          },
          404: {
            description: 'Venda não encontrada',
          },
        },
      },
    },
  },
};

module.exports = openApiSpec;
