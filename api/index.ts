import app from '../src/server';
import { initDB } from '../src/db';

// Initialize DB before handling requests
let dbInitialized = false;

// Middleware to ensure DB is initialized
app.use(async (req, res, next) => {
    if (!dbInitialized) {
        try {
            await initDB();
            dbInitialized = true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }
    next();
});

export default app;
