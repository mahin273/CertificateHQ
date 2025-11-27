import app from '../src/server';
import { initDB } from '../src/db';

// Initialize DB on cold start (it will be empty each time on Vercel)
initDB().catch(console.error);

export default app;
