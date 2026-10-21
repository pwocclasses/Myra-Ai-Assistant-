# MAYRA AI — Android Installation & APK Build Guide

MAYRA AI ko aapke Android phone par chalane ke liye 3 asaan tareeqe hain:

---

### Option 1: 1-Tap Direct WebAPK Installation (Sabse Asaan & Recommended ⭐)
Is tareeqe mein aapko koi software install nahi karna padega:
1. Apne Android phone ke **Google Chrome** browser mein MAYRA AI app kholein.
2. App ke header par **"📲 Install Android App"** button par tap karein ya Chrome ke **3 dots (Menu)** par tap karke **"Install App"** ya **"Add to Home screen"** dabayein.
3. Chrome turant ise ek **official Android WebAPK** ki tarah install kar dega.
4. MAYRA AI aapke phone ke app drawer aur home screen par aayegi with its full cybernetic icon and standalone full-screen window (bina kisi browser bar ke).

---

### Option 2: 1-Click APK Generator (PWABuilder)
1. [PWABuilder.com](https://www.pwabuilder.com) par jayein.
2. MAYRA AI ka live URL dalein:
   `https://ais-dev-6hortlhjcrk6r25wiqpcup-266735033529.asia-east1.run.app`
3. **"Package for Android"** par click karein.
4. Direct signed `.apk` file download karein aur apne Android phone mein install karein!

---

### Option 3: Android Studio Native Project Build
Is repository mein complete native Android project source files included hain:
- Manifest: `/android/app/src/main/AndroidManifest.xml`
- Kotlin Activity: `/android/app/src/main/java/ai/mayra/companion/MainActivity.kt`

Steps:
1. Android Studio kholein aur `/android` folder ko as a project import karein.
2. Build Menu ➔ **Generate Signed Bundle / APK** par click karein.
3. Select **APK** ➔ Release APK generate ho jayegi!
