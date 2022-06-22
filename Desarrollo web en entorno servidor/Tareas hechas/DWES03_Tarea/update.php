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

    //Cuando entramos a la página, obtiene el parámetro "id" con el método get
    if(isset($_GET['id'])){
        $id = htmlspecialchars($_GET['id']);
    //Si hemos pulsado el botón "enviar", el método "get" no nos devuelve información, así que la obtenemos con el método post
    } else if(isset($_POST['id'])){
        $id = htmlspecialchars($_POST['id']);
    } else{
        header("Location:listado.php");
    }
    
    //Guardamos la información de la entrada deseada en un array.
    $resultado = $conProyecto->query("SELECT nombre, nombre_corto, descripcion, pvp, familia FROM productos WHERE id='".$id."'");
    $lista=$resultado->fetch();
    //Guardamos la información de familias en un array para el desplegable
    $getFamilias=$conProyecto->query("SELECT DISTINCT familia FROM productos");
    
    //Si hemos pulsado el botón "enviar", se ejcuta el siguiente código.
    if(isset($_POST['submit'])){
    //Guardamos los datos del formulario en variables.
        $n=$_POST['nombre'];
        $nc=$_POST['nombre_corto'];
    //Eliminamos los espacios en blanco al principio y final de la descripción.
    //Si no se hace, no se ejecuta la sentencia por alguna razón.
        $d=trim($_POST['descripcion']);
        $p=$_POST['pvp'];
        $f=$_POST['familia'];
        //Intentamos ejecutar la sentencia SQL
        try{
        //Ejecutamos la sentencia de MySQL que queremos, en este caso
        //insertar un nuevo producto en la tabla "productos".
            $stmt=$conProyecto->query("UPDATE productos 
            SET nombre = '$n', nombre_corto = '$nc', pvp = '$p', familia = '$f', descripcion = '$d'
            WHERE id='$id'");
            $stmt->execute();
            //Mostramos un mensaje informando de que todo ha salido bien
            print "<h1>Página actualizada</h1>";
        } catch(PDOException $ex){
            //Si se produce cualquier error, nos muestra un mensaje.
            die("Error al actualizar producto: ".$ex->getMessage());
        }
    }
    //Cerramos la conexión con la base de datos
    $conProyecto = null;
    ?>

<!-- Impedimos que muestre errores al usuario ya que cuando pulsamos el botón enviar
nos mostrará siempre que no se ha podido obtener información de $_GET['id'] -->
<?php error_reporting(0); ?>
<!-- Si el elemento $_GET['id'] existe mostrará el formulario -->
<?php if($_GET['id']) : ?>
<!-- Formulario. Como valor le damos el contenido de cada campo en la base de datos
para que no esté vacío al empezar, así es más sencillo realizar cambios -->
<div class="container">
        <div class="row">
            <div class="col-md-6">
                <form name="actualizar" method="post" action="update.php">
                <label for="nombre">Nombre: </label>
                <input type="text" name="nombre" value="<?php echo $lista['nombre']  ?>">
            </div>
            <div class="col-md-6">
                <label for="nombre_corto">Nombre Corto: </label>
                <input type="text" name="nombre_corto" value="<?php echo $lista['nombre_corto'] ?>">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label for="familia">Familia: </label>
                <select name="familia" id="familia">
<!-- Bucle que recorrerá el array con las familias y las añadirá a un desplegable -->
                        <?php 
                            while($listaFamilia = $getFamilias->fetch()){
                                print "<option value=\"".$listaFamilia['familia']."\" ";
                            //Condicional para que la familia que muestre por defecto sea
                            //a la que pertenece el producto
                                if($listaFamilia['familia'] == $lista['familia']){
                                    echo "selected";
                                }
                                print ">".$listaFamilia['familia']."</option> ";
                            }
                        ?>
                        </select>
            </div>
            <div class="col-md-6">
                <label for="pvp">PVP: </label>
                <input type="text" name="pvp" value="<?php echo $lista['pvp']  ?>"></input>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label for="descripcion">Descripaddasción: </label>
                <textarea rows="10" name="descripcion"><?php echo $lista['descripcion']  ?></textarea>
            </div>
                <!-- Botones para actualizar o volver -->
                <div class="boton margen botonActualizar col-md-2">
                    <input type="hidden" name="id" value="<?php echo $id ?>">
                    <input type="submit" name="submit" value="Actualizar">
                    </form>
                </div>
                <div class="boton margen botonVolver col-md-2"><button onclick="location.href='listado.php'">Volver</button></div>
            </div>
    </div>
<!-- Si $_GET['id'] no existe, mostrará únicamente el botón Volver -->
<?php else : ?>
    <div class="crearContainer">
    <button class="boton botonCrear" onclick="location.href='listado.php'">Volver</button>
    </div>


<?php endif; ?>
</body>
</html>