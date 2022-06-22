<?php
//Comenzamos la sesión.
        session_start();
    //Inicializamos las variables asignándoles los valores "No establecido".
        $hora = "No establecido";
        $perfil = "No establecido";
        $idioma = "No establecido";
        //Si las variables de sesión han sido establecidas y no se ha pulsado el botón "Borrar",
        //se le asgina a las variables el valor de las variables de sesión
        if(isset($_SESSION['hora'])&&!isset($_POST['borrar'])){
            
            $hora = $_SESSION['hora'];
            $perfil = $_SESSION['perfil'];
            $idioma = $_SESSION['idioma'];
            //Si se ha pulsado el botón "borrar", se destruyen los valores de las variables de sesión
        } elseif(isset($_POST['borrar'])){
            session_destroy();
        }
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
    <div class="formulario2">
    <p class="preferencias"><i class="fas fa-user-cog"></i>  Preferencias</p>
        <?php   
        //Si se pulsa el botón "borrar" pero no las variables de sesión están vacías,
        //nos alerta de que primero debemos establecer las opciones
            if(isset($_POST['borrar'])&&!isset($_SESSION['hora'])){
                print "<p class=\"msjbr\">Debes establecer primero las ociones</p>";
                //Si hemos pulsado el botón borrar y las variables de sesión están establecidas,
                //nos alerta de que las preferencias han sido borradas
            } elseif(isset($_POST['borrar'])&&isset($_SESSION['hora'])){
                print "<p class=\"msjbr\">Preferencias borradas</p>";
            }
        ?>
<!--Lista de opciones, utilizan los valores de las variables establecidas al principio de la página -->
        <p>Idioma: <?php echo $idioma ?></p>
        <p>Perfil Público: <?php echo $perfil ?></p>
        <p>Zona Horaria: <?php echo $hora ?></p>
        <div class="botones">
            <div class="floatdiv">
    <!--Los botones de "Borrar" y "Establecer" cada uno en su propio formulario -->
        <form action="<?php echo $_SERVER['PHP_SELF']  ?>" method="POST">
    <!--Botón borrar. Al pulsarlo establecemos $_POST['borrar'] -->
        <input type="submit" name="borrar" value="Borrar preferencias" class="btn btn-success float-left botonizq">
        </form></div>
        <div class="floatdiv">
        <form action="preferencias.php" method="POST">
    <!--Botón volver. Al pulsarlo establecemos $_POST['volver'] -->
        <input type="submit" name="volver" value="Establecer" class="btn btn-primary float-right botonder">
        </form></div>
        </div>
    
    </div>

    
</body>
</html>