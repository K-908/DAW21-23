<?php

$funcion = $_POST['functionName'];


if($funcion=="getAllProducts"){
    getAllProducts();
} else if($funcion=="crearProducto"){
    crearProducto();
} else if($funcion == "getAllProductsDeshabilitados"){
    getAllProductsDeshabilitados();
} else if($funcion == "getProductos"){
    getProductos();
} else if($funcion=="getNumeroProductos"){
    getNumeroProductos();
} else if($funcion=="descargarCSV"){
    descargarCSV();
} else if($funcion == "getCategorias"){
    getCategorias();
} else if($funcion == "getProductosMismaCategoria"){
    getProductosMismaCategoria();
} else if($funcion == "getSubCategorias"){
    getSubCAtegorias();
}

function getSubCAtegorias(){
    require "conexionBD.php";
    $conexion = conexion();
    $sql = "SELECT DISTINCT subcategoria FROM productos ORDER BY subcategoria";
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

function getProductosMismaCategoria(){
    require "conexionBD.php";
    $conexion = conexion();

    $categoria = $_POST['categoria'];

    $sql = "SELECT codigo, subcategoria, nombre, categoria, cantidad FROM productos WHERE categoria = '$categoria'";
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

function getCategorias(){
    require "conexionBD.php";
    $conexion = conexion();
    $ckb = $_POST['ckb'];
    $sql = "SELECT DISTINCT categoria FROM productos WHERE activo IS NOT $ckb ORDER BY categoria";
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

function descargarCSV(){
    require "conexionBD.php";
    $conexion = conexion();

    $sql = "SELECT codigo, subcategoria, nombre, fechaCompra, precioCompra, categoria, cantidad FROM productos";

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


function getProductos(){
    require "conexionBD.php";
    $conexion = conexion();
    $true = $_POST['ckb'];
    $offset = $_POST['offset'];
    $cantidad = $_POST['elementosPorPagina'];
    $cod = "";
    if(isset($_POST['cod'])&&$_POST['cod']!=""){
        $cod = $_POST['cod'];
        $cod = "AND codigo LIKE ('$cod%')";
    }
    $cat = "";
    if(isset($_POST['categoria'])&&$_POST['categoria']!=""){
        $categoria = $_POST['categoria'];
        $cat = "AND categoria = '$categoria'";
    }
    $sql = "SELECT * FROM productos WHERE activo IS NOT $true $cod $cat LIMIT $cantidad OFFSET $offset";

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

function getNumeroProductos(){
    require "conexionBD.php";
    $conexion = conexion();
    
    $cod = "";
    if(isset($_POST['cod'])&&$_POST['cod']!=""){
        $cod = $_POST['cod'];
        $cod = "AND codigo LIKE ('$cod%')";
    }

    $categoria = "";
    if(isset($_POST['categoria'])&&$_POST['categoria']!=""){
        $cat = $_POST['categoria'];
        $categoria = "AND categoria = '$cat' ";
    }
    $activo = $_POST['activo'];
    $sql = "SELECT COUNT(codigo) as rowCount FROM productos WHERE activo IS NOT $activo $cod $categoria";
    $res = mysqli_query($conexion, $sql);
    $row = $res->fetch_array(MYSQLI_ASSOC);
    echo ($row['rowCount']);
}

function crearProducto(){
    require "conexionBD.php";
    $conexion = conexion();

    $codigo = $_POST['codigo'];
    $nombre = $_POST['nombre'];
    $fechaCompra = $_POST['fechaCompra'];
    $precioCompra = $_POST['precioCompra'];
    $subcategoria = $_POST['subcategoria'];
    $categoria = $_POST['categoria'];
    $cantidad = $_POST['cantidad'];
    $numSerie = $_POST['numeroDeSerie'];
    $infoAdicional = $_POST['infoAdicional'];
    $sql = "INSERT INTO productos (codigo, nombre, subcategoria, fechaCompra, precioCompra, categoria, cantidad, numerodeserie, InformacionAdicional) VALUES ('$codigo', '$nombre', '$subcategoria', '$fechaCompra', '$precioCompra', '$categoria', '$cantidad', '$numSerie', '$infoAdicional')";
    try{
        $res = $conexion->query($sql);
        echo "Producto añadido con éxito";
    }catch(Exception $e){
        echo "No se ha podido añadir el producto: ", $e->getmessage();
    }
    $conexion->close();
}