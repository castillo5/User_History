import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'SportsLine API',
    version: '1.0.0',
    description: 'API REST para la empresa ficticia SportsLine.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['nombre', 'email', 'password'],
        properties: {
          nombre: { type: 'string', example: 'Ana Varela' },
          email: { type: 'string', example: 'ana@sportsline.com' },
          password: { type: 'string', example: 'ClaveSegura123' },
          rol: { type: 'string', enum: ['admin', 'vendedor'], example: 'vendedor' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'ana@sportsline.com' },
          password: { type: 'string', example: 'ClaveSegura123' }
        }
      },
      TokensResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          refreshToken: { type: 'string', example: 'd89f0f7b...' },
          expiresIn: { type: 'string', example: '15m' },
          refreshExpiresIn: { type: 'string', example: '7d' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string' },
          email: { type: 'string' },
          rol: { type: 'string', enum: ['admin', 'vendedor'] }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string' },
          codigo: { type: 'string' },
          precio: { type: 'number', format: 'float' },
          categoria: { type: 'string' },
          stock: { type: 'integer' }
        }
      },
      ProductCreateRequest: {
        type: 'object',
        required: ['nombre', 'codigo', 'precio', 'categoria', 'stock'],
        properties: {
          nombre: { type: 'string', example: 'Balón de baloncesto' },
          codigo: { type: 'string', example: 'BAL-999' },
          precio: { type: 'number', format: 'float', example: 49.99 },
          categoria: { type: 'string', example: 'Baloncesto' },
          stock: { type: 'integer', example: 25 }
        }
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string' },
          email: { type: 'string' },
          telefono: { type: 'string' },
          direccion: { type: 'string' }
        }
      },
      ClientCreateRequest: {
        type: 'object',
        required: ['nombre', 'email', 'telefono'],
        properties: {
          nombre: { type: 'string', example: 'Carlos Díaz' },
          email: { type: 'string', example: 'carlos@example.com' },
          telefono: { type: 'string', example: '+57 3001234567' },
          direccion: { type: 'string', example: 'Calle 123 #4-56' }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          productId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          clienteId: { type: 'string', format: 'uuid' },
          usuarioId: { type: 'string', format: 'uuid' },
          fecha: { type: 'string', format: 'date-time' },
          estado: { type: 'string', enum: ['pendiente', 'preparando', 'entregado'] },
          total: { type: 'number', format: 'float' }
        }
      },
      OrderCreateRequest: {
        type: 'object',
        required: ['clienteId', 'items'],
        properties: {
          clienteId: { type: 'string', format: 'uuid', example: '7e8f3c3d-1dcb-4c54-9f4f-53e280d1a0f2' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
            example: [
              { productId: 'b3ab65cf-63d1-4d9a-9c80-15d2ac3d5c60', quantity: 2 },
              { productId: 'd9a85932-80d6-4feb-b034-4520fdfa3a8b', quantity: 1 }
            ]
          },
          sensitiveData: {
            type: 'object',
            properties: {
              notasInternas: { type: 'string', example: 'Entregar antes de las 10am' },
              pagoReferencia: { type: 'string', example: 'TRANS-987654' }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'object' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const apis = ['./src/modules/**/routes/*.ts'];

export const swaggerSpec = swaggerJsdoc({ swaggerDefinition, apis });
