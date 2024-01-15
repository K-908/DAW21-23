<?php


$funcion = $_POST['functionName'];


if($funcion=="buscarProducto"){
    buscarProducto();
} else if($funcion == "listarUsuarios"){
    listarUsuarios();
} else if($funcion == "reservar"){
    reservar();
} else if($funcion == "ultimoCodigo"){
    ultimoCodigo();
} else if($funcion == "encargos"){
    encargos();
}


function reservar(){
    session_start();
    include "conexionBD.php";
    $conexion = conexion();

    $prestamista = $_POST['prestamista'];
    $codigo = $_POST['codigo'];
    $usuario = $_POST['usuario'];
    $cantidad = $_POST['cantidad'];
    $fechaPrestado = $_POST['fechaPrestado'];
    $fechaDevolucion = $_POST['fechaDevolucion'];
    $evento =$_POST['evento'];
    $comentarios = $_POST['comentario'];

    try {
        $sql = "insert into prestamos (`CorreoUser`, `CodProducto`, `Cantidad`, `fechaPrestada`, `fechaPrevistaDevolucion`, `Comentarios`, `prestamista`) values ('$usuario', '$codigo', '$cantidad', '$fechaPrestado', '$fechaDevolucion', '$comentarios', '$prestamista')";
        $res = $conexion->query($sql);
        $id=mysqli_insert_id($conexion);

        $query = "insert into encargos (`IDencargo`, `IDPrestamo`, `Evento`) values (concat('$fechaPrestado','/', '$usuario','/','$evento'), '$id', '$evento')";    
        $result = $conexion->query($query);
        echo "Se ha reservado con exito";
    } catch(Exception $e){
        echo "No se ha podido reservar el producto   ", $e->getmessage();        
    } finally{
        $conexion->close(); 
    }   

}


function listarUsuarios(){
    include "conexionBD.php";
    $conexion = conexion();

    $sql = "SELECT * FROM usuarios WHERE activo IS TRUE";
    $res = $conexion->query($sql);

    $array = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $array[$i]=($row);
        $i++;
    };

echo json_encode($array);
}

function buscarProducto(){
    include "conexionBD.php";
    $conexion = conexion();

    $codigo = $_POST['codigo'];
    $sql = "SELECT codigo, nombre, cantidad, stockDisponible, malEstado FROM productos WHERE codigo LIKE '$codigo%' AND activo IS TRUE";
    $res = $conexion->query($sql);

    $array = [];
    $i=0;
    while($row = $res->fetch_array(MYSQLI_ASSOC)){
        $array[$i]=($row);
        $i++;
    };

    echo json_encode($array);
}



?>