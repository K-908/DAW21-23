//Indicamos que JavaScript se empezará a ejecutar una vez se haya cargado la página por completo
window.onload=iniciar;
//variable donde iremos guardando los mensajes de error
var errores = "";

/********************************************
                FUNCIÓN INICIAL
********************************************/

//Función que se ejecutará en cuanto haya cargado la página y empiece a ejecutarse JS
function iniciar(){
  //Creamos una cookie que contará el número de errores
    document.cookie="contador=0;";
    //Deshabilitamos la función por defecto del botón "enviar" y le decimos que en su lugar ejecute la función "validar"
    document.getElementById("enviar").addEventListener("click", validar, false);
    //Creamos los eventos para que los campos "nombre" y "apellidos" ejecuten la funcón "mayus()" cuando se les quite le foco 
    document.getElementById("nombre").addEventListener("blur", mayus);
    document.getElementById("apellidos").addEventListener("blur", mayus);
}

/*------------------------------------------
            FUNCIONES AUXILIARES
-------------------------------------------*/

//Función para obtener el valor de una cookie
function getCookie(cname) {
  //Crea una variable con el nombre introducido como argumento y el símbolo "="
    let name = cname + "=";
    //Asignamos a una variable el valor sin cifrar de  la cookie
    let decodedCookie = decodeURIComponent(document.cookie);
    //Cuando hay varias cookies, las separa cuando llega al símbolo ";" y las añade a un array
    let ca = decodedCookie.split(';');
    //Recorremos el array
    for(let i = 0; i <ca.length; i++) {
      //Asignamos a una variable el valor de cada elemento del array creado
      let c = ca[i];
      //Eliminamos los espacios. Recorremos el elemento, y mientras que el primer caracter sea un espacio
      while (c.charAt(0) == ' ') {
        //Creamos un substring a partir de dicho espacio. Esto se repite hasta que no haya más espacios
        c = c.substring(1);
      }
      //Si el comienzo de la variable con el valor del elemento del array coincide con la variable creada con el nombre
      //del argumento + "="
      if (c.indexOf(name) == 0) {
        //Devolvemos un substring que va desde después del símbolo "=" hasta el final 
        return c.substring(name.length, c.length);
      }
    }
    //Si se ha producido cualquier error, como que no encuentre la cookie, devuelve un string vacío
    return "";
}


//Función que cambia el texto de los campos "nombre" y "apellidos" a mayúsculas cuando se les quita el foco
function mayus(e){
  let texto = document.getElementById(e.target.id);
  texto.value = texto.value.toUpperCase();
}


//Función que actualiza los mensajes de error
function actualizaErrores(){
  //Obtiene el valor de la variable "errores" y lo escribe en el HTML de <div id="errores"> 
  document.getElementById("errores").innerHTML=errores;
  //Cada vez que se actualicen los errores, se ejecuta la función que aumenta en 1 el contador de errores
  masUno();
}


//Función que aumenta en uno el contador de errores
function masUno(){
  //Creamos una variable que obtendrá el valor de la cookie "contador" usando la función "getCookie()"
  let valor = getCookie("contador");
  //Convertimos la variable a un número y le sumamos +1
  valor = parseInt(valor)+1;
  //Al crear una cookie con el mismo nombre, se sobreescribirá con el nuevo valor
  document.cookie="contador="+valor+";";
  //Por último añadimos el mensaje de número te intentos y el valor de la cookie al HTML de <div id="intentos">
  document.getElementById("intentos").innerHTML="Intento de Envíos del formulario: "+valor;
}

/* ////////////////////////////////////////////////////////////////////
            FUNCIONES PARA COMPROBACIONES EN EL FORMULARIO
/////////////////////////////////////////////////////////////////////*/

