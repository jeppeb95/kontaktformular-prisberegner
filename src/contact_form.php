<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    /* htmlspecialchars() beskyttelse mod XSS */
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']));
    $message = htmlspecialchars(trim($_POST['message']));

    /* Validering */
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Ugyldig email-adresse.';
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        /*Tilføjelse af udgående simply mail-server*/
        $mail->isSMTP();
        $mail->Host = 'websmtp.simply.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = 'skole@birkholmdigital.dk';
        $mail->Password = 'J%GFGFDGY3434F&/';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('skole@birkholmdigital.dk', $name); 
        $mail->addAddress('skole@birkholmdigital.dk');
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = 'Kontaktformular besked';
        $mail->Body = "Navn: $name<br>Email: $email<br>Telefon: $phone<br>Besked: " . nl2br($message); 

        /* Succes/fejl meddelelser */
        $mail->send();
        echo 'Besked sendt!';
    } catch (Exception $e) {
        echo 'Kunne ikke sende besked. Mailer fejl: ', $mail->ErrorInfo;
    }
}
?>
