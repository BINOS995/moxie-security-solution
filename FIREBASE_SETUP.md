# Firebase EmailJS Setup Guide - Moxie Ghana

## Overview
This guide helps you set up Firebase EmailJS for both contact and quote forms, eliminating the need for PHP server configuration.

## What is EmailJS?
EmailJS is a service that allows you to send emails directly from JavaScript without a backend server. It works like Firebase Functions but specifically for email sending.

## Step-by-Step Setup

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your preferred email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook**
   - **Custom SMTP**
4. Connect your email account
5. Name your service: `service_moxieghana`

### 3. Create Email Templates

#### Contact Form Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Set Template ID: `template_contact`
4. Configure the template:

```
Subject: New Contact Form Submission - {{subject}}

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
Sent via Moxie Ghana Website
```

#### Quote Form Template
1. Create another template
2. Set Template ID: `template_quote`
3. Configure the template:

```
Subject: New Quote Request - {{service}}

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

### 4. Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (starts with: user_...)
3. Copy this key

### 5. Update Configuration Files

#### Update firebase-config.js
Replace `user_your_public_key_here` with your actual public key:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_moxieghana',
    templateID: 'template_contact',
    quoteTemplateID: 'template_quote',
    publicKey: 'user_your_actual_public_key_here'
};
```

### 6. Test Your Setup

#### Test Contact Form
1. Open `contact.html` in your browser
2. Fill out the contact form
3. Submit and check your email

#### Test Quote Form
1. Open `quote.html` in your browser
2. Fill out the quote form
3. Submit and check your email

## Files Structure
```
Moxie/
├── contact.html          # Contact form with Firebase EmailJS
├── quote.html            # Quote form with Firebase EmailJS
├── firebase-config.js    # EmailJS configuration
├── assets/js/main.js     # Form submission handlers
└── FIREBASE_SETUP.md     # This setup guide
```

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check if EmailJS service is properly connected
   - Verify your email template configuration
   - Check browser console for JavaScript errors

2. **Form not submitting**
   - Ensure EmailJS SDK is loaded: `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>`
   - Check if public key is correctly set
   - Verify form IDs match in HTML and JavaScript

3. **CORS errors**
   - EmailJS handles CORS automatically, no additional configuration needed

### Email Limits
- **Free Plan**: 200 emails/month
- **Pro Plan**: 1000 emails/month ($5/month)
- **Business Plan**: 10000 emails/month ($15/month)

### Security Notes
- Never expose your private key in client-side code
- EmailJS uses your public key for client-side operations
- All email sending is handled securely by EmailJS servers

## Benefits Over PHP
- ✅ No server setup required
- ✅ Works with static hosting (GitHub Pages, Netlify, Vercel)
- ✅ Real-time email delivery
- ✅ Built-in spam protection
- ✅ Analytics dashboard
- ✅ Custom email templates

## Next Steps
1. **Complete the EmailJS setup above** - Ensure service, templates, and public key are configured
2. **Test both forms thoroughly** - Use the debug guide below
3. **Consider upgrading to paid plan** if you need more emails
4. **Add Google Analytics** to track form submissions

## 🔧 Quick Debug Guide

### Immediate Checklist
1. **Open browser console** (F12) and check for errors
2. **Verify EmailJS setup**:
   - Service ID: `service_moxieghana` (must match exactly)
   - Template IDs: `template_contact` and `template_quote`
   - Public key: Must be your actual EmailJS public key

### Test in Browser
Open browser console and run:
```javascript
debugEmailJS();
testEmailJS();
```

### Common Fixes
- **Service not found**: Create service at [EmailJS Dashboard](https://dashboard.emailjs.com/admin)
- **Template not found**: Create templates with exact IDs
- **Invalid key**: Use public key from [Account Settings](https://dashboard.emailjs.com/admin/account)

### Still Not Working?
See `EMAILJS_DEBUG.md` for detailed troubleshooting steps.

## Support
If you need help with setup:
- EmailJS Documentation: [https://www.emailjs.com/docs](https://www.emailjs.com/docs)
- Contact Moxie Ghana: info.moxieghana@gmail.com