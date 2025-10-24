import express from 'express';
import bodyParser from 'body-parser';
import wineRoutes from './api/routes/wines';
import pairingRoutes from './api/routes/pairings';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/wines', wineRoutes);
app.use('/api/pairings', pairingRoutes);

// Error handling
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('Something went wrong!');
});

export default app;