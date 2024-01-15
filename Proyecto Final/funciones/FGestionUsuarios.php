<?php

$funcion = $_POST['functionName'];


if($funcion=="getAllUsers"){
    getAllUsers();
} else if($funcion=="crearUsuario"){
    crearUsuario();
}

function getAllUsers(){
    require "conexionBD.php";
    $conexion = conexion();
    
    $rol = $_POST['rol'];
    $usuario = $_POST['usuario'];
    $sql = "";
    if($rol=="admin"){
        $sql = "SELECT nombre, correo, rol, activo FROM usuarios WHERE rol IN ('user', 'admin') ORDER BY activo ASC, correo ASC";
    } else if($rol=="superadmin"){
        $sql = "SELECT nombre, correo, rol, activo FROM usuarios ORDER BY activo DESC, correo ASC";
    } else{
        $sql = "SELECT nombre, correo, rol FROM usuarios WHERE correo = '$usuario'";
    }
    $res = $conexion->query($sql);
    $arr = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $arr[$i]=$row;
        $i++;
    }
    echo json_encode($arr);
    $conexion->close();
}

function crearUsuario(){
    require "conexionBD.php";
    $conexion = conexion();

    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $pass = $_POST['pass'];
    $pass = hash("sha256", $pass);
    $rol = $_POST['rol'];
    $hash = hash('sha256', $_POST['hash']);
    $sql = "INSERT INTO usuarios (nombre, correo, clave, rol, passRecuperar) VALUES ('$nombre', '$correo', '$pass', '$rol', '$hash')";
    try{
        $res = $conexion->query($sql);
        echo "Usuario añadido con éxito";
    }catch(Exception $e){
        echo "No se ha podido añadir al usuario: ", $e->getmessage();
    }
    $conexion->close();
}