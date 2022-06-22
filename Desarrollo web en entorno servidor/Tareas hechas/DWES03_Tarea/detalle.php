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
    <h1>Dsadsadsadsa</h1>
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

        //Cuando entramos a la página, obtiene el parámetro "id" con el método get
        if($_GET['id']){
            $id = htmlspecialchars($_GET['id']);
        } else{
            header("Location:listado.php");
        }
        
        //Guardamos en una variable los datos del producto seleccionado.
        $resultado = $conProyecto->query("SELECT nombre, nombre_corto, descripcion, pvp, familia FROM productos WHERE id='".$id."'");
        $lista=$resultado->fetch();

        //Imprimimos una tabla con todos los datos.
            print "<table>
            <th>".$lista['nombre']."</th>
            <tr><td>Nombre:".$lista['nombre']."</td></tr>
            <tr><td>Nombre Corto: ".$lista['nombre_corto']."</td></tr>
            <tr><td>Código Familia: ".$lista['familia']."</td></tr>
            <tr><td>PVP: ".$lista['pvp']."</td></tr>
            <tr><td>Descripción: ".$lista['descripcion']."</td></tr>
            </table>
            ";
        //Cerramos la conexión con la base de datos.
            $conProyecto=null;
    ?>
    <!-- Botón que nos devuelve a la página principal -->
    <div class="crearContainer">
    <button class="boton botonCrear" onclick="location.href='listado.php'">Volver</button>
    </div>
</body>
</html>