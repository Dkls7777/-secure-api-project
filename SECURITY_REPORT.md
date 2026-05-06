# 🔐 Rapport de Tests de Sécurité

## Phase 3 — Failles & Corrections

### 1. Middleware JWT

**Sans token → Accès refusé :**

![Middleware 401](screenshots/phase3_middleware_401.png)

**Avec token → Accès accordé :**

![Middleware 200](screenshots/phase3_middleware_200.png)

---

### 2. SQL Injection

**Attaque réussie sur la route vulnérable :**

![SQL Injection Attack](screenshots/phase3_sqli_attack.png)

**Attaque bloquée sur la route sécurisée :**

![SQL Injection Blocked](screenshots/phase3_sqli_blocked.png)

---

### 3. XSS (Cross-Site Scripting)

**Script malveillant stocké sur la route vulnérable :**

![XSS Attack](screenshots/phase3_xss_attack.png)

**Script neutralisé sur la route sécurisée :**

![XSS Blocked](screenshots/phase3_xss_blocked.png)

---

### 4. Mauvaise gestion JWT

**Faux token admin accepté (algorithme none) :**

![JWT Forged](screenshots/phase3_jwt_forged.png)

**Faux token rejeté (jwt.verify + HS256) :**

![JWT Blocked](screenshots/phase3_jwt_blocked.png)

---

## Phase 4 — Tests de Sécurité

### 1. Nmap — Scan des ports

**Scan global :**

![Nmap Global](screenshots/phase4_nmap_global.png)

**Scan ciblé port 3000 :**

![Nmap Port 3000](screenshots/phase4_nmap_3000.png)

| Port | Service | Risque en production |
|---|---|---|
| 3000 | Node.js Express | Protéger avec Nginx |
| 3306 | MySQL 8.0.44 | Fermer avec firewall |

---

### 2. Burp Suite — Interception des requêtes

**Connexion normale interceptée :**

![Burp Login](screenshots/phase4_burp_login.png)

**SQL Injection depuis Burp Suite :**

![Burp SQLi](screenshots/phase4_burp_sqli.png)

---

### 3. OWASP ZAP — Scan automatique

**3 alertes détectées :**

![ZAP Alerts](screenshots/phase4_zap_alerts.png)

| Alerte | Niveau | Correction |
|---|---|---|
| CSP manquante | Moyen | Content-Security-Policy header |
| X-Powered-By exposé | Faible | app.disable('x-powered-by') |
| X-Content-Type-Options manquant | Faible | Header nosniff |

---

## Corrections recommandées en production

```javascript
// Ajouter Helmet.js pour tous les headers de sécurité
import helmet from 'helmet';
app.use(helmet());

// Supprimer X-Powered-By
app.disable('x-powered-by');
```

> En production : Nginx comme reverse proxy + Firewall pour fermer les ports inutiles