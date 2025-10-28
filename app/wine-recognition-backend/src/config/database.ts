import mongoose from 'mongoose';
import logger from '../utils/logger';

export const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI ||
                        process.env.MONGO_PUBLIC_URL ||
                        process.env.MONGO_URL ||
                        'mongodb://localhost:27017/pair_wine_db';

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info('✅ MongoDB connected successfully');
        logger.info(`📍 Database: ${mongoose.connection.name}`);
        logger.info(`🌐 Host: ${mongoose.connection.host}`);
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    logger.error('❌ MongoDB error:', err);
});

mongoose.connection.on('reconnected', () => {
    logger.info('🔄 MongoDB reconnected');
});

export default connectDatabase;
