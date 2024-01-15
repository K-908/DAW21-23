<?php

$funcion = $_POST['functionName'];

if($funcion == "cambiarAjustes"){
    cambiarAjustes();
} else if($funcion == "cargarAjustes"){
    cargarAjustes();
}

function cargarAjustes(){
    require "conexionBD.php";
    $conexion = conexion();
    
    $sql = "SELECT color, correo, cantidad, favicon, colorCabecera, colorLetra, colorLetraCabecera, caracterControlCodigos, CONVERT(logo USING utf8) AS logo FROM ajustes";

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

function cambiarAjustes(){
    require "conexionBD.php";
    $conexion = conexion();
    
    $sql = "update ajustes set ";
    
    if(isset($_POST['color']) && $_POST['color'] != ""){
        $color = $_POST['color'];
        $sql .= "color='$color'";
    }
    
    if(isset($_POST['logo']) && $_POST['logo'] != ""){
        $logo = $_POST['logo'];
        $sql .= ", logo='$logo'";
    }
    
    if(isset($_POST['favicon']) && $_POST['favicon'] != ""){
        $favicon = $_POST['favicon'];
        $sql .= ", favicon='$favicon'";
    }
    
    if(isset($_POST['correo']) && $_POST['correo'] != ""){
        $correo = $_POST['correo'];
        $sql .= ", correo='$correo'";
    }
    
    if(isset($_POST['clave']) && $_POST['clave'] != ""){
        $clave = $_POST['clave'];
        $sql .= ", clave='$clave'";
    }
    
    if(isset($_POST['cantidad']) && $_POST['cantidad'] != ""){
        $cantidad = $_POST['cantidad'];
        $sql .= ", cantidad='$cantidad'";
    }

    if(isset($_POST['colorCabeceras']) && $_POST['colorCabeceras'] != ""){
        $colorCabeceras = $_POST['colorCabeceras'];
        $sql .= ", colorCabecera='$colorCabeceras'";
    }

    if(isset($_POST['colorLetra']) && $_POST['colorLetra'] != ""){
        $colorLetra = $_POST['colorLetra'];
        $sql .= ", colorLetra='$colorLetra'";
    }

    if(isset($_POST['colorLetraCabecera']) && $_POST['colorLetraCabecera']!=""){
        $colorLetraCabecera = $_POST['colorLetraCabecera'];
        $sql .=", colorLetraCabecera='$colorLetraCabecera'";
    }

    if(isset($_POST['caracterControlCodigos'])&& $_POST['caracterControlCodigos']!=""){
        $caracterControlCodigos = $_POST['caracterControlCodigos'];
        $sql .= ", caracterControlCodigos = '$caracterControlCodigos'";
    }
    
    try{
        $res = $conexion->query($sql);
        echo "Ajustes cambiados";
    }catch(Exception $e){
        echo "No se ha podido cambiar: ", $e->getmessage();
    }
    $conexion->close();
}


