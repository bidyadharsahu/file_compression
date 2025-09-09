# Firebase Setup Instructions

This project has been migrated from Supabase to Firebase. Follow these steps to set up Firebase for your project:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "file-compression-app")
4. Enable Google Analytics if desired
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase console, go to "Authentication"
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Add your project domains to the authorized domains list

## 3. Set up Firestore Database

1. In your Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (you can modify rules later)
4. Select a location for your database

## 4. Set up Firebase Storage

1. In your Firebase console, go to "Storage"
2. Click "Get started"
3. Review the security rules and click "Done"

## 5. Get Your Firebase Configuration

1. Go to Project Settings (gear icon)
2. In the "General" tab, scroll down to "Your apps"
3. Click "Add app" and choose "Web" (</> icon)
4. Register your app with a name
5. Copy the configuration object

## 6. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Replace the placeholder values with your actual Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 7. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own files
    match /user_files/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

## 8. Firebase Storage Rules

Set up the following security rules in Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access files in their own folder
    match /compressed_files/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features

- **Google Authentication**: Sign in with Google account only
- **Firestore Database**: All file metadata stored in Firestore
- **Firebase Storage**: Compressed files stored in Firebase Storage
- **Real-time Updates**: File list updates automatically
- **Secure Access**: Users can only access their own files

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
