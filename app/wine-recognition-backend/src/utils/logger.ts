// Simple logger without external dependencies
class LoggerUtil {
    public info(message: string): void {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
    }

    public warn(message: string): void {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }

    public error(message: string, error?: any): void {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
    }

    public debug(message: string): void {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
}

const logger = new LoggerUtil();

export { logger };
export default logger;