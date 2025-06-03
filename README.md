# RidSportPro - Multi-Tenant Ridhanteringssystem

RidSportPro är en komplett SaaS-plattform för svenska ridskolor med multi-tenant arkitektur, Firebase-autentisering och native mobilappar.

## 🚀 Funktioner

### Web Application (PWA)
- **Multi-tenant arkitektur** - Stöd för flera ridskolor med separat data
- **Rollbaserad åtkomst** - Ryttare, Tränare och Admin-roller
- **Firebase Authentication** - Säker inloggning och användarhantering
- **Lektionsbokning** - Komplett bokningssystem med kalenderintegration
- **Meddelandesystem** - Kommunikation mellan ryttare och tränare
- **Progressuppföljning** - Detaljerade rapporter och utvecklingsspårning
- **PWA-stöd** - Installeras som native app på mobil och desktop
- **Svenskt gränssnitt** - Fullständigt lokaliserat för svenska användare

### Native Apps (Expo)
- **iOS & Android** - Äkta native appar för App Store och Google Play
- **Offline-funktionalitet** - Cachad data för användning utan internet
- **Push-notifikationer** - Påminnelser om lektioner och meddelanden
- **Native UX** - Optimerad användarupplevelse för mobila enheter

## 🏗️ Teknisk Stack

### Frontend
- **React 18** - Moderna komponenter med hooks
- **TypeScript** - Type-safe utveckling
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Högkvalitativa UI-komponenter
- **React Query** - Server state management
- **Wouter** - Lättviktig routing

### Backend
- **Express.js** - RESTful API server
- **PostgreSQL** - Relationsdatabas med multi-tenant stöd
- **Drizzle ORM** - Type-safe databas-queries
- **Firebase Auth** - Autentisering och sessionshantering

### Native Apps
- **Expo** - React Native utvecklingsplattform
- **EAS Build** - Cloud-baserad app-byggning
- **Expo Router** - File-based navigation

## 🛠️ Installation och Setup

### 1. Klona Repository
```bash
git clone https://github.com/dittusername/ridsportpro.git
cd ridsportpro
```

### 2. Installera Dependencies
```bash
npm install
```

### 3. Konfigurera Environment Variables
Skapa `.env` fil med:
```env
DATABASE_URL=postgresql://...
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Databas
```bash
npm run db:push
```

### 5. Starta Development Server
```bash
npm run dev
```

Applikationen körs på `http://localhost:5000`

## 📱 Native App Development

### Setup Expo Project
```bash
cd native-app
npm install
npx expo start
```

### Bygga för Production
```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

## 🏢 Multi-Tenant Arkitektur

### Ridskole-separation
- Varje ridskola får egen subdomain: `ridskola.ridsportpro.se`
- Fullständig dataisolation mellan ridskolor
- Anpassbar branding (färger, logotyp)
- Oberoende användarhantering

### Exempel Ridskolor (Demo)
- Stockholms Ridskola - `stockholms-ridskola.ridsportpro.se`
- Göteborgs Ridklubb - `goteborgs-ridklubb.ridsportpro.se`
- Malmö Ridcenter - `malmo-ridcenter.ridsportpro.se`

## 💰 Affärsmodell

### SaaS Pricing
- **Starter**: 990 kr/månad (upp till 50 ryttare)
- **Professionell**: 1990 kr/månad (upp till 200 ryttare)
- **Enterprise**: 3990 kr/månad (obegränsat + API)

### Marknadspotential
- 200+ privata ridskolor i Sverige
- 800+ ridklubbar och föreningar
- Potential för 3,8M kr årlig omsättning vid 150 kunder

## 🚀 Deployment

### Web Application
1. **Replit Deployments** - Automatisk deployment från GitHub
2. **Vercel/Netlify** - Alternativ hosting för frontend
3. **Railway/Supabase** - Databas hosting

### Native Apps
1. **App Store** - iOS distribution (99 USD/år)
2. **Google Play** - Android distribution (25 USD engångsavgift)
3. **EAS Submit** - Automatiserad app store submission

## 📋 API Dokumentation

### REST Endpoints
- `GET /api/riding-schools` - Lista ridskolor
- `GET /api/users` - Användarhantering
- `GET /api/lessons` - Lektionshantering
- `POST /api/bookings` - Skapa bokning
- `GET /api/messages` - Meddelandesystem
- `POST /api/progress` - Progressrapporter

### Authentication
Alla API-calls kräver Firebase Authentication token i headers:
```
Authorization: Bearer <firebase_token>
```

## 🧪 Testing

### Enhetstester
```bash
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📂 Projektstruktur

```
ridsportpro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI komponenter
│   │   ├── pages/         # Applikationssidor
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities och konfiguration
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Databaslogik
│   └── db.ts              # Databasanslutning
├── shared/                # Delad kod
│   └── schema.ts          # Databas schema och typer
├── native-app/            # Expo React Native app
│   ├── app/               # Expo Router sidor
│   └── components/        # Native komponenter
└── docs/                  # Dokumentation
```

## 🤝 Bidrag

1. Fork projektet
2. Skapa feature branch (`git checkout -b feature/amazing-feature`)
3. Commit ändringar (`git commit -m 'Add amazing feature'`)
4. Push till branch (`git push origin feature/amazing-feature`)
5. Öppna Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🆘 Support

- **Email**: support@ridsportpro.se
- **Dokumentation**: [docs.ridsportpro.se](https://docs.ridsportpro.se)
- **GitHub Issues**: [GitHub Issues](https://github.com/dittusername/ridsportpro/issues)

## 🎯 Roadmap

### Q1 2025
- [x] Multi-tenant arkitektur
- [x] Firebase authentication
- [x] PWA funktionalitet
- [ ] Beta launch med 5 ridskolor

### Q2 2025
- [ ] Native app launch
- [ ] API för tredjepartsintegrationer
- [ ] Avancerad rapportering
- [ ] 50+ ridskolor

### Q3 2025
- [ ] Internationalisering (Norge, Danmark)
- [ ] AI-assisterad schemaläggning
- [ ] Integrationer med betalningssystem
- [ ] 150+ ridskolor

---

Byggt med ❤️ för den svenska ridsporten