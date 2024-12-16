<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


/*Indhentning af SMTP oplysningerne fra env fil for at undgå lækning af koder m.m.*/
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') === false) {
            continue; 
        }
        list($key, $value) = explode('=', $line, 2);
        $_ENV[$key] = $value;
    }
}

/*Captcha der forhindrer spam og bots, bedre sikkerhed */
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $captchaResponse = $_POST['g-recaptcha-response'];

    if (empty($captchaResponse)) {
        echo json_encode(['success' => false, 'message' => 'Venligst fuldfør vores CAPTCHA.']);
        exit;
    }

    $recaptchaSecret = '6LdFkJ0qAAAAAADX7LnNpYMPfKB-EHaO0E73mWuM'; 
    $recaptchaVerifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$captchaResponse}");

    $recaptchaResult = json_decode($recaptchaVerifyResponse, true);

    if (!$recaptchaResult['success']) {
        echo json_encode(['success' => false, 'message' => 'CAPTCHA blev ikke fuldført korrekt.']);
        exit;
    }

}


require 'vendor/autoload.php';

/* Oprydning i output, undgår unødige fejlmelddelelser */
ob_clean(); 

/*htmlspecialchars til beskyttelse mod XSS */
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']));

    /* Validering af navn */
    if (empty($name) || !preg_match('/^[a-zA-Z\s]+$/', $name)) {
        echo json_encode(['success' => false, 'message' => 'Ugyldigt navn.']);
        exit;
    }

    /* Validering af telefonnummer */
    if (!preg_match('/^[\d+\-\s]+$/', $phone)) {
        echo json_encode(['success' => false, 'message' => 'Ugyldigt telefonnummer.']);
        exit;
    }

    $message = htmlspecialchars(trim($_POST['message']));

    /* Validering af email */
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Ugyldig email-adresse.']);
        exit;
    }

    /*Validering af besked */
    if (empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Beskedfeltet skal udfyldes.']);
        exit;
    }

    $mail = new PHPMailer(true);

    /* Indsættelse af de indhentede smtp info */
    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'];
        $mail->Password = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = $_ENV['SMTP_SECURE'];
        $mail->Port = $_ENV['SMTP_PORT'];

        $mail->setFrom($_ENV['SMTP_USER'], $name);
        $mail->addAddress($_ENV['SMTP_USER']);
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = 'Kontaktformular besked';
        $mail->Body = "Navn: $name<br>Email: $email<br>Telefon: $phone<br>Besked: " . nl2br($message);
        /* Succes og fejl meddelser der sendes til js alert pop up */
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Beskeden er sendt! Vi vender tilbage hurtigst muligt.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Kunne ikke sende besked. Fejl: ' . $mail->ErrorInfo]);
    }
}

?>
