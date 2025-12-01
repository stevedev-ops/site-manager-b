import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes';

const app: Application = express();

// Trust proxy - Required when running behind a reverse proxy (e.g., Render, Nginx)
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: [config.cors.origin, 'http://localhost:3000', 'http://localhost:5173', 'https://site-mananger-f.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
app.use('/api/', rateLimiter);

// Root route - Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Construction Site Management API',
        version: '1.0.0',
        endpoints: {
            api: '/api',
            health: '/health'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

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
