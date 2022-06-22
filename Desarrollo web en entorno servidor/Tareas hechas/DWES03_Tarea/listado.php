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
<h1 class="titulo">Gestión de productos</h1>
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
    
    //Botón que nos lleva a la página "crear.php"
    print "<div class=\"crearContainer\"><button class=\"boton botonCrear\" onclick=\"location.href='crear.php'\">Crear</button></div>";

    //Guardamos en un array los datos nombre e id de los productos.
    $resultado = $conProyecto->query('SELECT nombre, id FROM productos');
    print "<table>";
    print "<th>Detalle</th><th>Código</th><th>Nombre</th><th colspan=\"2\">Acciones</th>";
    //cada vez que se compruebe esta condición, sustituirá los datos en la
    //variable $stock por una nueva línea del array $resultado
    while ($stock=$resultado->fetch()){
    //para que los datos estén ordenador, se irá generando una tabla
        print "<tr>";
    //la primera columna de la tabla tendrá un botón que nos llevará a los detalles de cada producto
            print "<td>
                <form method=\"get\" action=\"/dwes03/detalle.php\" >
                    <input type=\"hidden\" name=\"id\" value=".$stock['id'].">
                    <input class=\"boton botonId\" type=\"submit\" value=\"Detalle\">
                </form>
        </input>
                   </td>";
    //las columnas 2 y 3 serán el código y nombre de cada producto.
            print "<td>".$stock['id']."</td>";
            print "<td>".$stock['nombre']."</td>";
    //la columna 4 tendrá los botones "actualizar" y "borrar", que nos llevarán a sus respectivas páginas
            print "<td>
                <form method=\"get\" action=\"/dwes03/update.php\" >
                    <input type=\"hidden\" name=\"id\" value=".$stock['id'].">
                    <input class=\"boton botonActualizar\" type=\"submit\" value=\"Actualizar\">
                </form>
                </td>
                <td>
                <form method=\"get\" action=\"/dwes03/borrar.php\" >
                    <input type=\"hidden\" name=\"id\" value=".$stock['id'].">
                    <input class=\"boton botonBorrar\" type=\"submit\" value=\"Borrar\">
                </form>

            </td>";
        print "</tr>";
    }
    print "</table>";
    //cerramos la conexión con la base de datos
    $conProyecto=null;
    ?>
</body>
</html>