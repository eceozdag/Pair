import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import wineRoutes from './api/routes/wines';
import pairingRoutes from './api/routes/pairings';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors());
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
app.use('/api/wines', wineRoutes);
app.use('/api/pairings', pairingRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.message, err);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

export default app;