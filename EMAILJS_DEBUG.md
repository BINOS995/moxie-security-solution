# EmailJS Debug Guide - Moxie Ghana

## Quick Troubleshooting Steps

### 1. Check Browser Console
Open your browser's developer console (F12) and look for any red error messages.

### 2. Test EmailJS Connection
In the browser console, run these commands:

```javascript
// Check if EmailJS is loaded
debugEmailJS();

// Test if your service is working
testEmailJS();
```

### 3. Common Issues & Solutions

#### Issue: "Service ID not found"
**Solution**: You need to create the EmailJS service and templates:
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin)
2. Click "Email Services" → "Add New Service"
3. Choose "Gmail" and connect your email account
4. Name it exactly: `service_moxieghana`
5. Verify the service is active

#### Issue: "Template ID not found"
**Solution**: Create the required templates:
1. Go to "Email Templates" → "Create New Template"
2. **For Contact Form**:
   - Template ID: `template_contact`
   - Subject: `New Contact Form Submission - {{subject}}`
   - Content: 
   ```
   Name: {{from_name}}
   Email: {{from_email}}
   Subject: {{subject}}
   
   Message:
   {{message}}
   
   ---
   Sent via Moxie Ghana Website
   ```

3. **For Quote Form**:
   - Template ID: `template_quote`
   - Subject: `New Quote Request - {{service}}`
   - Content:
   ```
   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   Service: {{service}}
   Location: {{location}}
   
   Project Details:
   {{message}}
   
   ---
   Sent via Moxie Ghana Website
   ```

#### Issue: "Invalid public key"
**Solution**: 
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin/account)
2. Copy your **Public Key** (starts with "user_")
3. Update `firebase-config.js` with your actual key

### 4. Verify Everything Works
1. Open `http://localhost:8080/contact.html`
2. Fill out the contact form
3. Check browser console for any errors
4. Check your EmailJS dashboard for delivery status

### 5. Test Email Delivery
After setting up, test with real email:
1. Fill out form with your own email
2. Submit and check your inbox (including spam folder)
3. Allow 1-2 minutes for delivery

### 6. If Still Not Working
1. Check if EmailJS service is verified (check your EmailJS dashboard)
2. Ensure your email account is properly connected
3. Try refreshing the page after making changes
4. Clear browser cache and try again

### Need Help?
- Check your EmailJS dashboard for detailed error logs
- Contact EmailJS support if service issues persist
- Email: info.moxieghana@gmail.com for assistance