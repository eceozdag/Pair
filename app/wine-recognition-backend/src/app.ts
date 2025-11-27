import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import wineRoutes from './api/routes/wines';
import pairingRoutes from './api/routes/pairings';
import authRoutes from './api/routes/auth';
import logger from './utils/logger';

const app = express();

// Middleware
// Configure CORS with allowed origins from environment
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19006', 'exp://localhost:19000', 'http://localhost:3000'];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'WineMate Backend API', status: 'running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wines', wineRoutes);
app.use('/api/pairings', pairingRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.message, err);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

export default app;