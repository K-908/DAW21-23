<?php

$funcion = $_POST['functionName'];


if($funcion=="borrarUser"){
    borrarUser();
} else if($funcion=="modificarUser"){
    modificarUser();
} else if($funcion == "habilitarUser"){
    habilitarUser();
}

function habilitarUser(){
    include "conexionBD.php";
    $conexion = conexion();  

    $cor = $_POST['correo'];
    $sql = "UPDATE usuarios SET activo = 1 WHERE correo = '$cor'";

    try{
        $result = $conexion->query($sql);
        echo "Se ha habilitado al usuario";
    } catch(Exception $e){
        echo "Error al habilitar al usuario: ".$e->getmessage();
    }

    $conexion->close();
}

function borrarUser(){
    include "conexionBD.php";
    $conexion = conexion();  

    $cor = $_POST['correo'];
    $sql = "UPDATE usuarios SET activo = 0 WHERE correo = '$cor'";

    try{
        $result = $conexion->query($sql);
        echo "Se ha deshabilitado al usuario";
    } catch(Exception $e){
        echo "Error al deshabilitar al usuario: ".$e->getmessage();
    }

    $conexion->close();
}

function modificarUser(){
    include "conexionBD.php";
    $conexion = conexion();
    $cor = $_POST['correo'];
    $nom = $_POST['nombre'];
    $rol = $_POST['rol'];
    
    $correoAnterior = $_POST['correoAnterior'];
    $sql = "UPDATE usuarios SET nombre = '$nom', correo = '$cor', rol = '$rol' WHERE correo = '$correoAnterior'";
    if(strlen($_POST['pass'])>0){
        $pass = hash('sha256', $_POST['pass']);
        $sql = "UPDATE usuarios SET nombre = '$nom', correo = '$cor', rol = '$rol', clave= '$pass' WHERE correo = '$correoAnterior'";
    }
    try{
        $resultado=$conexion->query($sql);
        echo "Se ha modificado el usuario";
        /*header("Location: gestionUsuarios.php");
        exit();*/
    } catch(Exception $e){
        echo "Error al modificar datos".$e->getmessage();
    }

    //Cerramos sesión
    $conexion->close();
}

?>