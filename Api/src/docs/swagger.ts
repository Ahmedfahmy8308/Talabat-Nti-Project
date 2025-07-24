import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Talbat API',
      version: '1.0.0',
      description:
        'A comprehensive food delivery platform API built with Express.js, TypeScript, and MongoDB',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
      {
        url: 'https://api.talbat.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>',
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'User',
        description: 'User profile management endpoints',
      },
      {
        name: 'Admin',
        description: 'Admin management endpoints (Admin only)',
      },
      {
        name: 'Restaurant - Management',
        description: 'Restaurant meal management endpoints (Restaurant only)',
      },
      {
        name: 'Restaurant - Public',
        description: 'Public restaurant endpoints (All authenticated users)',
      },
      {
        name: 'Delivery',
        description: 'Delivery management endpoints (Delivery personnel only)',
      },
    ],
    paths: {},
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/*/routes.ts', './src/modules/*/routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
