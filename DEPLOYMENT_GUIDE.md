# Frontend Deployment Guide

## Översikt
Din svenska registreringsapplikation med Firebase-autentisering och rollhantering.

## Systemkrav
- Node.js 18+ 
- npm eller yarn
- Firebase-projekt

## Installation

### 1. Installera beroenden
```bash
npm install
```

### 2. Konfigurera Firebase
Skapa en `.env` fil i projektets root med dina Firebase-värden:

```
VITE_FIREBASE_API_KEY=din-api-nyckel
VITE_FIREBASE_PROJECT_ID=ditt-projekt-id  
VITE_FIREBASE_APP_ID=ditt-app-id
```

### 3. Firebase Console Setup
1. Gå till [Firebase Console](https://console.firebase.google.com/)
2. Aktivera Authentication > Email/Password
3. Lägg till din domän under Authorized domains
4. Aktivera Firestore Database

### 4. Bygg för produktion
```bash
npm run build
```

### 5. Testa lokalt
```bash
npm run preview
```

## Deployment alternativ

### Netlify
1. Dra `dist/` mappen till netlify.com
2. Lägg till environment variables i Netlify dashboard

### Vercel  
1. Koppla Git repository
2. Lägg till environment variables
3. Deploy automatiskt

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Viktiga filer
- `src/lib/firebase.ts` - Firebase konfiguration
- `src/components/auth-provider.tsx` - Autentisering
- `src/pages/` - Sidor (register, login, dashboard)
- `shared/schema.ts` - Datamodeller

## Funktioner
- Användarregistrering med roller (Ryttare, Tränare, Admin)
- Firebase Authentication
- Firestore för användardata
- Responsiv design
- Svenska språkstöd
- Rollbaserade dashboards