//Función para comprobar el nombre introducido en el formulario
function compruebaNombre(){
  //Añadimos el elemento "nombre" del formulario a una variable
    var nombre = document.getElementById("nombre");
    //Comprobamos si el valor de ese elemento estaba vacío
    if(nombre.value == ""){
      //En caso de que lo esté, se indica en el mensaje de error
      errores="El campo nombre no puede estar vacío";
      //Ponemos el foco del puntero sobre ese campo
      document.getElementById("nombre").focus();
      //Asignamos la clase "error" a ese elemento para que se modifique su CSS
      document.getElementById("nombre").className = "error";
      //Ejecutamos la función "actualizaErrores()"
      actualizaErrores();
      return false;
    }else{
      //En caso de que no haya errores, eliminamos el nombre de clase por si tenía asignado "error"
      document.getElementById("nombre").className = "";
      return true;
    }
}


//Función para comprobar los apellidos introducidos en el formulario. Es el mismo proceso que en la función "compruebaNombre()"
function compruebaApellidos(){
  var apellidos = document.getElementById("apellidos");
  if(apellidos.value == ""){
    errores="El campo apellidos no puede estar vacío";
    document.getElementById("apellidos").focus();
    document.getElementById("apellidos").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("apellidos").className = "";
    return true;
  }
}


//Función para comprobar la edad introducida en el formulario
function compruebaEdad(){
  //Empezamos asignando a una variable el elemento con ID "edad" y lo convertimos en un número
  var edad = document.getElementById("edad");
  edad = parseInt(edad.value);
  //Si no se introdujo un valor numérico, salta un error
  if(isNaN(edad)){
    errores="La edad debe ser un número";
    document.getElementById("edad").focus();
    document.getElementById("edad").className = "error";
    actualizaErrores();
    return false;
    //Comprobamos que la edad esté comprendida entre 0 y 105
  } else if(edad <0 || edad >105){
    errores="La edad debe estar comprendida entre 0 y 105";
    document.getElementById("edad").focus();
    document.getElementById("edad").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("edad").className = "";
    return true;
  }
}


//Función para comprobar el NIF introducido en el formulario
function compruebaNif(){
  //Asignamos a una variable el elemento con ID "nif"
  var nif = document.getElementById("nif");
  //Creamos una expresión regular con el formato que debe tener el NIF. La explicación sobre las expresiones regulares está regex.txt
  const formato = /(\d{8})-([a-z]|[A-Z]){1}$/;
  //Comprobamos que el campo no esté vacío
  if (nif.value == ""){
    errores = "Campo NIF vacío";
    document.getElementById("nif").focus();
    document.getElementById("nif").className = "error";
    actualizaErrores();
    return false;
    //Comprobamos que el formato sea correcto
  } else if(!formato.test(nif.value)){
    errores = "Error en el formato del NIF.";
    document.getElementById("nif").focus();
    document.getElementById("nif").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("nif").className = "";
    return true;
  }
}


//Función para comprobar el teléfono introducido en el formulario
function compruebaTelefono(){
  //Asignamos a una variable el elemento con ID "teléfono"
  var numero = document.getElementById("telefono");
  //Convertimos esa variable en número
  numero = parseInt(numero.value);
  //Creamos una constante con el primer dígito del número para comprobar que sea 6 ó 9
  const primerDigito = String(numero)[0];
  //Creamos una constante con la longitud que debe tener el teléfono
  const longitud = String(numero).length;
  //Si no se ha introducido un número, salta un error
  if(isNaN(numero)){
    errores="El teléfono debe ser un número";
    document.getElementById("telefono").focus();
    document.getElementById("telefono").className = "error";
    actualizaErrores();
    return false;
    //Comprobamos el primer dígito, y si no es 6 ó 9, salta un error
  } else if(primerDigito!="6" && primerDigito!="9"){
    errores="El número debe empezar por 6 o 9";
    document.getElementById("telefono").focus();
    document.getElementById("telefono").className = "error";
    actualizaErrores();
    return false;
    //Si la longitud del teléfono no es exactamente de 9 dígitos, salta un error
  } else if(longitud!=9){
    errores="El número de teléfono ha de tener 9 dígitos";
    document.getElementById("telefono").focus();
    document.getElementById("telefono").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("telefono").className = "";
    return true;
  }
}


