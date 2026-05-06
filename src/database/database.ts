import Database from 'better-sqlite3';
import path from 'path';

// Chemin vers le fichier de base de données
const dbPath = path.join(__dirname, '../../database.sqlite');

// Connexion à la base de données
const db = new Database(dbPath);

// Création des tables si elles n'existent pas
function initDatabase(): void {

    // Table des utilisateurs
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log(' Base de données initialisée');
}

// Initialiser au démarrage
initDatabase();

export default db;
