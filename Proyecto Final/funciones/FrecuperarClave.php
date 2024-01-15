<?php

$functionName = $_POST['functionName'];
if($functionName==='comprobarHash'){
    comprobarHash();
} else if($functionName === 'cambiarPass'){
    cambiarPass();
}

function cambiarPass(){
    include "conexionBD.php";
$conexion = conexion();
$hash = $_POST['hash'];
    $pass = hash('sha256',$_POST['pass']);
    $nuevoHash = hash('sha256', $_POST['nuevoHash']);
    
    $sql = "UPDATE usuarios SET clave='$pass', passRecuperar='$nuevoHash' WHERE passRecuperar = '$hash'";
    try{
        $stmt = $conexion->query($sql);
        echo "Contraseña cambiada";
    } catch(Exception $e){
        echo "Error al cambiar contraseña: ".$e->getmessage();
    }
}


function comprobarHash(){
    include "conexionBD.php";
    $conexion = conexion();
    $hash = $_POST['hash'];
    $sql = "SELECT * FROM usuarios WHERE passRecuperar = '$hash'";
    $stmt = $conexion->query($sql);

    if($stmt->num_rows==0){
        echo "F";
    } else{
        echo  "T";
    }
}