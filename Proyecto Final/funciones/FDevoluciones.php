<?php
$funcion = $_POST['functionName'];
if($funcion == "listarEncargos"){
    listarEncargos();
} else if($funcion == "buscarEncargo"){
    buscarEncargo();
} else if($funcion == "devolverProd"){
    devolverProd();
} else if($funcion == "listarIds"){
    listarIds();
}

function listarIds(){
    include "conexionBD.php";
    $conexion = conexion();
    $IDencargo = $_POST['IDencargo'];

    $sql = "SELECT IDPrestamo from encargos where IDencargo = '$IDencargo'";
    $res = $conexion->query($sql);
    $array = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $array[$i]=($row);
        $i++;
    };
    echo json_encode($array);
    $conexion->close();
}

function devolverProd(){
    include "conexionBD.php";
    $conexion = conexion();
    $idprestamo = $_POST['idprestamo'];
    $cant = $_POST['cant'];
    $fecha = $_POST['fecha'];
    $comentario = $_POST['comentario'];
    
    try{
        $sql = "insert into devoluciones (`idPrestamo`, `cantidad`, `fecha`, `comentario`) values ('$idprestamo', '$cant', '$fecha', '$comentario')";
        $res = $conexion->query($sql);
        echo "Se ha devuelto";
    } catch (Exception $e){
        echo "No se ha podido devolver   ", $e->getmessage();
    } finally{
        $conexion->close();
    }
}

function buscarEncargo(){
    include "conexionBD.php";
    $conexion = conexion();
    $IDPrestamo = $_POST['IDPrestamo'];
    $sql = "SELECT en.IDEncargo, pr.CorreoUser, en.Evento, pr.fechaPrestada, pr.fechaDevolucion, pr.IDPrestamo, pr.fechaPrevistaDevolucion, pr.cantidad-(SELECT COALESCE(SUM(cantidad),0) FROM devoluciones WHERE idPrestamo = '$IDPrestamo') as cantidad, prod.nombre 
    FROM prestamos pr, encargos en, productos prod 
    where pr.IDPrestamo = en.IDPrestamo
    and pr.CodProducto = prod.codigo
    and pr.IDPrestamo = '$IDPrestamo'
    and pr.fechaDevolucion is null";
    $res = $conexion->query($sql);
    $array = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $array[$i]=($row);
        $i++;
    };
    echo json_encode($array);
    $conexion->close();
}
function listarEncargos(){
    include "conexionBD.php";
    $conexion = conexion();
    $sql = "select DISTINCT IDencargo, Evento from encargos";
    $res = $conexion->query($sql);
    $array = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $array[$i]=($row);
        $i++;
    };
    echo json_encode($array);
    $conexion->close();
}