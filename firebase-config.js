// Firebase EmailJS Configuration for Moxie Ghana
// This allows sending emails without PHP server

// EmailJS Configuration (Recommended for static sites)
const EMAILJS_CONFIG = {
    serviceID: 'service_bcc49tj',
    templateID: 'template_contact',
    quoteTemplateID: 'template_quote', // Separate template for quotes
    publicKey: 'dWWVWkfNm7B8gB_4q' // Your actual EmailJS public key
};

// Debug function to check EmailJS status
function debugEmailJS() {
    console.log('EmailJS Configuration:', EMAILJS_CONFIG);
    console.log('EmailJS initialized:', typeof emailjs !== 'undefined');
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS version:', emailjs.VERSION || 'Unknown');
    }
}

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// Contact form handler using EmailJS
function sendEmailJS(formData) {
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_email: 'info.moxieghana@gmail.com'
    };

    console.log('Sending contact email with params:', templateParams);
    
    return emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams
    );
}

// Quote form handler using EmailJS
function sendQuoteEmailJS(formData) {
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        location: formData.get('location'),
        message: formData.get('message'),
        to_email: 'info.moxieghana@gmail.com'
    };

    console.log('Sending quote email with params:', templateParams);
    
    return emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.quoteTemplateID,
        templateParams
    );
}

// Test EmailJS function for debugging
function testEmailJS() {
    console.log('Testing EmailJS...');
    debugEmailJS();
    
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded');
        return;
    }
    
    // Test with sample data
    const testData = new FormData();
    testData.append('name', 'Test User');
    testData.append('email', 'test@example.com');
    testData.append('subject', 'Test Email');
    testData.append('message', 'This is a test message from EmailJS');
    
    sendEmailJS(testData)
        .then(function(response) {
            console.log('Test email sent successfully:', response);
            alert('Test email sent! Check your EmailJS dashboard.');
        })
        .catch(function(error) {
            console.error('Test email failed:', error);
            alert('Test email failed: ' + JSON.stringify(error));
        });
}