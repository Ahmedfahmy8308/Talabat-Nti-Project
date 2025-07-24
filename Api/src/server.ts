import App from './app';

const PORT = parseInt(process.env.PORT || '5000', 10);

const app = new App();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT);