//Función para comprobar el email introducido en el formulario
function compruebaEmail(){
  var email = document.getElementById("email");
  //Creamos una expresión regular con el formato que debe tener el email
  const formato = /^([\w-\.])+(@)([\w-\.])+(\.)([a-zA-Z]){2,}((\.)([a-zA-Z]){2,})?$/;
  //Si el campo está vacío, salta un error
  if(email.value == ""){
    errores="Campo email vacío";
    document.getElementById("email").focus();
    document.getElementById("email").className = "error";
    actualizaErrores();
    return false;
    //Si el formato no se corresponde con la expresión regular, salta un error
  } else if(!formato.test(email.value)){
    errores="Error en el formato del email";
    document.getElementById("email").focus();
    document.getElementById("email").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("email").className = "";
    return true;
  }
}


//Función para comprobar la fecha introducida en el formulario
function compruebaFecha(){
  var fecha = document.getElementById("fecha");
  //Creamos una expresión regular con el formato que debe tener la fecha
  const formato = /^((0?|[1-2])[0-9]|(3)[0-1])((\/)|-)(((0)[0-9])|((1)[0-2]))((\/)|-)\d{4}$/;
  //Si el campo está vacío, salta un error
  if(fecha.value == ""){
    errores = "Campo fecha vacío.";
    document.getElementById("fecha").focus();
    document.getElementById("fecha").className = "error";
    actualizaErrores();
    return false;
    //Si el formato no se corresponde con la expresión regular, salta un error
  } else if(!formato.test(fecha.value)){
    errores = "Formato de fecha incorrecto. Debe ser dd-mm-yyyy o dd/mm/yyyy";
    document.getElementById("fecha").focus();
    document.getElementById("fecha").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("fecha").className = "";
    return true;
  }
}


//Función para comprobar que se ha seleccionado una provincia.
function compruebaProvincia(){
  //Creamos una variable con el valor del elemento con ID "provincia" 
  var provincia = document.getElementById("provincia");
  //Si su valor es igual a 0 (el valor de la opción por defecto), salta un error
  if(provincia.value == 0){
    errores = "Selecciona una provincia";
    document.getElementById("provincia").focus();
    document.getElementById("provincia").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("provincia").className = "";
    return true;
  }
}


//Función para comprobar la hora introducida en el formulario
function compruebaHora(){
  //Creamos una variable con el valor del elemento con ID "hora"
  var hora = document.getElementById("hora");
  //Creamos una expresión regular con el formato que tebe dener la hora
  const formato = /(([0-1]\d)|([2][0-3])):[0-5]\d$/;
  //Si el campo está vacío, salta un error
  if(hora.value == ""){
    errores = "Campo hora vacío.";
    document.getElementById("hora").focus();
    document.getElementById("hora").className = "error";
    actualizaErrores();
    return false;
    //Si no se corresponde al formato de la expresión regular, salta un error
  } else if(!formato.test(hora.value)){
    errores = "Formato de hora incorrecto. Debe ser hh:mm";
    document.getElementById("hora").focus();
    document.getElementById("hora").className = "error";
    actualizaErrores();
    return false;
  } else{
    document.getElementById("hora").className = "";
    return true;
  }
}


//Función que valida todos los campos introducidos
function validar(e){
  //Al pulsar sobre el botón "enviar", se comprueban todas las funciones de comprobación
  if(compruebaNombre() && compruebaApellidos() && compruebaEdad() 
  && compruebaNif() && compruebaEmail() && compruebaProvincia() 
  && compruebaFecha() && compruebaTelefono() && compruebaHora() 
  //En caso de que todas nos devuelvan "true", es decir, sean correctas
  //nos saltará una ventana de confirmación
  && confirm("¿Deseas enviar el formulario?")){
    //Si aceptamos, nos lleva a la acción por defecto del formulario
    return true;
  } else{
    //Si cancelamos, no realiza la acción por defecto y no nos lleva a ningún sitio
    e.preventDefault();
    return false;
  }
}