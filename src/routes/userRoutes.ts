import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import db from '../database/database';
import { User } from '../types/index';

const router = Router();

// ============================
// GET /api/users
// Route PROTÉGÉE — nécessite un token JWT valide
// ============================
router.get('/', authenticateToken, (req: Request, res: Response) => {
    try {
        // Récupérer tous les utilisateurs SANS leur mot de passe
        const users = db.prepare(`
      SELECT id, username, email, role, created_at 
      FROM users
    `).all() as User[];

        res.json({
            message: 'Liste des utilisateurs',
            count: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;