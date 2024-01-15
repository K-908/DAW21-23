<?php
    include "conexionBD.php";
    $conexion = conexion();
    session_start();
    
    $query = "SELECT * FROM productos";
    $res = $conexion->query($query);

    $array = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $array[$i]=($row);
        $i++;
    };
    
    echo json_encode($array);
    $conexion->close();
?>