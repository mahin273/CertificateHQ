import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './db';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

async function startServer() {
    try {
        await initDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

// Initialize DB immediately when module loads (for Vercel)
initDB().catch(console.error);

export default app;

if (require.main === module) {
    startServer();
}
