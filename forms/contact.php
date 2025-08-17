<?php
// This file requires a PHP-enabled web server to function
// For local testing with Python HTTP server, this will not execute

// Check if PHP is available
if (!function_exists('mail')) {
    // Return a simulated response for local testing
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Contact form working! (Email functionality requires PHP server - contact info.moxieghana@gmail.com directly)'
    ]);
    exit;
}

// Actual PHP email processing (requires PHP server)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : '';
    $message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';
    
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }
    
    $to = 'info.moxieghana@gmail.com';
    $email_subject = "Contact Form: $subject";
    $email_body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Thank you! We will contact you soon.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error sending email. Please contact info.moxieghana@gmail.com directly.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
