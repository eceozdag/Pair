import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import wineRoutes from './api/routes/wines';
import pairingRoutes from './api/routes/pairings';
import authRoutes from './api/routes/auth';
import recognitionRoutes from './api/routes/recognition';
import logger from './utils/logger';

const app = express();

// Middleware
// In development, allow all origins for easier testing
const isDev = process.env.NODE_ENV !== 'production';
app.use(cors({
    origin: isDev ? true : (process.env.ALLOWED_ORIGINS?.split(',') || []),
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
app.use('/api/recognition', recognitionRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.message, err);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

export default app;