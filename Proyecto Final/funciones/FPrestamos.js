window.addEventListener("load", start);
var arrCodigoEnLista;
var scanner;
var esEscaner = false;
let isScannerActive;
let caracterControl = localStorage.getItem("caracterControlCodigos");

function start() {
    isScannerActive = true;
    scanner = new Html5Qrcode("qr-reader");
    arrCodigoEnLista = [];
    crearForm();
    events();
    useBarcodeReader();
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        // Touch events supported, likely a mobile device
        console.log("Mobile device detected");
    } else {
        // No touch events supported, likely a computer
        document.getElementById("contenedorCamara").replaceChildren();
        console.log("Computer detected");
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function crearForm() {    
    var fechaHoy = new Date();
    var fechaDevolucion = fechaHoy.toISOString().split('T')[0];
    //var fechaDevolucion = fechaHoy.getFullYear() + "-" + (fechaHoy.getMonth() + 1) + "-" + fechaHoy.getDate()
    var columnaIzquierda = document.getElementsByClassName("columnaIzquierda")[0];

    //Añadimos el HTML del formulario para buscar los productos en prestamo.html
    columnaIzquierda.innerHTML = `<div id="mensajeError"></div>
        <div id="divFormularioPrestamos">
            <form action="" name="formularioAlta" id="formularioPrestamos">
                <div class="formularios" id="altaProd">
                        <div class="grupoFormularioAlta">
                            <td><label>Código producto: *</label></td>
                            <td><input type="text" name="codigo" id="codigo"></td>
                        </div>

                        <div class="grupoFormularioAlta">
                            <td><label>Prestamista: *</label></td>
                            <td><select  name="prestamista" id="prestamista"></select></td>
                        </div>

                        <div class="grupoFormularioAlta">
                            <td><label>Usuario: *</label></td>
                            <td><select name="Usuario" id="selectUsuarios"></select></td>
                        </div>

                        <div class="grupoFormularioAlta">
                            <td><label>Fecha de devolución: *</label></td>
                            <td><input type="date" name="fechaDev" id="fechaDev" value="${fechaDevolucion}" min="${fechaDevolucion}"></td>
                        </div>

                        <div class="grupoFormularioAlta">
                            <td><label>Evento: *</label></td>
                            <td><input type="text" name="evento" id="evento" required></td>
                        </div>
                </div>
            </form>
            </div>
            <div id="divLista">
            <table id="tablaLista">
                <tr class="cabecera" id="cabeceraListaProductos">
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Stock disponible</th>
                    <th>Añadir</th>
                </tr>
            </table>
        </div>
    `;
    document.getElementsByClassName("columnaDerecha")[0].innerHTML = `
    <div class="colum" id="divListaCheckout">
    <div id="divBotonReserva">
        <button id="botonReserva" onclick="reservar" style="display:none;">Reservar</button>
    </div>
    <table id="listaCheckout" style="display:none;overflow-y:auto;">
        <tr class="cabecera" id="cabeceraCheckoutList">
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Fecha de préstamo</th>
            <th>Comentarios</th>
            <th>Añadir</th>
            <th>Eliminar</th>
            <th>Roto</th>
        </tr>                    
    </table>
    <div id="mensajeReserva"></div>
    <div id="contenedorFormulario"></div>
</div>
    `
    var selectUsuarios = document.getElementById("selectUsuarios");
    $.ajax({
        method: "POST",
        url: "funciones/prestamoConsulta.php",
        data: {functionName : "listarUsuarios"}
    })
    .done(function(response){
        var resultado = JSON.parse(response);
        if (resultado != null) {
            const arr = Array.from(resultado);
            arr.forEach((element) => {
                var option = document.createElement("option");
                option.setAttribute("value", element.correo);
                option.innerHTML = element.correo;
                selectUsuarios.appendChild(option);
            });
        }
    })

    var prestamista = document.getElementById("prestamista");
    $.ajax({
        method: "POST",
        url: "funciones/prestamoConsulta.php",
        data: {functionName : "listarUsuarios"}
    })
    .done(function(response){
        var resultado = JSON.parse(response);
        if (resultado != null) {
            const arr = Array.from(resultado);
            arr.forEach((element) => {
                if(element.rol != "user"){
                    var option = document.createElement("option");
                    option.setAttribute("value", element.correo);
                    option.innerHTML = element.correo;
                    prestamista.appendChild(option);
                }
            });
        }
    })
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function events(){
    //Añadimos eventos al cuadro de "Código producto".
    //Este primero para que cuando se introduzca información haga la consulta a la BD mediante la función Cargar()
    document.getElementById("codigo").addEventListener("keyup", ()=>{
        Cargar();
    }, false);
    //Esta segunda impide que se recargue la página si se pulsa la tecla "Enter"

    document.getElementById("codigo").addEventListener("keydown", (event)=>{
        if(event.key == "Enter"){
            event.preventDefault();
        }
    })

    document.getElementById("altaProd").addEventListener("focusin", function(event){
        event.target.classList.remove("mensajeError");
        document.getElementById("mensajeReserva").replaceChildren();
        isScannerActive = false;
    })

    document.getElementById("listaCheckout").addEventListener("focusin", function(event){
        event.target.classList.remove("mensajeError");
        document.getElementById("mensajeReserva").replaceChildren();
    })

    document.getElementById("formularioPrestamos").addEventListener("focusin", function(event){
        isScannerActive = false;
    }, false);

    document.getElementById("formularioPrestamos").addEventListener("focusout", (event)=>{
        isScannerActive = true;
    })

    //Observa los cambios realizados en el DOM de "listaCheckout".
    //Si sólo hay 1 elemento (la cabecera de la tabla) no muestra el botón "Reservar"
    //Si hay más de un elemento, la muestra
    const mutationObserver = new MutationObserver(entries => {
        if (document.getElementById("listaCheckout").childElementCount > 1) {
            document.getElementById("botonReserva").style.display = "";
            document.getElementById("listaCheckout").style.display = "";
        } else {
            document.getElementById("listaCheckout").style.display = "none";
            document.getElementById("botonReserva").style.display = "none";
        }
    })
    mutationObserver.observe(document.getElementById("listaCheckout"), { childList: true });
    document.getElementById("botonReserva").addEventListener("click", reservar);
}


/*
Función que realiza una petición de Ajax a la base de datos
y busca los productos cuya ID coincida total o parcialmente 
con la que es escriba en el input con ID "codigo"
*/
function Cargar(dato = "") {

    var inputCodigo = "";
    if(dato === ""){
        inputCodigo = document.getElementById("codigo").value;
        //console.log("Input Código: "+inputCodigo)
    } else{
        inputCodigo = dato;
    }
    if (inputCodigo.trim() === "") {
        limpiarTabla();
        return;
    }
    $.ajax({
        method: "POST",
        url: "funciones/prestamoConsulta.php",
        data: {functionName : "buscarProducto", codigo:inputCodigo}
    })
    .done(function(response){
        var resultado = JSON.parse(response);
        if (resultado != null) {
            limpiarTabla();
            const arr = Array.from(resultado);
            if (arr.length > 0) {
                document.getElementById("mensajeReserva").innerHTML = "";
                document.getElementById("mensajeError").innerHTML = "";
                arr.forEach((element) => {
                    if(!arrCodigoEnLista.includes(element.codigo)){
                        crearFila(element.codigo, element.nombre, element.cantidad, element.stockDisponible, element.malEstado, inputCodigo);
                    }
                });
            }else {
                document.getElementById("mensajeError").innerHTML = "El código no existe";
            }
        } 
    })
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* Función para el botón de reservar  */
function reservar() {
    document.getElementById("mensajeReserva").replaceChildren();
    var arrayTablaCheckout = document.getElementById('listaCheckout');

    for (var i = 1; i < arrayTablaCheckout.rows.length; i++) {
        var row = arrayTablaCheckout.rows[i];
        var ckFecha = checkFechas(row.cells[3].textContent, document.getElementById("fechaDev").value);
        if (!ckFecha) {
            var pError = document.createElement("p");
            pError.textContent = "-La fecha introducida es incorrecta";
            document.getElementById("mensajeReserva").appendChild(pError);
            document.getElementById("fechaDev").classList.add("mensajeError");
        }
        var ckCantidad = checkCantidad(row.querySelector(".claseCantidad").textContent, row.cells[5].querySelector("input").value);
        if (!ckCantidad) {
            var pError = document.createElement("p");
            pError.textContent = "-No hay suficiente stock de ese producto";
            document.getElementById("mensajeReserva").appendChild(pError);
            row.cells[5].firstChild.classList.add("mensajeError");
        }

        var evento = document.getElementById("evento");

        if(evento.value == ""){
            var pError = document.createElement("p");
            pError.textContent = "-El evento no puede estar vacío";
            document.getElementById("mensajeReserva").appendChild(pError);
            evento.classList.add("mensajeError");
        }
        if(!ckFecha || !ckCantidad || evento.value==""){
            return;
        }
    }

    var IDencargo;
    for (var i = 1; i < arrayTablaCheckout.rows.length; i++) {
        var row = arrayTablaCheckout.rows[i];

        var cod = row.cells[0].textContent;
        var usu = document.getElementById("selectUsuarios").value;
        var can = row.cells[5].querySelector("input").value;
        var fechaP = row.cells[3].textContent;
        var fechaD = document.getElementById("fechaDev").value;
        var coment = row.cells[4].querySelector("input").value;
        var evento = document.getElementById("evento").value;
        var prestamista = document.getElementById("prestamista").value;
        IDencargo = fechaP+"/"+usu+"/"+evento;
        $.ajax({
            method: "POST",
            url: "funciones/prestamoConsulta.php",
            data: {functionName : "reservar", codigo:cod, usuario:usu, cantidad:can, fechaPrestado:fechaP, fechaDevolucion:fechaD, comentario:coment, prestamista:prestamista, evento:evento}
        })
        .done(function(response){
            reservadoConExito(response);
        })
    }
    crearBotonImprimir(IDencargo);
    arrCodigoEnLista = [];
}

function mandarCorreo(IDencargo){
    
}

function crearBotonImprimir(IDencargo){
    var url = "imprimir.html?codigo="+IDencargo;
    var botonImprimir = document.createElement("button");
    botonImprimir.textContent = "imprimir";
    botonImprimir.addEventListener("click", function(){
        window.open(url, "Imprimir", "width=300, height:500");
        //this.remove();
        location.reload();
    })
    document.getElementById("contenedorFormulario").appendChild(botonImprimir);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

//Comprobamos que la fecha de devolución prevista es posterior a la fecha actual
function checkFechas(fechaDevolucion, fechaPrestamo) {
    if (fechaDevolucion <= fechaPrestamo) {
        return true;
    }
    return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function checkCantidad(stock, reservar) {
    //console.log(stock+"--------------"+reservar);
    if (parseInt(stock) >= parseInt(reservar)) {
        return true;
    }
    return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function reservadoConExito(response) {
    document.getElementById("codigo").value = "";
    var botonReservar = document.getElementById("botonReserva");
    var filas = document.getElementsByClassName("fila");
    var arr = Array.from(filas);
    arr.forEach((element) => {
        element.remove();
    });
    botonReservar.style.display = "none";
    document.getElementById("mensajeReserva").innerHTML = response;
}


function limpiarTabla() {
    var tabla = document.getElementById("tablaLista")
    var filas = tabla.getElementsByClassName("fila");
    var arr = Array.from(filas);
    arr.forEach((element) => {
        element.remove();
    });
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/*
Función que crea las filas de la tabla
Recibe código, nombre y cantidad y usa esos datos
para llamar a la función crearCelda()
Devuelve una fila con 4 columnas, una para cada dato y
una para el botón borrar
*/
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function crearFila(cod, nom, cant, stock, estado, inputCodigo) {
    //console.log("Cod: "+cod+"---------InputCod: "+inputCodigo)
    var fila = document.createElement("tr");
    fila.classList.add("fila");
    //Creación de las 4 celdas
    var celdaCod = crearCelda(cod);
    celdaCod.classList.add("codigoObjeto");
    celdaCod.setAttribute("value", cod);
    celdaCod.setAttribute("id", "cod"+cod);
    var celdaNom = crearCelda(nom);
    celdaNom.setAttribute("value", nom);
    celdaNom.setAttribute("id", "nom"+cod);
    var celdaCant = crearCelda(cant);
    celdaCant.setAttribute("value", cant);
    celdaCant.setAttribute("stock", stock);
    celdaCant.setAttribute("id", "cant"+cod);
    celdaCant.classList.add("claseCantidad");
    celdaCant.setAttribute("malEstado", estado);

    var celdaStock = crearCelda(stock);

    //Creación del botón y asignamos la función "borrarDato"
    var botonAddToList = document.createElement("button");
    var celdaBoton = document.createElement("td");
    botonAddToList.textContent = "Añadir a la lista";
    botonAddToList.addEventListener("click", function () {
        addToCheckoutList(fila, cod);
    });

    if (stock <= 0) {
        botonAddToList.setAttribute("disabled", "");
    }

    celdaBoton.appendChild(botonAddToList);
    fila.appendChild(celdaCod);
    fila.appendChild(celdaNom);
    fila.appendChild(celdaCant);
    fila.appendChild(celdaStock);
    fila.appendChild(celdaBoton);
    //console.log(esEscaner);
    if(esEscaner && cod==inputCodigo){
        if(stock>0){
            addToCheckoutList(fila, cod);
            esEscaner = false;
        }
    } else{
        document.getElementById("tablaLista").appendChild(fila);
    }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*
Elimina uno de los productos de la lista
*/
function borrarFila(fila, cod) {
    arrCodigoEnLista.splice(arrCodigoEnLista.indexOf(cod), 1);
    fila.remove();
    Cargar();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function addToCheckoutList(fila, cod) {
    //console.log("Add to checkout list"+event.target);
    arrCodigoEnLista.push(cod);
    var checkoutTabla = document.getElementById("listaCheckout");
    fila.children[2].setAttribute("value", fila.children[2].getAttribute("stock"));
    fila.children[2].textContent = fila.children[2].getAttribute("stock");
    fila.removeChild(fila.children[4]);
    fila.removeChild(fila.children[3]);

    var inputCantidad = document.createElement("input");
    inputCantidad.setAttribute("type", "number");
    inputCantidad.setAttribute("id", "inputCantidad"+cod);
    inputCantidad.addEventListener("focusin", function(event){
        event.target.classList.remove("mensajeError");
    })
    var cantidadMaxima = fila.getElementsByClassName("claseCantidad")[0].textContent;
    var cantidadMinima;
    if (cantidadMaxima == 0) {
        cantidadMinima = 0;
    } else {
        cantidadMinima = 1;
    }
    inputCantidad.setAttribute("min", cantidadMinima);
    inputCantidad.setAttribute("value", cantidadMinima);
    inputCantidad.setAttribute("max", cantidadMaxima);
    var fecha = new Date();
    var hoy = fecha.toISOString().split('T')[0];
    var celdaFechaPrestada = crearCelda(hoy);
    celdaFechaPrestada.setAttribute("id", "fechaPrestada");
    celdaFechaPrestada.setAttribute("value", hoy);
    var inputComentarios = document.createElement("input");
    inputComentarios.setAttribute("type", "text");
    inputComentarios.setAttribute("id", "comentarios");
    var celdaComentarios = document.createElement("td");
    celdaComentarios.appendChild(inputComentarios);
    var celdaMalEstado = crearCelda(fila.children[2].getAttribute("malEstado"));


    fila.appendChild(celdaFechaPrestada);
    fila.appendChild(celdaComentarios);

    var botonBorrar = document.createElement("button");
    botonBorrar.textContent = "Eliminar";
    botonBorrar.classList.add("botonBorrar");
    botonBorrar.addEventListener("click", function () {
        borrarFila(fila, cod);
    });
    var celdaCantidad = document.createElement("td");
    celdaCantidad.appendChild(inputCantidad);
    var celdaBorrar = document.createElement("td");
    celdaBorrar.appendChild(botonBorrar);

    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaBorrar);
    fila.appendChild(celdaMalEstado);
    checkoutTabla.appendChild(fila);

    if (document.getElementById("tablaLista").childElementCount == 1) {
        document.getElementById("codigo").value = "";
    }
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/*
Función que crea una celda para la tabla.
*/
function crearCelda(data) {
    var celda = document.createElement("td");
    celda.innerHTML = data;
    return celda;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function useBarcodeReader(){
    if(isScannerActive){

        let lastInputTime = 0;
        const inputThreshold = 250; // Adjust this value based on your needs (milliseconds).
        let scannedData = "";
        var timeout = null;
        document.addEventListener("keydown", function (event) {
            const currentTime = new Date().getTime();
            //console.log(event);
            // if (lastInputTime == 0) {
            //     lastInputTime = currentTime;
            // }
            const timeElapsed = currentTime - lastInputTime;
            lastInputTime = currentTime;
            
            if (timeElapsed <= inputThreshold) {
                // Input was very fast, possibly from a barcode scanner.
                if (isScannerActive) {
                        if (event.key === caracterControl && (scannedData == "" || scannedData.length == 0)) {
                            document.body.style.cursor = "wait";
                            timeout = setTimeout(()=>{
                                processScannedData(scannedData)
                            }, 250);
                        } else {
                            scannedData += event.key;
                            clearTimeout(timeout);
                            timeout = setTimeout(()=>{
                                processScannedData(scannedData);
                                scannedData = "";
                            }, 250);
                        }
                } else {
                    // Input was not fast enough; reset the scanned data.
                    scannedData = "";
                }
            }
        });
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
async function processScannedData(data) {
    data = data.replaceAll("Shift", "");
    data = data.replaceAll("Control", "");
    data = data.replaceAll("Tab", "");
    data = data.replaceAll("Enter", "");
    console.log("Full Dattttttttttttttttta: "+data)
    var datos = data.split(caracterControl+caracterControl);

    for(var i=0;i<datos.length;i++){
        var dato = datos[i].replaceAll(caracterControl, "");
        console.log("processData: "+dato);
        if(!arrCodigoEnLista.includes(dato)){
            esEscaner = true;
            Cargar(dato);
            await sleep(100);
            esEscaner = false;
        } else{
            var stock = parseInt(document.getElementById("cant"+dato).textContent);   
            var cantidad = document.getElementById("inputCantidad"+dato).value;   
            if(cantidad<stock){
                document.getElementById("inputCantidad"+dato).value ++;
            }    
        }
        document.body.style.cursor = "default";
        window.scrollTo(0,0);
    }
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function disableScannerForDuration(durationMs) {
    isScannerActive = false;

    setTimeout(() => {
        isScannerActive = true;
        scannedData = ""; // Optionally clear the scanned data after the timeout.
    }, durationMs);
}


/*--------------------------------------------------------------------------------------------------------------------------------*/
const config = { fps: 10, qrbox: {height:450, width:450} };
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    var inputCodigo = document.getElementById("codigo");
    inputCodigo.value = decodedText;
    inputCodigo.innerHTML = decodedText;
    Cargar();
    stopButton();
};


function startButton(){
  document.getElementById("overlayCamara").style.display='block';
  scanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
}


function stopButton(){
  scanner.stop().then((ignore) => {
    // QR Code scanning is stopped.
    document.getElementById("overlayCamara").style.display='none';
  }).catch((err) => {
    // Stop failed, handle it.
  });
}