<?php
//iniciamos la sesión
    session_start();
    //comprobamos que se haya pulsado el botón "establecer" para asignarle valores a las variables de sesión,
    //y que no estemos volviendo de la página "mostrar"
    if (isset($_POST['submit'])&&!isset($_POST['volver'])){
        
        $_SESSION['idioma']=$_POST['idioma'];
        $_SESSION['perfil']=$_POST['perfil'];
        $_SESSION['hora']=$_POST['hora'];
    }
    //creamos los arrays con los valores de las opciones
    $idioma=Array("Español", "Inglés");
    $perfil=Array("Sí", "No");
    $hora=Array("GMT-2", "GMT-1", "GMT", "GMT+1", "GMT+2");

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Importamos bootstrap, font-awesome y el script para utilizar font-awesome -->
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/552284cb96.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css">
    <title>DWES04_Tarea</title>
</head>
<body>
<!-- creamos un div para posicionar el formulario -->
<div class="formulario">
    <h2>Preferencias Usuario</h2>
    <?php
    //si se ha pulsado el botón "enviar" nos aparecerá un mensaje debajo del título 
    if(isset($_POST['submit'])){
        print "<p class=\"msjsv\">Preferencias guardadas correctamente</p>";
    }
    ?>

    <!--Creamos el formulario con las opciones de preferencias -->
    <form name= "preferencias" method="POST" action="<?php echo $_SERVER['PHP_SELF'] ?>">
    <!--Opción de idioma -->
    <label for="idioma"><i class="fas fa-language"></i>  Idioma:</label>
    <select name="idioma" id="idioma" class="form-control">
    <?php
    //un bucle que recorre todas las opciones del array y las muestra en un menú desplegable
        foreach($idioma as $idio){
            print "<option value=\"".$idio."\" ";
            //si ya se ha asignado el valor a una variable de sesión, dicha variable aparecerá ya seleccionada
            if(isset($_SESSION['idioma'])){
            if($_SESSION['idioma'] == $idio){
                echo "selected";
            }
        }
            print ">".$idio."</option>";
        }
    ?>
    </select>
    <!--Opción de perfil -->
    <label for="perfil"><i class="fas fa-user-secret"></i>  Perfil Público:</label>
    <select name="perfil" id="perfil" class="form-control">
    <?php
        //un bucle que recorre todas las opciones del array y las muestra en un menú desplegable
        foreach($perfil as $perf){
            print "<option value=\"".$perf."\" ";
            //si ya se ha asignado el valor a una variable de sesión, dicha variable aparecerá ya seleccionada
            if(isset($_SESSION['idioma'])){
            if($_SESSION['perfil'] == $perf){
                echo "selected";
            }
        }
            print ">".$perf."</option>";
        }
    ?>
    </select>
    <label for="hora"><i class="fas fa-clock"></i>  Zona horaria:</label>
    <select name="hora" id="hora" class="form-control">
    <?php
        //un bucle que recorre todas las opciones del array y las muestra en un menú desplegable
        foreach($hora as $hor){
            print "<option value=\"".$hor."\" ";
            //si ya se ha asignado el valor a una variable de sesión, dicha variable aparecerá ya seleccionada
            if(isset($_SESSION['idioma'])){
            if($_SESSION['hora'] == $hor){
                echo "selected";
            }
        }
            print ">".$hor."</option>";
        }
    ?>
    </select>
    <!--Botones del formulario. "Submit" establece las preferencias y el botón normal nos lleva a mostrar.php -->
        <div class="botones">
        <input type="submit" name="submit" class="btn btn-success float-left" value="Establecer preferencias">
        <!--Para ir a "mostrar.php" no necesitamos información adicional, así que usamos un botón normal -->
        <a href="mostrar.php" class="btn btn-primary float-right">Mostrar preferencias</a>
        </div>
    </div>
</form>


</body>
</html>