import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes';

const app: Application = express();

// Middleware
// Middleware
app.use(cors({
    origin: [config.cors.origin, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
app.use('/api/', rateLimiter);

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🔗 CORS enabled for: ${config.cors.origin}`);
});

export default app;
