<?php

    $funcion = $_POST["functionName"];

    if($funcion == "buscarProducto"){
        buscarProducto();
    } else if($funcion == "guardarCambios"){
        guardarCambios();
    } else if($funcion == "historialDevoluciones"){
        historialDevoluciones();
    }

    function historialDevoluciones(){
        include "conexionBD.php";
        $conexion = conexion();
        
        $cod = $_POST['codigo'];

        $sql = "SELECT * FROM prestamos where CodProducto='$cod'";

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


    function guardarCambios(){
        include "conexionBD.php";
        $conexion = conexion();
        
        $cod = $_POST['codigo'];
        $subCat = $_POST['subCategoria'];
        $nom = $_POST['nombre'];
        $cat = $_POST['categoria'];
        $cant = $_POST['cantidad'];
        $stock = $_POST['stock'];
        $mal = $_POST['mal'];
        $numSer = $_POST['numeroDeSerie'];
        $info = $_POST['info'];

        try{
            $sql = "UPDATE productos SET subcategoria = '$subCat', nombre='$nom', categoria='$cat', cantidad='$cant', 
                    InformacionAdicional = '$info', numerodeserie = '$numSer', stockDisponible='$stock', malEstado='$mal' 
                    where codigo = '$cod'";
            $res = $conexion->query($sql);
            echo "Se han guardado los cambios";
        }catch (Exception $e){
            echo "Error";
        } finally{
            $conexion->close();
        }
    }

    
    function buscarProducto(){
        include "conexionBD.php";
        $conexion = conexion();
        $codigo = $_POST['codigo'];

        try{
            $sql = "select * from productos where codigo = '$codigo'";
            $res = $conexion->query($sql);
            
            $array = [];
            $i=0;
            while($row = $res->fetch_array(MYSQLI_ASSOC)){
                $array[$i]=($row);
                $i++;
            };

            echo json_encode($array);
        } catch (Exception $e){
            echo "No se ha encontrado el producto";
        } finally{
            $conexion->close();
        }

    }
?>