# Stylinx

React Native e-commerce app. Login/signup with Firebase, browse products from EscuelaJS API, add to cart and checkout.

## How to Run

Install deps first:

```bash
npm install
```

Fire up the dev server:

```bash
npm start
```

Then in the terminal:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web

Or run directly:

```bash
npm run ios
npm run android
npm run web
```

## Firebase Setup

Rename `.env.example` to `.env` and paste your Firebase config. You need Email/Password auth enabled in Firebase Console.

## Build APK (Android)

### Method 1: Local Build (Recommended)

```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```

APK ends up at `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Using EAS Build

```bash
npm i -g eas-cli
eas login
eas build --platform android --profile preview
```

## Download APK

After building the APK using Method 1 above, you can find the APK file at:
```
android/app/build/outputs/apk/release/app-release.apk
```

Copy this file to share or install on Android devices.

## Install APK on Android

Follow these steps to install the APK on your Android device:

### Step 1: Enable Unknown Sources
1. Open **Settings** on your Android device
2. Go to **Security** or **Privacy** (varies by device)
3. Find **Install unknown apps** or **Unknown sources**
4. Select the app you'll use to install the APK (e.g., Chrome, Files, Gmail)
5. Toggle **Allow from this source** to ON

### Step 2: Transfer APK to Device
Choose one of these methods:
- **USB Cable**: Connect device to computer and copy APK to Downloads folder
- **Cloud Storage**: Upload APK to Google Drive/Dropbox and download on device
- **Email**: Send APK as email attachment and download on device
- **Direct Download**: Host APK on GitHub releases and download directly

### Step 3: Install APK
1. Open **Files** or **Downloads** app on your Android device
2. Navigate to where you saved the APK file
3. Tap on the **app-release.apk** file
4. Tap **Install** when prompted
5. Wait for installation to complete
6. Tap **Open** to launch the app

### Step 4: First Launch
1. Make sure you have internet connection
2. The app will show the Welcome screen
3. Tap **Get Started** to create an account or login

## What's Inside

- Welcome → Get Started → Signup/Login (Firebase)
- Home: category tabs (Women, Men, Accessories, Beauty), feature products, recommended, banners
- Discover: search and category filter
- Product detail: add to cart with qty, size, color
- Cart and checkout (shipping → payment → done)
- Profile and logout

Tech: Expo, TypeScript, Redux Toolkit, React Navigation, Firebase, EscuelaJS API.
