# RidSportPro Native App Deployment Guide

## Översikt
Den här guiden visar hur du lanserar RidSportPro som native apps på App Store (iOS) och Google Play Store (Android) med Expo.

## Kostnader
- **Apple Developer Program**: $99/år (för iOS App Store)
- **Google Play Console**: $25 engångsavgift (för Android)
- **Expo EAS Build**: $29/månad (valfritt, kan bygga lokalt gratis)

## Steg 1: Förberedelser

### Skapa konton
1. **Expo-konto**: Registrera på https://expo.dev
2. **Apple Developer**: https://developer.apple.com (för iOS)
3. **Google Play Console**: https://play.google.com/console (för Android)

### Installera verktyg
```bash
npm install -g @expo/cli eas-cli
cd native-app
npm install
```

## Steg 2: Konfigurera appen

### Firebase konfiguration
1. Kopiera Firebase-konfigurationen från din web-app
2. Lägg till iOS och Android-appar i Firebase Console
3. Ladda ner `google-services.json` (Android) och `GoogleService-Info.plist` (iOS)

### App-konfiguration
Redigera `native-app/app.json`:
```json
{
  "expo": {
    "name": "RidSportPro",
    "slug": "ridsportpro",
    "ios": {
      "bundleIdentifier": "com.dindomän.ridsportpro"
    },
    "android": {
      "package": "com.dindomän.ridsportpro"
    }
  }
}
```

## Steg 3: Testa appen

### Lokal utveckling
```bash
cd native-app
npx expo start
```

Skanna QR-koden med Expo Go-appen för att testa på din telefon.

### Bygga testversion
```bash
npx eas build --platform all --profile preview
```

## Steg 4: Bygga för produktion

### iOS-bygge
```bash
npx eas build --platform ios --profile production
```

### Android-bygge
```bash
npx eas build --platform android --profile production
```

## Steg 5: Skicka till App Stores

### iOS App Store
1. Bygga appen: `npx eas build --platform ios`
2. Skicka till App Store: `npx eas submit --platform ios`
3. Konfigurera app-information i App Store Connect
4. Skicka för granskning (1-7 dagar)

### Google Play Store
1. Bygga appen: `npx eas build --platform android`
2. Skicka till Play Store: `npx eas submit --platform android`
3. Konfigurera butikspresentation
4. Släpp till produktion (1-3 dagar)

## Steg 6: App Store-optimering

### iOS App Store
- **App-namn**: RidSportPro
- **Undertitel**: Ridhantering för ryttare och tränare
- **Nyckelord**: ridning, hästar, lektioner, träning, sport
- **Beskrivning**: Komplett system för ridhantering med booking, meddelanden och progressuppföljning
- **Skärmdumpar**: Krävs för olika skärmstorlekar
- **Kategori**: Sports

### Google Play Store
- **Titel**: RidSportPro - Ridhantering
- **Kort beskrivning**: Boka lektioner, följ progress, kommunicera med tränare
- **Lång beskrivning**: Detaljerad beskrivning av funktioner
- **Skärmdumpar**: Minst 2, upp till 8 bilder
- **Kategori**: Sports

## Funktioner i native-appen

### Kärna
- Firebase-autentisering
- Rollbaserad åtkomst (Ryttare, Tränare, Admin)
- Svenskt gränssnitt
- Offline-funktionalitet

### Skärmar
- Välkomstskärm
- Inloggning/registrering
- Dashboard med personlig välkomst
- Lektionsbokning
- Meddelandesystem
- Progressuppföljning
- Profilhantering

### Native-funktioner
- Push-notifieringar
- Offline-cachning
- Native navigation
- Enhetoptimering

## Tidsplan
- **Setup och konfiguration**: 1-2 dagar
- **Testning på enheter**: 3-5 dagar
- **App Store-granskning**: 1-7 dagar (iOS), 1-3 dagar (Android)
- **Total tid till lansering**: 1-2 veckor

## Nästa steg
1. Skapa utvecklarkonton
2. Konfigurera Firebase för mobil
3. Testa appen på riktiga enheter
4. Förbered marknadsföringsmaterial
5. Skicka för App Store-granskning
6. Planera lanseringskampanj

## Support och resurser
- **Expo dokumentation**: https://docs.expo.dev
- **App Store riktlinjer**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play riktlinjer**: https://support.google.com/googleplay/android-developer/answer/9899234

Med den här strukturen kan RidSportPro lanseras som professionella native-appar på båda plattformarna med minimal utvecklingstid och kostnad.