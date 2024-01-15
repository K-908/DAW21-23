<?php
    function conexion(){
        //$localIP = getHostByName(getHostName());
        $conexion = new mysqli("localhost", "root", "", "inventario");
        if($conexion->connect_errno) {
            echo "Error de conexión con la base de datos: " . $conexion->connect_errno;	
            exit;
        } 
    
        return $conexion;
    }    