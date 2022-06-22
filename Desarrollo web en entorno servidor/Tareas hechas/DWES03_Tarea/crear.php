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
    <h1 class="titulo">Crear</h1>
    
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
        //Guardamos todas las familias distintas en un array para mostrar el desplegable
        $getFamilias=$conProyecto->query("SELECT DISTINCT familia FROM productos");


        //Si se ha pulsado el botón "enviar" se ejecuta el siguiente código
        if(isset($_POST['submit'])){
        //se añaden los valores del formulario a variables
            $n=$_POST['nombre'];
            $nc=$_POST['nombre_corto'];
        //Eliminamos los espacios en blanco al principio y final de la descripción.
        //Si no se hace, no se ejecuta la sentencia por alguna razón.
            $d=trim($_POST['descripcion']);
            $p=$_POST['pvp'];
            $f=$_POST['familia'];
        //Intentamos ejecutar la sentencia MySQL
            try{
        //Ejecutamos la sentencia de MySQL que queremos, en este caso
        //insertar un nuevo producto en la tabla "productos".
            $stmt=$conProyecto->query("INSERT INTO productos 
            (nombre, nombre_corto, pvp, familia, descripcion)
            VALUES ('$n', '$nc', '$p', '$f', '".$d."')");
            print "<h1>Producto creado</h1>";
        } catch(PDOException $ez){
            //Si no se ha podido ejecutar la sentencia, recibimos un error.
            die("Error al insertar producto: ".$ez->getMessage());
        }
        //Terminamos la conexión con la base de datos.
        $conProyecto = null;
    }
            
    ?>
    <!-- Formulario donde introducir los datos 
    Los campos tienen el atributo "required" para que no se pueda enviar el formulario
    si se deja alguno en blanco (salvo descripción, que acepta el valor "Null") -->
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <form method="post" action="crear.php">
                <label for="nombre">Nombre</label>
                <input type="text" name="nombre" required>
            </div>
            <div class="col-md-6">
                <label for="nombre_corto">Nombre Corto</label>
                <input type="text" name="nombre_corto" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label for="familia">Familia</label>
                <select id="familia" name="familia">
        <!-- Bucle que recorrerá el array de familias y las mostrará en un selector desplegable -->
                <?php
                    while($listaFamilia = $getFamilias->fetch()){
                        print "<option value=\"".$listaFamilia['familia']."\">".$listaFamilia['familia']."</option>";
                    }
                ?>
                </select>
            </div>
            <div class="col-md-6">
                <label for="pvp">PVP</label>
                <input type="text" name="pvp" required></br>
            </div>
        </div>
        <div class="row">

            <div class="col-md-8">
                <label for="descripcion">Descripción</label>
                <textarea rows="10" name="descripcion"></textarea>
            </div>
            <div class="col-md-1"><input class="boton margen botonActualizar" type="submit" name="submit" value="Enviar"></div>
            <div class="col-md-1"><input class="boton margen botonBorrar" type="reset" name="borrar"></div>
            <div class="col-md-1"><button class="boton margen botonVolver" onclick="location.href='listado.php'">Volver</button></div>

        </div>
    <!-- Añadimos botones para enviar, borrar los datos introducidos y volver a la página principal -->


    </form>
        </div>
    </div>

</body>
</html>