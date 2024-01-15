window.addEventListener("load", start);

var enlace = window.location.href;
var codigo = enlace.substring(enlace.indexOf("=")+1, enlace.length);
codigo = decodeURI(codigo);



function start(){
    jQuery(document).bind("keyup keydown", function(e){
        if(e.ctrlKey && e.keyCode == 80){
            imprimir();
        }
    });
    getPrestamo();
}

function getPrestamo(){
    $.ajax({
        method: "POST",
        url: "funciones/FImprimir.php",
        data: {functionName:"getPrestamos",codigo:codigo}
    })
    .done(function(response){
      const arr = Array.from(JSON.parse(response));

      arr.forEach(element => {
            subConsulta(element.IDprestamo, element.Evento)
        });
    })
}

function mostrarImagen(){
    $.ajax({
        method: "POST",
        url: "funciones/FImprimir.php",
        data: {functionName:"mostrarImagen"}
    })
    .done(function(response){
        var result = JSON.parse(response);
        console.log(result.imagen)
        document.querySelector("#imgLogoImprimir").setAttribute("src", result.logo);
    })
}

function subConsulta(idPrestamo, evento){
    $.ajax({
        method: "POST",
        url: "funciones/FImprimir.php",
        data: {functionName:"getInfoPrestamo",idPrestamo:idPrestamo}
    })
    .done(function(response){
      const arr = Array.from(JSON.parse(response));
        rellenarLista(arr[0].prestamista, arr[0].CorreoUser, arr[0].fechaPrestada, arr[0].fechaPrevistaDevolucion, evento);
        arr.forEach(element => {
            rellenarTabla(element.CodProducto, element.nomProducto, element.cantidad, element.Comentarios, element.numeroDeSerie);
        });
    })
}

function rellenarTabla(codP, nomP, cant, com, numSer){
    var fila = document.createElement("tr");

    var celdaCodP = crearCelda(codP);
    var celdaNomP = crearCelda(nomP);
    var celdaCant = crearCelda(cant);
    var celdaCom = crearCelda(com);
    var celdaNumSer = crearCelda(numSer);

    fila.appendChild(celdaCodP);
    fila.appendChild(celdaNomP);
    fila.appendChild(celdaCant);
    fila.appendChild(celdaCom);
    fila.appendChild(celdaNumSer);

    document.getElementById("tablaProductosImprimir").appendChild(fila);
}

function crearCelda(datos){
    var celda = document.createElement("td");
    celda.textContent = datos;
    return celda;
}

function rellenarLista(pres, corrU, fechP, fechPD, event){
    borrarLista()
    crearCeldaCabecera(pres);
    crearCeldaCabecera(corrU);
    crearCeldaCabecera(fechP);
    crearCeldaCabecera(fechPD);
    crearCeldaCabecera(event);
}

function borrarLista(){
    var fila = document.getElementById("filaConDatos");
    fila.replaceChildren();
}

function crearCeldaCabecera(datos){
    var fila = document.getElementById("filaConDatos");
    var celda = document.createElement("td");
    celda.textContent = datos;
    fila.appendChild(celda);
}


function imprimir(){
    document.getElementById("botonImprimir").style.display = "none";
    window.print();
    window.close();
}