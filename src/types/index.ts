// Structure d'un utilisateur en base de données
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
}

// Ce qu'on reçoit quand un utilisateur s'inscrit
export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

// Ce qu'on reçoit quand un utilisateur se connecte
export interface LoginInput {
    email: string;
    password: string;
}

// Ce que contient un token JWT
export interface JwtPayload {
    userId: number;
    username: string;
    role: string;
}