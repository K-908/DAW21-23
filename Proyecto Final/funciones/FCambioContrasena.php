<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
$correo = $_POST['correo'];
//Load Composer's autoloader
require '../vendor/autoload.php';
include "conexionBD.php";
$conexion = conexion();
$sql = "SELECT usu.passRecuperar, aj.correo as ajCorreo, aj.clave as ajClave  FROM usuarios usu, ajustes aj WHERE usu.correo = '$correo' AND activo IS TRUE";
$stmt = $conexion->query($sql);
$res = $stmt->fetch_array(MYSQLI_ASSOC);
if($stmt->num_rows==0){
    echo "No se ha encontrado el usuario";
    $conexion->close();
} else{
    mandarCorreo($res['passRecuperar'], $correo, $res['ajCorreo'], $res['ajClave']);
    $conexion->close();
}


function mandarCorreo($hash, $correo, $ajCorreo, $ajClave){
    $mail = new PHPMailer(true);
    //Server settings
    $mail->isSMTP();                                            //Send using SMTP
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->Host       = 'smtp.gmail.com';                       //Set the SMTP server to send through
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    $mail->Username   = $ajCorreo;    							//SMTP username
    $mail->Password   = $ajClave;                               //SMTP password
    $mail->CharSet    = 'UTF-8';
    //$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;          //Enable implicit TLS encryption
    //clave@inventario.quality.media
    //Qu4L1Ty@!15
    //Recipients
    $mail->setFrom($correo, 'Almaceneitor 3000');
    $mail->addAddress($correo);     //Add a recipient

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Recuperación de contraseña';
    $mail->Body    = 'Recupera tu contraseña accediendo al siguiente enlace: <a href="localhost/inventario/recuperarClave.html?hash='.$hash.'">Cambiar contraseña</a>';
    $mail->AltBody = 'Recupera tu contraseña!';

    try{
        $mail->send();
        echo 'Message has been sent'.$ajCorreo." ".$ajClave;
    } catch(Excetption $e){
        echo "Couldn't send email".$ajCorreo." ".$ajClave;
    }
}