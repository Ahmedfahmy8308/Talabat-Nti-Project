import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import { connectDB } from './config/database';
import { initializeApp } from './config/startup';
import { errorHandler } from './modules/shared/middlewares/error.middleware';

// Import routes
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/user/routes';
import adminRoutes from './modules/admin/routes';
import restaurantRoutes from './modules/restaurant/routes';
import deliveryRoutes from './modules/delivery/routes';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      }),
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Body parsing middleware
    this.app.use(
      express.json({
        limit: '10mb',
        verify: (req: any, res: any, buf: Buffer) => {
          try {
            JSON.parse(buf.toString());
          } catch (e) {
            res.status(400).json({
              success: false,
              message: 'Invalid JSON format',
            });
            return;
          }
        },
      }),
    );
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: '10mb',
      }),
    );

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(
        morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
      );
    }

    // Request timeout middleware
    this.app.use((req, res, next) => {
      req.setTimeout(30000, () => {
        res.status(408).json({
          success: false,
          message: 'Request timeout',
        });
      });
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'Talabat API is running',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      });
    });

    // API routes with versioning
    const API_VERSION = '/api/v1';

    this.app.use(`${API_VERSION}/auth`, authRoutes);
    this.app.use(`${API_VERSION}/users`, userRoutes);
    this.app.use(`${API_VERSION}/admin`, adminRoutes);
    this.app.use(`${API_VERSION}/restaurants`, restaurantRoutes);
    this.app.use(`${API_VERSION}/delivery`, deliveryRoutes);

    // Backward compatibility routes (without version)
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/user', userRoutes);
    this.app.use('/api/admin', adminRoutes);
    this.app.use('/api/restaurant', restaurantRoutes);
    this.app.use('/api/delivery', deliveryRoutes);

    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `API endpoint ${req.originalUrl} not found`,
        availableEndpoints: [
          `${API_VERSION}/auth`,
          `${API_VERSION}/users`,
          `${API_VERSION}/admin`,
          `${API_VERSION}/restaurants`,
          `${API_VERSION}/delivery`,
        ],
      });
    });

    // General 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        hint: 'Try accessing /api/v1/* endpoints or check /swagger for documentation',
      });
    });
  }

  private initializeSwagger(): void {
    // Swagger configuration
    const swaggerOptions = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Talabat API Documentation',
    };

    this.app.use(
      '/swagger',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, swaggerOptions),
    );
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, swaggerOptions),
    );
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await connectDB();
      console.log('Database connected successfully');

      // Initialize application (create admin user, etc.)
      await initializeApp();
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API Documentation: http://localhost:${port}/swagger`);
      console.log(`Health Check: http://localhost:${port}/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

export default App;

// Initialize and start the server directly
const startServer = async (): Promise<void> => {
  try {
    const app = new App();
    const PORT = parseInt(process.env.PORT || '5000', 10);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔴 SIGTERM received, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('🔴 SIGINT received, shutting down gracefully');
      process.exit(0);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    app.listen(PORT);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}
