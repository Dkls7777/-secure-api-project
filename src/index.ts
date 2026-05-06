import express from 'express';
import dotenv from 'dotenv';

// Charge les variables du fichier .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permet de lire le JSON dans les requêtes
app.use(express.json());

// Route de test pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API opérationnelle',
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(` Serveur lancé sur http://localhost:${PORT}`);
    console.log(` Test : http://localhost:${PORT}/health`);
});
