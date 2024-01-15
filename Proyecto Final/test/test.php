<?php
// Check if the form is submitted
$funcion = $_POST['functionName'];
if($funcion == "subirImagen"){
    subirImagen();
} else if($funcion =="pillarImagen"){
    pillarImagen();
}

function subirImagen(){
    require "../funciones/conexionBD.php";
    $conexion = conexion();
    $img = $_POST['imagen'];

    $sql = "INSERT INTO ajustes (imagen) VALUES ('$img')";
    
    $res = $conexion->query($sql);
    $conexion->close();
}

function pillarImagen(){
    require "../funciones/conexionBD.php";
    $conexion = conexion();

    $sql = "SELECT CONVERT(imagen USING utf8) as imagen FROM ajustes LIMIT 1 OFFSET 1";
    
    $res = $conexion->query($sql);
    $row = $res->fetch_array(MYSQLI_ASSOC);
    echo json_encode($row);
    $conexion->close();
}




?>