import { Router } from 'express';
import {
    vulnerableLogin,
    secureLogin,
    vulnerableRegister,
    secureRegister
} from '../controllers/vulnerableController';

const router = Router();

// =============================
// FAILLE 1 — SQL INJECTION
// =============================

//  Route VULNÉRABLE — SQL Injection possible
router.post('/login', vulnerableLogin);

//  Route SÉCURISÉE — Requêtes préparées
router.post('/secure-login', secureLogin);

// =============================
// FAILLE 2 — XSS
// =============================

//  Route VULNÉRABLE — XSS possible
router.post('/register', vulnerableRegister);

//  Route SÉCURISÉE — Input nettoyé
router.post('/secure-register', secureRegister);

export default router;