# Moxie Ghana Photo Management System

## Overview
This photo management system allows administrators to upload, manage, and display images on the Moxie Ghana website. The system uses Firebase for storage and database functionality, with a simple direct authentication mechanism.

## Features
- **User Authentication**: Secure login with hardcoded credentials
- **Image Upload**: Upload images to specific categories (Carousel, Hero, Portfolio)
- **Image Management**: View, replace, and delete images
- **Category Organization**: Images are organized by their purpose/category
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics if desired

2. **Register Your Web App**:
   - In your Firebase project, click the web icon (</>) to add a web app
   - Enter a nickname for your app (e.g., "Moxie Ghana Website")
   - Register the app
   - Copy the Firebase configuration object

3. **Update Firebase Configuration**:
   - Open `/assets/js/firebase-config.js`
   - Replace the placeholder configuration with your actual Firebase config

4. **Authentication Note**:
   - The system uses direct authentication with hardcoded credentials
   - No Firebase Authentication setup is required
   - Default credentials are: 
     - Email: `info.moxieghana@gmail.com` 
     - Password: `moxiegh@2010`

5. **Set Up Firestore Database**:
   - Go to Firestore Database in Firebase Console
   - Click "Create database"
   - Start in production mode
   - Choose a location closest to your users (e.g., europe-west1)
   - Set up security rules to allow authenticated access

6. **Configure Storage**:
   - Go to Storage in Firebase Console
   - Click "Get started"
   - Choose production mode
   - Set up security rules to allow authenticated access
   - Create the following folders in your storage bucket:
     - `images/carousel`
     - `images/hero`
     - `images/portfolio`

### 2. Website Setup

1. **Deploy Files**:
   - Upload all files to your web hosting
   - Ensure all files maintain their directory structure

2. **Access Admin Panel**:
   - Navigate to `https://your-website.com/admin-login.html`
   - Log in with the credentials:
     - Email: `info.moxieghana@gmail.com`
     - Password: `moxiegh@2010`

## Usage Guide

### Logging In
1. Navigate to the admin login page
2. Enter your email and password
3. Click "Login"

### Uploading Images
1. From the dashboard, go to the "Upload Images" tab
2. Select a category from the dropdown menu
3. Drag and drop images or click to browse files
4. Click "Upload Images"

### Managing Images
1. Navigate to the category tab (Carousel, Hero, or Portfolio)
2. For each image, you can:
   - View: Click the eye icon to see a larger preview
   - Replace: Click the replace icon to upload a new image in its place
   - Delete: Click the trash icon to remove the image

### Logging Out
- Click the "Logout" button in the top-right corner of the dashboard

## Security Considerations
- The admin login is protected with hardcoded credentials and localStorage-based session management
- Only authenticated users can upload, modify, or delete images
- The Firebase configuration should be kept secure
- Regular backups of the Firestore database are recommended
- For enhanced security in production, consider implementing a more robust authentication system

## Troubleshooting

### Login Issues
- Ensure you're using the correct email and password
- Check your internet connection
- Clear browser cache and cookies

### Upload Problems
- Verify that the image file is in a supported format (JPG, PNG, GIF, WebP)
- Check that the file size is not too large (recommended under 5MB)
- Ensure you have a stable internet connection

### Display Issues
- If images are not displaying on the website, check the browser console for errors
- Verify that the image URLs in Firestore are correct
- Check that the Firebase Storage security rules allow public read access

## Support
For technical support or questions, please contact the website administrator.