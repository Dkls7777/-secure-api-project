import { Router } from 'express';
import {
    vulnerableLogin,
    secureLogin,
    vulnerableRegister,
    secureRegister,
    vulnerableTokenVerify,
    secureTokenVerify
} from '../controllers/vulnerableController';

const router = Router();

// =============================
// FAILLE 1 — SQL INJECTION
// =============================
router.post('/login', vulnerableLogin);
router.post('/secure-login', secureLogin);

// =============================
// FAILLE 2 — XSS
// =============================
router.post('/register', vulnerableRegister);
router.post('/secure-register', secureRegister);

// =============================
// FAILLE 3 — MAUVAISE GESTION JWT
// =============================

//  Route VULNÉRABLE — accepte n'importe quel token
router.get('/verify-token', vulnerableTokenVerify);

//  Route SÉCURISÉE — vérifie signature + algorithme
router.get('/secure-verify-token', secureTokenVerify);

export default router;