import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/index';

// On étend le type Request d'Express pour y ajouter l'utilisateur
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// ============================
// MIDDLEWARE JWT SÉCURISÉ
// ============================
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Récupérer le token dans le header Authorization
    // Format attendu : "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Si pas de token → refus
    if (!token) {
        res.status(401).json({
            error: 'Accès refusé — Token manquant'
        });
        return;
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Ajouter l'utilisateur à la requête
        req.user = decoded;

        // Passer à la route suivante
        next();

    } catch (error) {
        res.status(401).json({
            error: 'Token invalide ou expiré'
        });
    }
};