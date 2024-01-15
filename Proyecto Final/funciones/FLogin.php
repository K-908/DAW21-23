<?php


session_start();
include "conexionBD.php";
$conexion = conexion();

$user = $_POST['user'];
$pass = $_POST['password'];

$sql = "SELECT correo, rol FROM usuarios WHERE correo='$user' AND clave = '$pass' AND activo IS TRUE";
$stmt = $conexion->query($sql);
$cons = $stmt->fetch_array();
if($stmt->num_rows==0){
    $datos = "Error";
    echo $datos;
} else{
    $_SESSION['usuario'] = $cons['correo'];
    $_SESSION['rol'] = $cons['rol'];
    $datos = $cons['correo'].";".$cons['rol'];
    echo $datos;
}



