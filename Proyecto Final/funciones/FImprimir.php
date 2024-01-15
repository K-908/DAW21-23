<?php

$funcion = $_POST['functionName'];

if($funcion == "getPrestamos"){
    getPrestamos();
} else if($funcion == "getInfoPrestamo"){
    getInfoPrestamo();
}
else if($funcion == "mostrarImagen"){
    mostrarImagen();
}

function getPrestamos(){
    require "conexionBD.php";
    $conexion = conexion();

    $codigo = $_POST['codigo'];

    $sql = "SELECT IDprestamo, Evento FROM encargos WHERE IDencargo = '$codigo'";
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

function mostrarImagen(){
    require "conexionBD.php";
    $conexion = conexion();

    $sql = "SELECT CONVERT(logo USING utf8) as logo FROM ajustes";
    
    $res = $conexion->query($sql);
    $row = $res->fetch_array(MYSQLI_ASSOC);
    echo json_encode($row);
    $conexion->close();
}


function getInfoPrestamo(){
    require "conexionBD.php";
    $conexion = conexion();

    $idPrestamo = $_POST['idPrestamo'];

    $sql = "SELECT  pre.prestamista, pre.CorreoUser, pre.fechaPrestada, pre.fechaPrevistaDevolucion, 
                    pre.Comentarios, pre.CodProducto, pro.nombre as nomProducto, pre.cantidad, pro.numeroDeSerie
            FROM prestamos pre, productos pro
            WHERE pro.codigo = pre.CodProducto
            AND pre.IDPrestamo = '$idPrestamo'";

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