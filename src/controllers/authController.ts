import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/database';
import { RegisterInput, LoginInput, User } from '../types/index';

// ============================
// INSCRIPTION
// ============================
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password }: RegisterInput = req.body;

        // Vérifier que tous les champs sont présents
        if (!username || !email || !password) {
            res.status(400).json({
                error: 'Tous les champs sont obligatoires (username, email, password)'
            });
            return;
        }

        // Vérifier que le mot de passe fait au moins 6 caractères
        if (password.length < 6) {
            res.status(400).json({
                error: 'Le mot de passe doit faire au moins 6 caractères'
            });
            return;
        }

        // Chiffrer le mot de passe avec bcrypt
        // Le "12" est le salt factor — plus c'est élevé, plus c'est sécurisé mais lent
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insérer l'utilisateur en base de données
        const stmt = db.prepare(`
      INSERT INTO users (username, email, password) 
      VALUES (?, ?, ?)
    `);

        const result = stmt.run(username, email, hashedPassword);

        res.status(201).json({
            message: 'Compte créé avec succès',
            userId: result.lastInsertRowid
        });

    } catch (error: any) {
        // Si l'email ou username existe déjà
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'Cet email ou username existe déjà' });
            return;
        }
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ============================
// CONNEXION
// ============================
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: LoginInput = req.body;

        // Vérifier que les champs sont présents
        if (!email || !password) {
            res.status(400).json({
                error: 'Email et mot de passe obligatoires'
            });
            return;
        }

        // Chercher l'utilisateur en base de données
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User;

        // Si l'utilisateur n'existe pas
        if (!user) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            return;
        }

        // Vérifier le mot de passe avec bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            return;
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
