# 📦 Subscription App

> Application fullstack de gestion d'abonnements, avec authentification sécurisée via JWT, développée avec Angular et Spring Boot.

## 🚀 Fonctionnalités

- Création et connexion d'utilisateurs avec tokens JWT
- Interface utilisateur responsive (Angular 19)
- API REST sécurisée avec Spring Boot 3 & Spring Security
- Gestion des rôles et autorisations
- Architecture modulaire et claire (front et back séparés)
- Sécurité : hashage des mots de passe avec BCrypt
- Intégration d’une base de données PostgreSQL

---

## 🛠️ Stack technique

| Frontend | Backend       | Sécurité         | Base de données |
|----------|---------------|------------------|-----------------|
| Angular  | Spring Boot 3 | Spring Security  | PostgreSQL / H2 |
| TypeScript | Java 17     | JWT (Token)      | JPA / Hibernate |

---

## 📸 Aperçu

> À personnaliser avec des captures d’écran ou GIF de :
> - L’écran de connexion
> - Le tableau de bord après login
> - Une requête API avec token

---

## 🔧 Installation

### Prérequis

- Node.js (>= 18)
- Java 17
- PostgreSQL (ou H2 intégré pour tests)
- Maven

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
