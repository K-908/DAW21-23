<?php

$funcion = $_POST['functionName'];


if($funcion=="borrarProd"){
    borrarProd();
} else if($funcion=="modificarProd"){
    modificarProd();
} else if($funcion == "rehabilitarProducto"){
    rehabilitarProducto();
}

function rehabilitarProducto(){
    include "conexionBD.php";
    $conexion = conexion();  

    $cod = $_POST['codigo'];
    $sql = "UPDATE productos SET activo = TRUE WHERE codigo = '$cod'";

    try{
        $result = $conexion->query($sql);
        echo "Se ha rehabilitado el producto";
    } catch(Exception $e){
        echo "Error al rehabilitar el producto: ".$e->getmessage();
    }

    $conexion->close();
}

function borrarProd(){
    include "conexionBD.php";
    $conexion = conexion();  

    $cod = $_POST['codigo'];
    $sql = "UPDATE productos SET activo = FALSE WHERE codigo = '$cod'";

    try{
        $result = $conexion->query($sql);
        echo "Se ha deshabilitado el producto";
    } catch(Exception $e){
        echo "Error al deshabilitado el producto: ".$e->getmessage();
    }

    $conexion->close();
}

function modificarProd(){
    include "conexionBD.php";
    $conexion = conexion();
    $codigo = $_POST['codigo'];
    $cant = $_POST['cantidad'];
    $mal = $_POST['malEstado'];

    $sql = "UPDATE productos SET cantidad = '$cant', malEstado = '$mal' WHERE codigo = '$codigo'";

    try{
        $resultado=$conexion->query($sql);
        echo "Se ha modificado la cantidad";
        /*header("Location: gestionUsuarios.php");
        exit();*/
    } catch(Exception $e){
        echo "Error al modificar la cantidad".$e->getmessage();
    }

    //Cerramos sesión
    $conexion->close();
}

?>