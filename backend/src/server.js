import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Middleware configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Nexus Backend' });
});
app.use('/api', routes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// 404 handler - must be after all other routes but before error handler
app.use((req, res, next) => {
    const error = new Error(`Route ${req.method} ${req.path} not found`);
    error.statusCode = 404;
    next(error);
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server

app.listen(3000, () => {
    console.log("Server Started Successfully")
})

export { app };
