# File Compression App

Securely compress and store your files in the cloud with zero quality loss. Advanced lossless compression technology powered by Firebase.

## Features

- **Google Authentication**: Secure sign-in with Google accounts only
- **File Compression**: Advanced lossless compression algorithms
- **Cloud Storage**: Files stored securely in Firebase Storage
- **Real-time Database**: File metadata managed with Firestore
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark/Light Theme**: Automatic theme switching support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **Backend**: Firebase (Firestore + Storage + Auth)
- **Authentication**: Firebase Google Sign-In
- **Build Tool**: Vite
- **Package Manager**: npm

## Firebase Migration

This project has been fully migrated from Supabase to Firebase. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions.

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd file_compression
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Copy `.env.example` to `.env.local` and add your Firebase configuration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Authentication

- Only Google Sign-In is supported
- Users can only access their own files
- Secure authentication flow with Firebase Auth

## File Management

- Upload files through drag-and-drop or file picker
- Files are compressed using lossless algorithms
- All files stored securely in Firebase Storage
- File metadata tracked in Firestore Database
- Download compressed files anytime

## Security

- Firebase Security Rules ensure users can only access their own data
- All uploads are scoped to user accounts
- Secure file storage with Firebase Storage rules
