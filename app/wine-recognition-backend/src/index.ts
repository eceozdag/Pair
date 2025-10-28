import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';
import connectDatabase from './config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Start Express server
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on http://localhost:${PORT}`);
            logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
});

startServer();