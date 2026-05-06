import vulnerableRoutes from './routes/vulnerableRoutes';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import './database/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vulnerable', vulnerableRoutes);
// Route de test
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API opérationnelle',
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
    console.log(`Test : http://localhost:${PORT}/health`);
});