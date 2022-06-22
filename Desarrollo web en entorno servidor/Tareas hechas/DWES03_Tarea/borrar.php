<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>DWES03_Tarea</title>
</head>
<body>
<?php
    //Creamos las variables con los datos necesarios para conectar a nuestra BD
    $host = "localhost";
    $user = "gestor";
    $password = "secreto";
    $db = "proyecto";
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    //intentamos conectar a la BD con los datos proporcionados
    try{
        $conProyecto = new PDO($dsn, $user, $password);
        $conProyecto->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //si no puede, nos da un mensaje con el error que ha ocurrido
    } catch(PDOException $ex){
        die("Error en la conexión: ".$ex->getMessage());
    }
    //obtenemos la ID del producto con el método GET
    $id = htmlspecialchars($_GET['id']);
    //Intentamos elminar el producto con una sentencia MySQL
    try{
    //Sentencia MySQL para eliminar el producto seleccionado
        $stmt = $conProyecto->query("DELETE FROM productos WHERE id='".$id."'");
        $stmt->execute();
    //Mostramos un mensaje de éxito en pantalla.
        print "<h1>Se ha borrado el producto con código ".$id.".</h1></br>";
    } catch(PDOException $ex){
    //Si no se ha podido eliminar el producto, se produce un error
        die("Error al intentar elimianar el producto: ".$ex->getMessage());
    }
    //Cerramos la conexión con la base de datos.
    $conProyecto=null;
?>
    <div class="crearContainer">
    <button class="boton botonCrear" onclick="location.href='listado.php'">Volver</button>
    </div>
</body>
</html>