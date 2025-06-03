# RidSportPro Native App - Expo Deployment Guide

## Overview
This is the native mobile app version of RidSportPro built with Expo. It provides iOS and Android apps that can be published to App Store and Google Play Store.

## Prerequisites
1. **Expo Account**: Create account at https://expo.dev
2. **Apple Developer Account** (for iOS): $99/year - https://developer.apple.com
3. **Google Play Console Account** (for Android): $25 one-time fee - https://play.google.com/console

## Setup Instructions

### 1. Install Dependencies
```bash
cd native-app
npm install
npx expo install --fix
```

### 2. Configure Firebase
1. Copy your Firebase config from the web app
2. Update `constants/Firebase.ts` with your credentials
3. Add iOS and Android apps in Firebase Console

### 3. Update App Configuration
Edit `app.json`:
- Replace bundle identifiers with your own
- Update app name and description
- Set your Expo project ID

### 4. Build Configuration
Edit `eas.json`:
- Add your Apple ID and team information
- Configure Android service account

## Development

### Start Development Server
```bash
npm start
```

### Run on Device/Simulator
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

## Building for Production

### 1. Create Expo Build Service Account
```bash
npx eas login
npx eas build:configure
```

### 2. Build iOS App
```bash
npm run build:ios
```
Requirements:
- Apple Developer Account
- iOS Distribution Certificate
- App Store Provisioning Profile

### 3. Build Android App
```bash
npm run build:android
```
Requirements:
- Google Play Console Account
- Upload Key (generated automatically)

## App Store Submission

### iOS App Store
1. Build completed app: `npm run build:ios`
2. Submit to App Store: `npm run submit:ios`
3. Configure app in App Store Connect
4. Submit for review

### Google Play Store
1. Build completed app: `npm run build:android`
2. Submit to Play Store: `npm run submit:android`
3. Configure store listing
4. Release to production

## Key Features Included

### Authentication
- Firebase Authentication integration
- Role-based access (Ryttare, Tränare, Admin)
- Swedish language interface

### Core Functionality
- Dashboard with personalized welcome
- Lesson booking and management
- User messaging system
- Progress tracking
- Profile management

### Native Features
- Push notifications
- Offline data caching
- Native navigation
- Device-specific optimizations

## Costs

### Development
- **Free**: Expo development and testing
- **$29/month**: Expo EAS Build service (optional, can build locally)

### App Store Distribution
- **$99/year**: Apple Developer Program (iOS)
- **$25 one-time**: Google Play Console (Android)

### Ongoing
- Firebase usage (free tier usually sufficient)
- Server hosting costs (existing)

## Timeline
- **Setup**: 1-2 days
- **Testing**: 1 week
- **App Store Review**: 1-7 days (iOS), 1-3 days (Android)
- **Total**: 2-3 weeks to live apps

## Next Steps
1. Set up Expo account and EAS CLI
2. Configure Firebase for mobile
3. Test app on physical devices
4. Submit for App Store review
5. Launch marketing campaigns

## Support
- Expo Documentation: https://docs.expo.dev
- Firebase Setup: https://firebase.google.com/docs
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/