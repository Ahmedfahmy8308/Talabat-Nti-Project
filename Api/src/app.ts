import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import { connectDB } from './config/database';
import { errorHandler } from './middlewares/error.middleware';

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
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
    }
  }

  private initializeRoutes(): void {
    const apiVersion = process.env.API_VERSION || 'v1';

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'Talbat API is running',
        timestamp: new Date().toISOString(),
        version: apiVersion
      });
    });

    // API routes
    this.app.use(`/api/${apiVersion}/auth`, authRoutes);
    this.app.use(`/api/${apiVersion}/user`, userRoutes);
    this.app.use(`/api/${apiVersion}/admin`, adminRoutes);
    this.app.use(`/api/${apiVersion}/restaurant`, restaurantRoutes);
    this.app.use(`/api/${apiVersion}/delivery`, deliveryRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    });
  }

  private initializeSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await connectDB();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
    });
  }
}

export default App;
