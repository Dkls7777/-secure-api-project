 

#  Secure API Project

API REST sécurisée développée avec **Node.js** et **TypeScript**, 
dans le cadre d'un projet perso de cybersécurité .

##  Objectif du projet

Ce projet simule une application réelle d'entreprise avec :
- Une API de gestion d'utilisateurs
- Des mécanismes de sécurité professionnels
- Des vulnérabilités volontaires documentées et corrigées
- Des tests de sécurité avec des outils professionnels

##  Technologies utilisées

| Technologie | Rôle |
|---|---|
| Node.js | Environnement d'exécution JavaScript |
| TypeScript | Typage statique pour plus de robustesse |
| Express | Framework pour créer l'API REST |
| SQLite | Base de données légère |
| JWT | Authentification par tokens |
| bcrypt | Chiffrement des mots de passe |

##  Fonctionnalités de sécurité

-  Authentification JWT
-  Hash des mots de passe avec bcrypt
-  Validation et sanitisation des inputs
-  Protection contre les injections SQL
-  Protection contre les attaques XSS

##  Vulnérabilités démontrées (environnement isolé)

Dans un but pédagogique, ce projet démontre et corrige :
-  SQL Injection → puis correction par requêtes préparées
-  XSS (Cross-Site Scripting) → puis correction par échappement
-  Mauvaise gestion des tokens JWT → puis correction

##  Outils de test de sécurité

- **Burp Suite** — Interception et modification des requêtes HTTP
- **OWASP ZAP** — Scan automatique de vulnérabilités
- **Nmap** — Scan des ports ouverts

##  Lancer le projet

```bash
# Cloner le repo
git clone https://github.com/Dkls7777/-secure-api-project.git

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Tester
http://localhost:3000/health
```

##  Structure du projet
src/
├── routes/          # Endpoints de l'API
├── controllers/     # Logique métier
├── middleware/      # Authentification JWT, validation
├── database/        # Connexion base de données
└── types/           # Définitions TypeScript

## 👤 Auteur

**Dkls7777** 
