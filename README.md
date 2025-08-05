# 📦 Subscription App

> Application fullstack de **gestion d'abonnements**, avec une **authentification sécurisée via JWT**, développée avec **Angular** et **Spring Boot**.
> https://subscription-app-wine.vercel.app/

---

## 🚀 Fonctionnalités

- ✅ Création et connexion d'utilisateurs avec tokens JWT  
- ✅ Interface utilisateur responsive développée avec Angular 19  
- ✅ API REST sécurisée avec Spring Boot 3 & Spring Security  
- ✅ Gestion des rôles (`USER`, `ADMIN`) et autorisations  
- ✅ Architecture modulaire (frontend et backend bien séparés)  
- ✅ Sécurité renforcée : mots de passe hashés avec BCrypt  
- ✅ Intégration d’une base de données PostgreSQL (ou H2 pour la démo)  

---

## 🛠️ Stack technique

| Frontend   | Backend        | Sécurité        | Base de données   |
|------------|----------------|------------------|--------------------|
| Angular 19 | Spring Boot 3.4| Spring Security  | PostgreSQL / H2    |
| TypeScript | Java 17+       | JWT + BCrypt     | JPA / Hibernate    |

---

## 📸 Aperçu de l'application

![image](https://github.com/user-attachments/assets/fe987dce-66bf-4ef9-b627-9f81b88228c7)

---

## 🧪 Lancer le projet en local

### Prérequis

- [Node.js](https://nodejs.org/) (version 18+)
- [Angular CLI](https://angular.io/cli)
- [Java 17 ou 19](https://adoptium.net)
- [Maven](https://maven.apache.org)
- [Docker](https://www.docker.com/) (optionnel)
- (PostgreSQL en local OU H2 en mémoire)

---

### ▶️ Démarrage du backend

```bash
cd backend/subscription-manager
mvn clean package
java -jar target/Subscription-Manager-0.0.1-SNAPSHOT.jar
```

👉 **L'API tourne sur** [http://localhost:8080](http://localhost:8080)

> Pour une base de données embarquée (H2), aucun setup n’est nécessaire.

---

### ▶️ Démarrage du frontend

```bash
cd frontend
npm install
ng serve
```

👉 **L’interface tourne sur** [http://localhost:4200](http://localhost:4200)

---

## 📦 Déploiement

- 🖥️ **Frontend déployé sur [Vercel]([https://vercel.com](https://subscription-app-wine.vercel.app))**
- 🐳 **Backend déployé sur [Render]([https://render.com](https://subscription-app-0f5f.onrender.com)) via Docker**

> Voir le `Dockerfile` dans le dossier `backend/subscription-manager`

---

## 🔐 Authentification

- Les routes protégées nécessitent un **token JWT valide**
- Les rôles sont définis côté **backend (Spring Security)**
- Le token est stocké côté **frontend** et injecté dans les requêtes API

---

## 📁 Architecture des dossiers

```
subscription-app/
├── backend/
│   └── subscription-manager/   → Spring Boot app (API REST)
├── frontend/                   → Angular 19 (interface utilisateur)
```

---

## 🧑‍💻 Auteur·rice

Développé avec ❤️ par **Sandra**

---

## 📝 Licence

Projet open-source sous licence **MIT**


