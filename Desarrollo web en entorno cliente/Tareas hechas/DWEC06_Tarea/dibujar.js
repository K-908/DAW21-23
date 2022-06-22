//Evento para que, en cuanto termine de cargar la página, se ejecute la función "inicio"
window.addEventListener("load", inicio);
//Función de inicio
function inicio(){
    //Función que dibuja la tabla con HTML
    dibujarTabla();
    //Seleccionamos todos los elementos con la clase "cuadrito", es decir, todos los cuadritos individuales del lienzo
    var cuadrados = document.getElementsByClassName("cuadrito");
    //Seleccionamos todos los elementos con la clase "color", es decir, la paleta de colores para el pincel
    var colores = document.getElementsByClassName("color");
    //Les añadimos un evento para que, al hacer click sobre ellos, se ejecute la función "seleccionar"
    for(var i=0;i< colores.length;i++){
        colores[i].addEventListener("click", seleccionar, false);
    }
    for(var i=0;i< cuadrados.length;i++){
        cuadrados[i].addEventListener("click", preparaPincel, false);
    }
    
    for(var i=0;i< cuadrados.length;i++){
        cuadrados[i].addEventListener("mouseover", pintar, false);
        cuadrados[i].addEventListener("click", pintar, false);
    }
}

//Función que dibuja la tabla con HTML
function dibujarTabla(){
    var lienzo = document.getElementById("lienzo");
    /*  La tabla tendrá unas dimensiones de 30x30.
        El primer bucle dibujará las 30 filas.
        Lo hará añadiendo una etiqueta <tr> al elemento con id "lienzo"
    */
    for(let i=0;i<30;i++){
        let fila = document.createElement("tr");
        //A cada fila le asignamos la clase "tablerodibujo" para el CSS
        fila.classList.add("tablerodibujo");
        lienzo.appendChild(fila);
        /*
            Por cada etiqueta <tr> creada, se ejecuta 30 veces un bucle que crea
            una etiqueta <td> y la añade al elemento con id "lienzo"
        */
        for(let j=0;j<30;j++){
            let cuadrado = document.createElement("td");
            //A cada cuadro le añadimos la clase tablerodibujo para el CSS
            cuadrado.classList.add("tablerodibujo");
            //Y una clase "cuadrito" para gestionar los eventos
            cuadrado.classList.add("cuadrito");
            //Añadimos el cuadrado al elemento "lienzo"
            lienzo.appendChild(cuadrado);
        }
    }
}

//Función que modifica el pincel para elegir color
function preparaPincel(){
    //Asignamos los elementos con la clase "color" a una variable
    var colores = document.getElementsByClassName("color");
    //Asignamos el evento con id "pincel" a una variable
    var pincel = document.getElementById("pincel");
    //Asignamos los elementos con la clase "cuadrito" a una variable
    var cuadrados = document.getElementsByClassName("cuadrito");
    //Si el pincel ya tiene un atributo del tipo clase
    if(pincel.hasAttribute("class")){
        //se lo quitamos
        pincel.removeAttribute("class");
        //Eliminamos el evento "mouseover" de los cuadrados.
        //Si no lo hacemos cada vez que pasemos le ratón por encima les asignará una clase "Undefined"
        for(var i=0;i< cuadrados.length;i++){
            cuadrados[i].removeEventListener("mouseover", pintar);
        }
    //Si el pincel no tiene un atributo del tipo clase
    }else {
        //Buscamos en la paleta de colores cuál está seleccionado
        for(var i=0;i<colores.length;i++){
            if(colores[i].classList.contains("seleccionado")){
                //Y añadimos la clase que determina su color al pincel
                pincel.classList.add(colores[i].classList[1]);
            }
        }
        //Recorremos todos los cuadrados del lienzo
        for(var i=0;i< cuadrados.length;i++){
            //Y les asignamos el evento "pintar" si hacemos click o si pasamos el ratón por encima.
            cuadrados[i].addEventListener("mouseover", pintar, false);
            cuadrados[i].addEventListener("click", pintar, false);
        }
    }
    //Switch que cambiará el texto bajo la paleta de colores y el color de la letra según qué color esté seleccionado
    var caso = pincel.classList[0];
    switch(caso){
        case "color1":
            pincel.textContent = "Pincel amarillo habilitado";
            pincel.style.color = "black";
            break;

        case "color2":
            pincel.textContent = "Pincel verde habilitado";
            pincel.style.color = "black";
            break;

        case "color3":
            pincel.textContent = "Pincel negro habilitado";
            pincel.style.color = "white";
            break;

        case "color4":
            pincel.textContent = "Pincel rojo habilitado";
            pincel.style.color = "black";
            break;

        case "color5":
            pincel.textContent = "Pincel azul habilitado";
            pincel.style.color = "black";
            break;

        case "color6":
            pincel.textContent = "Pincel blanco habilitado";
            pincel.style.color = "black";
            break;

        default:
            pincel.textContent = "Pincel deshabilitado";
            pincel.style.color = "black";
            break;
    }
}
//Función para seleccionar uno de los colores de la paleta
function seleccionar(){
    //Asignamos a una variable todos los elementos con la clase "color"
    var seleccion = document.getElementsByClassName("color");
    for(var i=0;i<seleccion.length;i++){
    //Eliminamos la clase "seleccionado" en todos (solo afectará al elemento seleccionado)
        seleccion[i].classList.remove("seleccionado");
    }
    //Al elemento en el cual hemos hecho click, le añadimos la clase "seleccionado"
    this.classList.add("seleccionado");
}

//Función para pintar los cuadrados
function pintar(){
    //Añadimos a una variable la clase que del color que tiene asignado el pincel
    var color = document.getElementById("pincel").classList[0];
    //Si el pincel tiene el atributo "clase"
    if(document.getElementById("pincel").hasAttribute("class")){
        //Eliminamos todos los posibles colores que pueda tener por si queremos cambiar de color
        this.classList.remove("color1");
        this.classList.remove("color2");
        this.classList.remove("color3");
        this.classList.remove("color4");
        this.classList.remove("color5");
        this.classList.remove("color6");
        }
        //Al cuadrado sobre el que hemos hecho click o hemos pasado el ratón por encima
        //le asignamos el color que tiene el pincel
        this.classList.add(color);
    }
