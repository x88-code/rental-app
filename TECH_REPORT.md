# Rental App — Technical Report

## Overview

A full-stack rental property management application with a React Native mobile frontend and Express.js backend, deployed on Render with MongoDB.

---

## Tools & Technologies

### Languages

| Language | Usage |
|----------|-------|
| **JavaScript** | Backend API (Node.js/Express) |
| **TypeScript** | Frontend mobile app (React Native) |

---

### Frameworks & Libraries

#### Frontend (Mobile)

| Framework/Library | Purpose |
|-------------------|---------|
| **React Native** | Cross-platform mobile UI framework |
| **Expo** | Development build & deployment tooling |
| **NativeWind** | Tailwind CSS for React Native |
| **React Native Reanimated** | Smooth animations |
| **React Native Safe Area Context** | Device safe area handling |

#### Backend (API)

| Framework/Library | Purpose |
|-------------------|---------|
| **Express.js** | REST API server |
| **Mongoose** | MongoDB object modeling |
| **JSON Web Token (JWT)** | Authentication |
| **Bcryptjs** | Password hashing |
| **Helmet** | HTTP security headers |
| **CORS** | Cross-origin resource sharing |
| **Express Mongo Sanitize** | NoSQL injection prevention |
| **Morgan** | HTTP request logging |
| **Cookie Parser** | Cookie handling |

---

### Databases

| Database | Usage |
|----------|-------|
| **MongoDB** | Primary data store (hosted on MongoDB Atlas) |
| **Mongoose** | ODM for schema modeling & queries |

---

### DevOps & Deployment

| Tool | Usage |
|------|-------|
| **Render** | Backend hosting (Express server) |
| **EAS CLI** | Building Android APK |
| **Expo Application Services (EAS)** | Cloud APK build & distribution |
| **GitHub** | Version control & CI/CD trigger |
| **pnpm** | Package management (both projects) |

---

### Development Tools

| Tool | Usage |
|------|-------|
| **VS Code** | Code editor |
| **Node.js v22** | JavaScript runtime |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS (via NativeWind) |
| **Babel** | JavaScript transpilation |
| **Metro** | React Native bundler |
| **Nodemon** | Backend auto-restart on changes |

---

### Testing & Debugging

| Tool | Usage |
|------|-------|
| **Expo Dev Client** | In-development testing build |
| **Android Emulator** | Local Android testing |
| **Browser** | Login flow via EAS web auth |

---

## Architecture Summary

```
┌─────────────────────┐     ┌─────────────────────┐
│   Mobile App (APK)  │────▶│   Backend API       │
│   React Native      │     │   Express.js        │
│   Expo/EAS          │     │   Render            │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                                       ▼
                              ┌─────────────────────┐
                              │   MongoDB Atlas     │
                              │   (Database)        │
                              └─────────────────────┘
```

- **Frontend**: React Native + Expo, built with EAS into an APK
- **Backend**: Express.js REST API hosted on Render
- **Database**: MongoDB Atlas (cloud-hosted)
- **Auth**: JWT-based with bcrypt password hashing