# SecureAPI

Une API REST sécurisée construite avec Node.js, Express et SQLite, incluant l'authentification JWT et la gestion des utilisateurs.

## Fonctionnalités

- 🔐 **Authentification JWT** avec access tokens et refresh tokens
- 👥 **Gestion des utilisateurs** avec rôles
- 📦 **CRUD complet** pour produits, catégories, utilisateurs et tokens
- 🔍 **Filtrage avancé** avec opérateurs Sequelize (JSON:API)
- 📄 **Pagination et tri** des résultats
- 🍪 **Cookies HTTP-only** pour les refresh tokens
- 🗄️ **SQLite** comme base de données
- ✨ **ESLint** pour la qualité du code

## Technologies

- Node.js
- Express 5
- Sequelize ORM
- SQLite3
- JWT (jsonwebtoken)
- bcrypt pour le hachage des mots de passe
- cookie-parser

## Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd SecureAPI
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifiez `.env` selon vos besoins :
```env
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=5m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
```

### Régénérer la base de données

Pour réinitialiser complètement la base de données :

```bash
# Supprimer l'ancienne base de données
rm data/database.sqlite

# Recréer la structure
sqlite3 data/database.sqlite < create.sql

# Peupler avec des données de test
node src/seed.js
```

## Utilisation

### Démarrer le serveur

**Mode production :**
```bash
npm start
```

**Mode développement (avec nodemon) :**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Linting

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix
```

## API Endpoints

### Authentification

#### POST `/auth/login`
Connexion et obtention des tokens.

**Body :**
```json
{
  "username": "john",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
+ Cookie `rt` (refresh token)

#### POST `/auth/refresh`
Rafraîchir l'access token avec le refresh token.

**Headers :**
- Cookie: `rt=<refresh_token>`

**Réponse :**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/logout`
Déconnexion et suppression du cookie.

### Ressources CRUD

Format général : `GET /:table` où `table` peut être :
- `products`
- `categories`
- `users`
- `roles`
- `tokens`

#### GET `/:table`
Récupérer toutes les ressources avec pagination et filtrage.

**Query Parameters :**

**Pagination :**
- `page` : Numéro de page (défaut: 0)
- `count` : Nombre d'éléments par page (défaut: 50)

**Tri :**
- `sort` : Champs de tri séparés par virgule. Préfixe `-` pour ordre décroissant
  - Exemple : `sort=name,-price`

**Sélection de champs :**
- `fields` : Champs à retourner, séparés par virgule
  - Exemple : `fields=id,name,price`

**Filtrage simple :**
- `filter[field]=value` : Égalité exacte
  - Exemple : `filter[name]=test`

**Filtrage avec opérateurs :**
- `filter[field][operator]=value`

**Opérateurs supportés :**
- `eq` : égal
- `ne` : différent
- `gt` : supérieur
- `gte` : supérieur ou égal
- `lt` : inférieur
- `lte` : inférieur ou égal
- `like` : correspond au motif (SQL LIKE)
- `notLike` : ne correspond pas au motif
- `in` : dans la liste (valeurs séparées par virgule)
- `notIn` : pas dans la liste
- `between` : entre deux valeurs

**Exemples :**
```bash
# Produits avec prix > 100
GET /products?filter[price][gt]=100

# Produits avec stock entre 10 et 100
GET /products?filter[stock][gte]=10&filter[stock][lte]=100

# Produits dont le nom contient "test"
GET /products?filter[name][like]=%test%

# Catégories 1, 2 ou 3
GET /products?filter[categoryId][in]=1,2,3

# Page 2, 20 éléments, triés par prix décroissant
GET /products?page=2&count=20&sort=-price
```

**Inclusion de relations :**
- `include` : Relations à inclure (si définies dans le modèle)
  - Exemple : `include=category,role`

**Réponse :**
```json
{
  "total": 100,
  "currentPage": 0,
  "totalPages": 5,
  "entries": [...]
}
```

#### POST `/:table`
Créer une nouvelle ressource.

**Body :**
```json
{
  "name": "Nouveau produit",
  "price": 29.99,
  "stock": 100,
  "categoryId": 1
}
```

## Structure de la base de données

### Tables

- **Role** : Rôles utilisateurs (admin, user, etc.)
- **User** : Utilisateurs avec authentification
- **Category** : Catégories de produits
- **Product** : Produits avec stock et prix
- **Token** : Refresh tokens pour l'authentification

Voir `create.sql` pour le schéma complet.

## Structure du projet

```
SecureAPI/
├── data/              # Base de données SQLite
├── models/            # Modèles Sequelize générés
├── routes/            # Routes Express
│   ├── auth.js        # Authentification
│   └── entries.js     # CRUD générique
├── src/               # Code source
│   ├── authfunctions.js
│   ├── tokenfunctions.js
│   └── middlewares.js
├── create.sql         # Schéma de base de données
├── index.js           # Point d'entrée
├── package.json
└── eslint.config.js
```

## Scripts disponibles

- `npm start` : Démarrer le serveur
- `npm run dev` : Démarrer en mode développement
- `npm run lint` : Vérifier le code avec ESLint
- `npm run lint:fix` : Corriger automatiquement les erreurs ESLint
- `npm run sequelize` : Regénérer les modèles depuis la base de données

## Sécurité

- ✅ Mots de passe hachés avec bcrypt
- ✅ Tokens JWT avec expiration
- ✅ Refresh tokens stockés en HTTP-only cookies
- ✅ Cookies sécurisés (Secure, SameSite)
- ✅ Clés étrangères activées (SQLite)
- ✅ Variables d'environnement pour les secrets

## Auteur

**yomarhub**

## Licence

UNLICENSED
