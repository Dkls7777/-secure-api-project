import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// POST /api/auth/register → Inscription
router.post('/register', register);

// POST /api/auth/login → Connexion
router.post('/login', login);

export default router;
