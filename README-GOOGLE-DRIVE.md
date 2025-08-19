# Moxie Ghana Limited - Google Drive Integration Guide

This guide explains how to set up and use Google Drive integration for image management instead of Firebase Storage.

## Overview

Since Firebase now requires billing verification for storage usage, we've implemented a Google Drive integration that allows you to:
- Upload images directly to Google Drive
- Organize images by categories (carousel, hero, portfolio)
- Manage images through the admin dashboard
- Preview images before and after upload
- Replace and delete images easily

## Files Structure

### New Files Created
- `admin-dashboard-drive.html` - New admin dashboard with Google Drive integration
- `google-drive-config.js` - Google Drive API configuration and functions
- `README-GOOGLE-DRIVE.md` - This setup guide

### Modified Files
- `admin-login.html` - Updated to redirect to Google Drive dashboard

## Quick Setup (Local Storage Mode - No Google Drive Required)

For immediate use without Google Drive setup, the system uses browser localStorage:

1. **Login**: Use the same admin credentials
   - Email: `info.moxieghana@gmail.com`
   - Password: `moxiegh@2010`

2. **Upload Images**: Click "Connect Google Drive" to simulate authentication
3. **Manage Images**: Use the category tabs to organize your images
4. **Preview**: Images are stored locally in your browser

## Full Google Drive Setup (Optional)

To use actual Google Drive storage:

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

### Step 2: Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:8000/admin-dashboard-drive.html`
   - `https://yourdomain.com/admin-dashboard-drive.html`
5. Note your Client ID

### Step 3: Get API Key
1. In the same "Credentials" page
2. Click "Create Credentials" > "API key"
3. Note your API key

### Step 4: Configuration Complete ✅
The Google Drive credentials are already configured:
- **Client ID**: `321096729616-365vvp2cmg9r5m86lnjb37b525eskp9s.apps.googleusercontent.com`
- **API Key**: `AIzaSyDSVzMQhuFEGo70AABflyGsvrzxBn6nY84`

No additional configuration needed!

### Step 5: Test Integration
1. Open `admin-login.html`
2. Login with admin credentials
3. Click "Connect Google Drive"
4. Authenticate with your Google account
5. Start uploading images

## Usage Guide

### Uploading Images
1. **Drag & Drop**: Drag images to the upload area
2. **Browse**: Click the upload area to select files
3. **Category**: Choose image category before upload
4. **Preview**: See image previews before uploading
5. **Upload**: Click "Upload to Google Drive"

### Managing Images

#### Carousel Images
- Used for homepage hero carousel
- Displays in sliding carousel format
- Recommended size: 1920x1080 pixels

#### Hero Images
- Used for hero section with text overlay
- Single large background images
- Recommended size: 1920x1080 pixels

#### Portfolio Images
- Used for project showcases
- Grid layout display
- Recommended size: 800x600 pixels

### Image Actions
- **Preview**: Click any image to view full size
- **Replace**: Click replace button to upload new version
- **Delete**: Click delete button to remove image

## Browser LocalStorage Mode

When using localStorage (no Google Drive):
- Images are stored in your browser's local storage
- Images persist until you clear browser data
- Works offline
- No Google account required
- Limited by browser storage (typically 5-10MB)

## Google Drive Mode

When using Google Drive:
- Images stored in your Google Drive
- Accessible from any device
- Larger storage capacity (15GB free)
- Requires internet connection
- Images organized in folders by category

## Troubleshooting

### Common Issues

**Images not showing**: 
- Check if browser localStorage is enabled
- Refresh the page
- Check if images were uploaded successfully

**Upload fails**:
- Check file size (max 5MB for localStorage)
- Ensure images are valid format (JPG, PNG, GIF)
- Check internet connection for Google Drive mode

**Authentication issues**:
- Ensure Google Drive API is enabled
- Check OAuth credentials configuration
- Verify redirect URLs match your domain

### Reset Local Storage
To clear all images:
1. Open browser developer tools (F12)
2. Go to Application > Local Storage
3. Delete `googleDriveImages` and `googleDriveAuthenticated`
4. Refresh the page

## Security Notes

- Admin credentials are hardcoded for demo purposes
- In production, implement proper authentication
- Google Drive API requires HTTPS for production
- Consider implementing user roles and permissions

## Next Steps

1. **Test the localStorage version** first
2. **Set up Google Drive integration** if needed
3. **Customize image categories** as needed
4. **Add more features** like image compression
5. **Implement proper authentication** for production

## Support

For issues or questions:
1. Check this README first
2. Check browser console for errors
3. Verify all setup steps are completed
4. Test with different browsers

---

*This Google Drive integration provides a free alternative to Firebase Storage while maintaining the same functionality for image management.*