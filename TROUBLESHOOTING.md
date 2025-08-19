# Image Storage Troubleshooting Guide

## Current Issue: Images Not Storing

**Problem**: Images are neither storing in Google Drive nor appearing on the website.

## Immediate Solution - Local Storage Mode

Your system has been updated with a **local storage fallback** that will work immediately without requiring Google Drive authentication.

### How It Works Now

1. **Automatic Fallback**: If Google Drive fails, the system automatically switches to local storage
2. **Zero Configuration**: Images are stored directly in your browser's local storage
3. **Immediate Use**: You can start uploading images right away
4. **Persistent Storage**: Images remain stored even after page refresh

### Testing Your System

1. **Open the Test Page**: Go to `http://localhost:8000/test-google-drive.html`
2. **Try Upload**: Use the upload test to verify images are storing
3. **Check Categories**: Test different categories (carousel, hero, portfolio)
4. **View Images**: Use the list test to see stored images

### Using the Admin Dashboard

1. **Access Dashboard**: Go to `http://localhost:8000/admin-dashboard-drive.html`
2. **Login**: Use admin/admin123 credentials
3. **Upload Images**: Drag and drop or click to upload
4. **Check Storage Status**: Look for the storage status indicator at the top

## Google Drive Issues & Solutions

### Common Problems

1. **Authentication Failed**: Google API credentials might have restrictions
2. **CORS Issues**: Browser security blocking Google Drive API
3. **API Quota**: Daily limits exceeded
4. **Client ID Issues**: OAuth configuration problems

### Manual Google Drive Setup (Optional)

If you want to use Google Drive instead of local storage:

1. **Verify Credentials**:
   - Client ID: `321096729616-365vvp2cmg9r5m86lnjb37b525eskp9s.apps.googleusercontent.com`
   - API Key: `AIzaSyDSVzMQhuFEGo70AABflyGsvrzxBn6nY84`

2. **Check Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to APIs & Services > Credentials
   - Ensure the OAuth 2.0 Client ID is configured correctly
   - Add `http://localhost:8000` to authorized JavaScript origins

3. **Enable APIs**:
   - Ensure Google Drive API is enabled for your project
   - Check if there are any quota restrictions

### Browser Security Settings

**Chrome Users**:
- Go to `chrome://settings/content/cookies`
- Ensure "Block third-party cookies" is disabled for testing
- Check `chrome://settings/security` for any security restrictions

**Safari Users**:
- Go to Preferences > Privacy
- Ensure "Prevent cross-site tracking" is disabled
- Allow cookies and website data

## Local Storage Benefits

**Advantages**:
- ✅ Works immediately without setup
- ✅ No API quotas or restrictions
- ✅ Fast uploads (no network delays)
- ✅ Works offline
- ✅ No Google account required

**Limitations**:
- ❌ Images only available on your current browser
- ❌ Limited storage space (5-10MB)
- ❌ Cannot share between devices
- ❌ Cleared if browser data is cleared

## Quick Fix Commands

### Reset Everything
```javascript
// In browser console (F12) on any page:
localStorage.clear();
location.reload();
```

### Check Storage Status
```javascript
// In browser console:
console.log(driveManager.getStorageStatus());
```

### View Stored Images
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('moxie_ghana_images') || '[]'));
```

## Next Steps

1. **Start with Local Storage**: Use the system as-is for immediate functionality
2. **Test Thoroughly**: Upload images in all categories
3. **Monitor Performance**: Check if local storage meets your needs
4. **Google Drive Later**: Consider Google Drive integration only if you need cross-device access

## Getting Help

If images still don't appear:

1. **Check Browser Console**: Press F12 and look for red error messages
2. **Test with Different Browser**: Try Chrome, Firefox, or Safari
3. **Clear Cache**: Hard refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
4. **File Size**: Ensure images are under 2MB for local storage

## Success Indicators

✅ **Working Correctly** when you see:
- Green "Connected" status in admin dashboard
- Images appear in preview after upload
- Images persist after page refresh
- No error messages in browser console

The system is now configured to work reliably with local storage as the primary option, with Google Drive as an optional upgrade path.