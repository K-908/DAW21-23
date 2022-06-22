<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DWES02_Tarea</title>

    <style>
        body{
            background-color:#FA8072;
        }

        h1{
            text-align:center;
        }

        p{
            font-family: "Comic Sans MS", cursive, sans-serif;
            font-size: 25px;
            color: white;
            font-weight: 700;
            text-align:center;
        }

        table, td{
            width:100%;   
        }

        td{
            width:50%;
            margin-bottom:5px;
        }
        
        fieldset{
            margin-left:auto;
            margin-right:auto;
        }

        .cuadroNombre{
            color:#0e19ea;
            font-weight:bold;
        }

        .cuadroTelefono{
            color:#fff200;
            font-weight:bold;
        }

        .formulario1{
            width:50%;
            margin-left:auto;
            margin-right:auto;
        }

        .etiqueta{
            color:blue;
            font-weight:bold;
            width:50%;
        }

        .textoinput{
            width:50%;
        }

        #botonSubmit, #botonReset{
            margin-left:auto;
            margin-right:auto;
            font-weight:bold;
        }

        #botonSubmit{
            color:green;
        }

        #botonReset{
            color:red;
        }

        #botonVaciar{
            color:#FF6633;
            font-style:italic;
            font-size:15px;
        }

    </style>
</head>
<body>
    <h1>Agenda</h1>

<?php

/*
Envolvemos todo el código dentro de este if para que la primera vez que hagamos la página
no nos salte el error de que el campo "nombre" no puede estar vacío
*/
if(isset($_POST['enviar'])){

    /* 
    Primero comprobamos si los arrays que contienen los nombres y teléfonos de los contactos
    están vacíos. Si están vacíos, creamos los arrays. Si no lo están, poblamos los arrays
    con la información guardada en el formulario
    */
    if(!empty($_POST['listaNombres'])){
        $lista_nombres=explode(",",$_POST['listaNombres']);
        $lista_telefonos=explode(",", $_POST['listaTelefonos']);
        /*
        Tenemos tres arrays: dos numéricos con teléfonos y nombres para guardar la información
        y uno asociativo con la misma información combinada que es lo que se mostrará en pantalla        
        */
            foreach($lista_nombres as $nombre){
            $clave=array_search($nombre, $lista_nombres);
            $agenda[$lista_nombres[$clave]]=$lista_telefonos[$clave];
            }
    } else{
        $lista_nombres=[];
        $lista_telefonos=[];
        $agenda = [];
    }

    //Comprobamos que el campo 'nombre' no está vacío. Si lo está, salta un error.

    if(empty($_POST['nombre'])){
        print "<div><p>Error, campo nombre vacío.</p></div>";
    //Si el nombre introducido ya existe y el campo 'telefono' está vacío, borra ese contacto
    } else if(array_key_exists($_POST['nombre'], $agenda) && empty($_POST['telefono'])){
        $clave = array_search($_POST['nombre'], $lista_nombres);
        unset($lista_nombres[$clave]);
        unset($lista_telefonos[$clave]);
        unset($agenda[$_POST['nombre']]);
    /*
    Si el nombre introducido existe y se introduce un teléfono, el contacto se actualiza
    No se ha limitado los teléfonos a datos numéricos para permitir el uso de guiones
    */
    } else if(array_key_exists($_POST['nombre'], $agenda) && !empty($_POST['telefono'])){
        $clave = array_search($_POST['nombre'], $lista_nombres);
        $lista_telefonos[$clave]=$_POST['telefono'];
        $agenda[$_POST['nombre']]=$_POST['telefono'];
    }
    //Si el nombre es nuevo, y se ha introducido un teléfono, se crea el nuevo contacto
    else if(!array_key_exists($_POST['nombre'], $agenda) && !empty($_POST['telefono'])){
        $agenda[$_POST['nombre']]=$_POST['telefono'];
        $lista_nombres[]=$_POST['nombre'];
        $lista_telefonos[]=$_POST['telefono'];
    }
    //Por descarte, si se introduce un nombre nuevo sin número de teléfono no ocurre nada

    //Si la agenda no está vacía, la mostramos en pantalla. Si está vacía, no se verá nada.
    if(!empty($agenda)){
        print"<div class=\"formulario1\">
        <fieldset>
        <legend>Lista de contactos</legend>
        <table>";
        foreach($agenda as $nm => $tlf){
            print "<tr>
            <td class=\"cuadroNombre\">".$nm."</td>
            <td class=\"cuadroTelefono\">".$tlf."</td>
            </tr>";
        }
    }
    print"</table></fieldset></div>";
}

?>
    <!--Formulario para introducir los datos utilizando el método POST -->
    <div class="formulario1">
      <form name="form1"method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <fieldset>
           <legend>Nuevo Contacto</legend>
            <table>
                <tr>
                    <td class="etiqueta"><label class="etiqueta" for="forNombre" >Nombre</label></td>
                    <td><input class="textoinput" type="text" name="nombre"></td>
                </tr>
                <tr>
                    <td><label class="etiqueta" for="forTelefono" >Teléfono</label></td>
                    <td><input class="textoinput" type="text" name="telefono"></td>
                </tr>
                <tr>
                   <td><input id="botonSubmit" type="submit" value="Añadir contacto" name="enviar"></td>
                   <td><input id="botonReset" type="reset" value="Limpiar campos"></td>
                </tr>
            </table>
            <!--Campos invisibles para guardar la información. 
                El método "implode" convierte los arrays en Strings separándolos por comas -->
            <input type="hidden" value="<?php if(isset($lista_nombres)) echo implode(",",$lista_nombres) ?>" name="listaNombres">
            <input type="hidden" value="<?php if(isset($lista_telefonos)) echo implode(",",$lista_telefonos) ?>" name="listaTelefonos">
        </fieldset>
      </form>
    </div>

    <!--Este segundo formulario está envuelto en una condición de PHP para que no se vea en pantalla
    si la agenda está vacía. Cuando sea visible, aparecerá el botón para borrarlo todo -->
    <?php if(!empty($agenda)) : ?>
        <div class="formulario1">
            <fieldset>
                <legend>Vaciar Agenda</legend>
                <form name="form2" method="get" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                    <input id="botonVaciar" type="submit" value="Vaciar" name="vaciar">
                </form>
            </fieldset>
        </div>
    <?php endif; ?>


</body>
</html>