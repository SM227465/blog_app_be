import path from 'path';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const isDevelopment = process.env.NODE_ENV === 'development';

const options: Options = {
  definition: {
    openapi: '3.1.1',
    info: {
      title: 'TMDB',
      description: 'TMDB API endpoints documented with Swagger',
      contact: {
        name: 'Raizo Jr',
        email: 'sm227465@gmail.com',
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://node-express-ts.onrender.com',
        description: 'Dev',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, `../routes/*.${isDevelopment ? 'ts' : 'js'}`)],
};

export const swaggerSpec = swaggerJsdoc(options);
