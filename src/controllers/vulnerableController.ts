import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../database/database';

// ============================
// VERSION VULNÉRABLE — SQL Injection
// Recherche uniquement par email (sans vérification du mot de passe)
// ============================
export const vulnerableLogin = (req: Request, res: Response): void => {
    const { email } = req.body;

    //  DANGEREUX : l'input est collé directement dans la requête SQL
    const query = `SELECT id, username, email, role FROM users WHERE email = '${email}'`;

    console.log(' Requête SQL exécutée :', query);

    try {
        const user = db.prepare(query).get() as any;

        if (user) {
            res.json({
                message: 'Connexion réussie (VULNÉRABLE)',
                warning: 'Cette route est volontairement non sécurisée',
                user
            });
        } else {
            res.status(401).json({ error: 'Utilisateur introuvable' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// ============================
// VERSION SÉCURISÉE — Requêtes préparées
// ============================
export const secureLogin = (req: Request, res: Response): void => {
    const { email } = req.body;

    // SÉCURISÉ : paramètre (?) — l'input est une donnée, jamais du code SQL
    const user = db.prepare(
        'SELECT id, username, email, role FROM users WHERE email = ?'
    ).get(email) as any;

    console.log(' Requête préparée exécutée avec email :', email);

    if (user) {
        res.json({
            message: 'Connexion réussie (SÉCURISÉ)',
            user
        });
    } else {
        res.status(401).json({ error: 'Utilisateur introuvable' });
    }
};

// ============================
// XSS VULNÉRABLE — stocke le script sans nettoyer
// ============================
export const vulnerableRegister = (req: Request, res: Response): void => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: 'Champs manquants' });
        return;
    }

    // ❌ DANGEREUX : on stocke le username tel quel sans nettoyer
    const stmt = db.prepare(`
    INSERT INTO users (username, email, password) 
    VALUES (?, ?, ?)
  `);

    stmt.run(username, email, password);

    //  DANGEREUX : on renvoie le username sans l'échapper
    res.status(201).json({
        message: `Bienvenue ${username} !`,
        warning: 'XSS possible — username non échappé'
    });
};

// ============================
// XSS SÉCURISÉ — nettoie l'input avant de l'utiliser
// ============================
export const secureRegister = (req: Request, res: Response): void => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: 'Champs manquants' });
        return;
    }

    // SÉCURISÉ : on échappe les caractères dangereux
    const sanitizedUsername = username
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    res.status(201).json({
        message: `Bienvenue ${sanitizedUsername} !`,
        info: 'Username nettoyé — XSS impossible'
    });
};

// ============================
// FAILLE 3 — MAUVAISE GESTION JWT
// ============================

//  VULNÉRABLE — Accepte l'algorithme "none"
export const vulnerableTokenVerify = (req: Request, res: Response): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Token manquant' });
        return;
    }

    try {
        //  DANGEREUX : on ne vérifie pas l'algorithme
        // Un attaquant peut forger un token avec algorithm: "none"
        const decoded = jwt.decode(token) as any;

        if (!decoded) {
            res.status(401).json({ error: 'Token invalide' });
            return;
        }

        res.json({
            message: 'Accès accordé (VULNÉRABLE)',
            warning: 'Token non vérifié — algorithme none accepté !',
            user: decoded
        });

    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
};

//  SÉCURISÉ — Vérifie la signature et l'algorithme
export const secureTokenVerify = (req: Request, res: Response): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Token manquant' });
        return;
    }

    try {
        //  SÉCURISÉ : on vérifie la signature ET on force l'algorithme HS256
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
            algorithms: ['HS256']
        }) as any;

        res.json({
            message: 'Accès accordé (SÉCURISÉ)',
            info: 'Token vérifié — signature et algorithme validés',
            user: decoded
        });

    } catch (error) {
        res.status(401).json({ error: 'Token invalide ou algorithme non autorisé' });
    }
};