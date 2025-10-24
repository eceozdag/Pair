import express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { logger } from './utils/logger';
import { apiRouter } from './api/routes';

const app = express();
const server = createServer(app);

app.use(json());
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});