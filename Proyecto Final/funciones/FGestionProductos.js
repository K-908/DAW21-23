window.addEventListener("load", start);
var scanner;
var elementosPorPagina, totalPaginas, currentPagina;
var control = false;

function start() {
  getDatosBotones();
  //scanner = new Html5Qrcode("qr-reader");
  elementosPorPagina = parseInt(localStorage.getItem("cantidad"));
  crearFormProd();
  getProductos();
  document
    .getElementById("inputBuscarProducto")
    .addEventListener("keyup", function () {
      control = true;
      getDatosBotones();
      getProductos();
      //crearBotones();
    });

  if ("ontouchstart" in window || navigator.maxTouchPoints) {
    // Touch events supported, likely a mobile device
    console.log("Mobile device detected");
  } else {
    // No touch events supported, likely a computer
    document.getElementById("contenedorCamara").replaceChildren();
    console.log("Computer detected");
  }

  document
    .getElementById("inputBuscarProducto")
    .addEventListener("keydown", function (event) {
      if (event.key == "Enter") {
        event.preventDefault();
      }
    });
  useBarcodeReader();
  //listenersOrdenarTabla("tablaProductos");
  document
    .getElementById("checkbox")
    .addEventListener("change", function (event) {
      if (event) {
        control = true;
        getDatosBotones();
        getProductos();
      }
    });
  //addContenedorCamara();
  //document.getElementById("cantidadNoOrdena").outerHTML = document.getElementById("cantidadNoOrdena").outerHTML;
  //document.getElementById("malEstadoNoOrdena").outerHTML = document.getElementById("malEstadoNoOrdena").outerHTML;
}

function getDatosBotones(){
  elementosPorPagina = parseInt(localStorage.getItem("cantidad"));
  if(currentPagina == null || currentPagina == "" || control){
      currentPagina = 0;
      control = false;
  }
  getNumeroProductos().then((result) => {
      totalPaginas = Math.ceil(result / elementosPorPagina);
      tratarBotones();
      textoBotones(currentPagina);
      console.log("CURRENT PÁGINAS "+currentPagina);
      console.log("TOTAL PÁGINAS "+totalPaginas);
  });
}

function getCategorias(){
    $.ajax({
      method: "POST",
      url: "funciones/FGestionProductos.php",
      data: {functionName : "getCategorias", ckb:"null"},
    }).done(function (response) {
      var result = JSON.parse(response);
      var inputCat = document.getElementById("inputCategoriaDatalist");
      var arr = Array.from(result);
      console.log(arr);
      arr.forEach((element)=>{
        var opt = document.createElement("option");
        opt.innerHTML = element.categoria;
        opt.value = element.categoria;
        inputCat.appendChild(opt);
      })
    })
}

function crearFormProd() {
  var contenedorFormulario = document.getElementById(
    "contenedorFormularioRegistroProducto"
  );
  //Añadimos el HTML del formulario para registrar usuarios en gestionUsuarios.html
  contenedorFormulario.innerHTML = `
                        <form name="formularioAlta" id="formularioAltaProducto">
                            <div class="divInputFormAltaProducto">
                                <label class="form-label" for="form3Example1cg">Código</label>
                                <input type="text" id="inputCodigo" name="codigo" required/>
                            </div>

                            <div class="divInputFormAltaProducto">
                                <label class="form-label" for="form3Example3cg">Nombre</label>
                                <input type="text" name="nombre" id="inputNombre" required/>
                            </div>

                            <div class="divInputFormAltaProducto">
                                <label class="form-label" for="form3Example4cdg">Categoría</label>
                                <input id="inputCat" type="text" list="inputCategoriaDatalist"/>
                                <datalist id="inputCategoriaDatalist"></datalist>
                            </div>

                            <div class="divInputFormAltaProducto">
                                <label class="form-label" for="form3Example4cg">Subcategoría</label>
                                <input type="text" id="inputSubCategoria" name="producto" list="inputSubCategoriaDatalist" required />
                                <datalist id="inputSubCategoriaDatalist"></datalist>
                            </div>

                            <div class="divInputFormAltaProducto">
                              <label class="form-label" for="form3Example4cg">Fecha de compra</label>
                              <input type="date" id="inputFechaCompra" name="fechaCompra"required />
                            </div>

                            <div class="divInputFormAltaProducto">
                                <label class="form-label" for="form3Example4cg">Precio de compra</label>
                                <input type="number" placeholder="1.0" step="0.01" id="inputPrecio" name="producto"required />
                            </div>

                            <div class="inputNumeroDeSerie">
                              <label for="numeroDeSerie">Número de serie</label>
                              <input type="text" id="numeroDeSerie" name="numeroDeSerie"></input>
                            </div>

                          <div class="divInputFormAltaProducto">
                                <label class="form-label" for="form3Example4cdg">Cantidad</label>
                                <input type="number" min="0" value="0" name="cantidad" id="inputCant"required />
                            </div>
                            <div id="divInfoAdicional"></div>
                            </form>
                            <div id="botonesFormulario">
                                <button onClick='addInput()' class='botonFormulario' id="anadirColumna">Añadir columna</button>
                                <button class="botonFormulario" id="añadirProd" onclick="crearProducto()">Guardar producto nuevo</button>
                            </div>
`;
getCategorias();
getSubCategorias();
}



function getSubCategorias(){
  $.ajax({
    method: "POST",
    url: "funciones/FGestionProductos.php",
    data: {functionName : "getSubCategorias"},
  }).done(function (response) {
    var result = JSON.parse(response);
    var inputSubCat = document.getElementById("inputSubCategoriaDatalist");
    var arr = Array.from(result);
    console.log(arr);
    arr.forEach((element)=>{
      console.log(element.subcategoria);
      var opt = document.createElement("option");
      opt.innerHTML = element.subcategoria;
      opt.value = element.subcategoria;
      inputSubCat.appendChild(opt);
    })
  });
}


function addInput() {

  var container = document.getElementById("divInfoAdicional");
  var textoLabel = prompt("Nombre de la nueva columna");
  if (textoLabel.trim() === "") {
    return;
  }
  var nuevoLabel = document.createElement("label");
  nuevoLabel.textContent = textoLabel;
  var nuevaColumna = document.createElement("input");
  nuevaColumna.setAttribute("type", "text");
  nuevaColumna.setAttribute("required", "");
  nuevaColumna.classList.add("nuevoInput")
  container.appendChild(nuevoLabel);
  container.appendChild(nuevaColumna);
}

function crearCabeceraTabla() {
  var tablaProd = document.getElementById("contenedorTabla");
  tablaProd.replaceChildren();
  tablaProd.innerHTML += `<table id='tablaProductos'>
        <tr class='cabecera' id='cabeceraTablaProductos' style='background-color:${localStorage.getItem(
          "colorCabeceras"
        )}; color:${localStorage.getItem("colorLetraCabecera")}'>
        <th><p>Código</p></th>
        <th><p>Nombre</p></th>
        <th><p>Categoría</p></th>
        <th><p>Subcategoría</p></th>
        <th id='cantidadNoOrdena'><p>Cantidad</p></th>
        <th><p>Stock</p></th>
        <th id='malEstadoNoOrdena'><p>Mal estado</p></th>
        <th><p>Modificar cantidad</p></th>
        <th ><p id="cabeceraDeshabilitar">Deshabilitar</p></th>
    </tr>`;
}

function getProductos(offset = 0) {
  limpiarTabla();
  crearCabeceraTabla();
  var cod = document.getElementById("inputBuscarProducto").value;
  var checkbox = document.getElementById("checkbox");
  var ckb = "FALSE";
  if (checkbox.checked == true) {
    ckb = "TRUE";
  }
  $.ajax({
    method: "POST",
    url: "funciones/FGestionProductos.php",
    data: {
      functionName: "getProductos",
      offset: offset,
      cod: cod,
      ckb: ckb,
      elementosPorPagina: elementosPorPagina,
    },
  }).done(function (response) {
    const arr = Array.from(JSON.parse(response));
    arr.forEach((element) => {
      crearFila(
        element.codigo,
        element.subcategoria,
        element.nombre,
        element.categoria,
        element.cantidad,
        element.stockDisponible,
        element.malEstado
      );
    });
  });
}

function limpiarTabla() {
  var tabla = document.getElementById("contenedorTabla");
  tabla.replaceChildren();
}

function getNumeroProductos() {
  var checkbox = document.getElementById("checkbox");
    var ck = "FALSE";
    if(checkbox.checked == true){
        ck = "TRUE";
    }
  var cod = document.getElementById("inputBuscarProducto").value;
  return new Promise(function (resolve, reject) {
    $.ajax({
      method: "POST",
      url: "funciones/FGestionProductos.php",
      data: { functionName: "getNumeroProductos", activo: ck, cod: cod },
    })
      .done(function (response) {
        resolve(response);
      })
      .fail(function (error) {
        reject(error);
      });
  });
}

//Función que crea las filas para la tabla de usuarios
function crearFila(cod, prod, nom, cat, cant, stock, mal) {
  var fila = document.createElement("tr");
  fila.setAttribute("id", cod);
  fila.classList.add("fila");

  //Celdas con la información del usuario
  var celdaCod = document.createElement("td");
  var enlaceCod = document.createElement("a");
  enlaceCod.setAttribute("href", "detallesProducto.html?codigo=" + cod);
  enlaceCod.classList.add("linkProducto");
  enlaceCod.textContent = cod;
  celdaCod.appendChild(enlaceCod);

  var celdaprod = crearCelda(prod);
  var celdaNom = crearCelda(nom);
  var celdaCat = crearCelda(cat);

  var celdaCant = document.createElement("td");

  var inputCant = document.createElement("input");
  inputCant.setAttribute("type", "number");
  inputCant.setAttribute("min", "0");
  inputCant.setAttribute("name", "cant");
  inputCant.setAttribute("id", "cant" + cod);
  inputCant.setAttribute("value", cant);

  var celdaStock = crearCelda(stock);

  var celdaMal = document.createElement("td");
  var inputMal = document.createElement("input");
  inputMal.setAttribute("type", "number");
  inputMal.setAttribute("id", "mal" + cod);
  inputMal.setAttribute("name", "mal");
  inputMal.setAttribute("value", mal);

  //Agregar a las celdas los inputs
  celdaMal.appendChild(inputMal);

  //Botón borrar y asignamos la función "borrarProducto()"
  celdaCant.appendChild(inputCant);
  var botonBorrar = document.createElement("button");
  var celdaBorrar = document.createElement("td");
  //botonBorrar.textContent = "Deshabilitar";
  botonBorrar.setAttribute("class", "botonDeshabilitar")
  botonBorrar.addEventListener("click", function () {
    borrarProducto(cod);
  });
  celdaBorrar.appendChild(botonBorrar);

  //Botón para modificar cantidad del producto
  var botonModificar = document.createElement("button");
  var celdaModificar = document.createElement("td");
  botonModificar.textContent = "Modificar";
  botonModificar.setAttribute("class", "botonModificar")
  botonModificar.addEventListener("click", function () {
    modificarCantidad("cant" + cod, "mal" + cod, cod);
  });
  celdaModificar.appendChild(botonModificar);

  //Cambios si el checkbox "Mostrar deshabilitados" está marcado:
  var check = document.getElementById("checkbox");
  if (check.checked == true) {
    botonBorrar.classList.remove("botonDeshabilitar");
    botonBorrar.classList.add("botonHabilitar");
    botonModificar.setAttribute("disabled", "");
    inputMal.setAttribute("disabled", "");
    inputCant.setAttribute("disabled", "");
    document.getElementById("cabeceraDeshabilitar").textContent = "Habilitar";
  } else {
    document.getElementById("cabeceraDeshabilitar").textContent =
      "Deshabilitar";
  }

  //Añadimos las celdas a la fila
  fila.appendChild(celdaCod);
  fila.appendChild(celdaNom);
  fila.appendChild(celdaCat);
  fila.appendChild(celdaprod);
  fila.appendChild(celdaCant);
  fila.appendChild(celdaStock);
  fila.appendChild(celdaMal);
  fila.appendChild(celdaModificar);
  fila.appendChild(celdaBorrar);

  document.getElementById("tablaProductos").appendChild(fila);
}

//Función que crea las celdas para las filas de la tabla de usuarios
function crearCelda(data) {
  var celda = document.createElement("td");
  celda.innerHTML = data;
  return celda;
}

function getInfoAdicional() {
  var infoAdicional = document.getElementById("divInfoAdicional").children;
  console.log(infoAdicional);
  var textoInfoAdicional = "";
  for (var i = 0; i < infoAdicional.length; i++) {
    if (i % 2 == 0) {
      textoInfoAdicional += infoAdicional[i].innerHTML + ":";
    } else {
      textoInfoAdicional += infoAdicional[i].value + ",";
    }
    console.log(textoInfoAdicional);
  }

  return textoInfoAdicional;
}

function crearProducto() {
  var infoAdicional = getInfoAdicional();
  var vcodigo = $("#inputCodigo").val();
  var vsubcategoria = $("#inputSubCategoria").val();
  var vnombre = $("#inputNombre").val();
  var vFechaCompra = $("#inputFechaCompra").val();
  var vPrecio = $("#inputPrecio").val();
  var vcategoria = $("#inputCat").val();
  var vNumeroDeSerie = $("#numeroDeSerie").val();
  var vcantidad = $("#inputCant").val();

  $.ajax({
    method: "POST",
    url: "funciones/FGestionProductos.php",
    data: {
      functionName: "crearProducto",
      codigo: vcodigo,
      subcategoria: vsubcategoria,
      nombre: vnombre,
      fechaCompra:vFechaCompra,
      precioCompra:vPrecio,
      categoria: vcategoria,
      cantidad: vcantidad,
      numeroDeSerie: vNumeroDeSerie,
      infoAdicional: infoAdicional
    },
  }).done(function (response) {
    alert(response);
    location.reload();
  });
}

//Función para borrar productos de la base de datos.
//Se lanza cuando se hace click en el botón "Borrar" de la tabla
//Dependiendo de si está marcada la casilla de mostrar productos deshabilitados
//habilitará o deshabilitará el producto.
function borrarProducto(cod) {
  var check = document.getElementById("checkbox");
  //Deshabilitar producto

  if (check.checked == false) {
    var confirmar = confirm("¿Quieres deshabilitar el producto?");
    if(!confirmar){
      return;
    }
    $.ajax({
      method: "POST",
      url: "funciones/FBorrarModProd.php",
      data: { functionName: "borrarProd", codigo: cod },
    }).done(function (response) {
      alert(response);
      location.reload();
    });
  } else {
    //Habilitar producto
    var confirmar = confirm("¿Quieres habilitar el producto?");
    if(!confirmar){
      return;
    }
    $.ajax({
      method: "POST",
      url: "funciones/FBorrarModProd.php",
      data: { functionName: "rehabilitarProducto", codigo: cod },
    }).done(function (response) {
      alert(response);
      location.reload();
    });
  }
}

//Función para modificar usuarios de la base de datos.
//Se lanza cuando se hace click en el botón de "Modificar usuario" del formulario
function modificarCantidad(cant, mal, cod) {
  var cantidad = document.getElementById(cant).value;
  var malEstado = document.getElementById(mal).value;
  if (cantidad < 1) {
    alert("Si hay menos de 1 producto, ha de ser deshabilitado");
    return;
  }
  if (malEstado < 0) {
    alert("Mal estado no puede tener un valor negativo.");
    return;
  } else if (malEstado > cantidad) {
    alert(
      "No puede haber más productos en mal estado que productos disponibles."
    );
    return;
  }
  $.ajax({
    method: "POST",
    url: "funciones/FBorrarModProd.php",
    data: {
      functionName: "modificarProd",
      codigo: cod,
      cantidad: cantidad,
      malEstado: malEstado,
    },
  }).done(function (response) {
    alert(response);
    //location.reload();
  });
}

let isScannerActive = true;
function useBarcodeReader() {
  if (isScannerActive) {
    var caracterControlCodigos = localStorage.getItem("caracterControlCodigos");
    let lastInputTime = 0;
    const inputThreshold = 100; // Adjust this value based on your needs (milliseconds).
    let scannedData = "";
    document.addEventListener("keydown", function (event) {
      const currentTime = new Date().getTime();

      if (lastInputTime == 0) {
        lastInputTime = currentTime;
      }
      const timeElapsed = currentTime - lastInputTime;
      lastInputTime = currentTime;

      if (timeElapsed <= inputThreshold) {
        // Input was very fast, possibly from a barcode scanner.
        if (isScannerActive) {
          if (event.key == caracterControlCodigos) {
            // % was pressed, indicating the start or end of the barcode.
            if (scannedData.length > 0) {
              //disableScannerForDuration(2000);
              scannedData = scannedData.replaceAll("Shift", "");
              scannedData = scannedData.replaceAll("Control", "");
              scannedData = scannedData.replaceAll("Tab", "");
              scannedData = scannedData.replaceAll(caracterControlCodigos, "");
              //scannedData = scannedData.replaceAll("Backspace", "");
              processScannedData(scannedData);
            }
            scannedData = ""; // Reset the scanned data.
          } else {
            scannedData += event.key;
          }
        } else {
          // Input was not fast enough; reset the scanned data.
          scannedData = "";
        }
      }
    });
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function processScannedData(data) {
  var inputBuscarProducto = document.getElementById("inputBuscarProducto");
  var inputCodigo = document.getElementById("inputCodigo");
  inputBuscarProducto.value = data;
  inputCodigo.value = data;
  getProductos();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function disableScannerForDuration(durationMs) {
  isScannerActive = false;

  setTimeout(() => {
    isScannerActive = true;
    scannedData = ""; // Optionally clear the scanned data after the timeout.
  }, durationMs);
}

/*Código para leer códigos de barras con el móvil*/
/*----------------------------------------------------------------------------------------------------------*/

const config = { fps: 10, qrbox: { height: 450, width: 450 } };
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  var inputBuscarProducto = document.getElementById("inputBuscarProducto");
  var inputCodigo = document.getElementById("inputCodigo");
  inputBuscarProducto.value = decodedText;
  inputCodigo.value = decodedText;
  getProductos();
  stopButton();
};

function startButton() {
  document.getElementById("overlayCamara").style.display = "block";
  scanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
}

function stopButton() {
  scanner
    .stop()
    .then((ignore) => {
      // QR Code scanning is stopped.
      document.getElementById("overlayCamara").style.display = "none";
    })
    .catch((err) => {
      // Stop failed, handle it.
    });
}

function textoBotones(x){
  document.getElementById("textoBotones").textContent = `Página ${x+1} de ${totalPaginas}`;
}

function tratarBotones() {
  var botonPrimera = document.getElementById("botonPrimera");
  var botonAnterior = document.getElementById("botonAnterior");
  var botonSiguiente = document.getElementById("botonSiguiente");
  var botonUltima = document.getElementById("botonUltima");

  botonPrimera.classList.remove("botonPaginasActivo");
  botonPrimera.classList.remove("botonPaginasInactivo");
  botonAnterior.classList.remove("botonPaginasActivo");
  botonAnterior.classList.remove("botonPaginasInactivo");
  botonSiguiente.classList.remove("botonPaginasActivo");
  botonSiguiente.classList.remove("botonPaginasInactivo");
  botonUltima.classList.remove("botonPaginasActivo");
  botonUltima.classList.remove("botonPaginasInactivo");

  if(currentPagina == 0 && totalPaginas > 1){
      botonPrimera.classList.add("botonPaginasInactivo");
      botonAnterior.classList.add("botonPaginasInactivo");
      botonSiguiente.classList.add("botonPaginasActivo");
      botonUltima.classList.add("botonPaginasActivo");
  }else if(currentPagina == 0 && totalPaginas-1 == 0){
    botonPrimera.classList.add("botonPaginasInactivo");
    botonAnterior.classList.add("botonPaginasInactivo");
    botonSiguiente.classList.add("botonPaginasInactivo");
    botonUltima.classList.add("botonPaginasInactivo"); 
  }else if(currentPagina > 0 && currentPagina < totalPaginas-1){
      botonPrimera.classList.add("botonPaginasActivo");
      botonAnterior.classList.add("botonPaginasActivo");
      botonSiguiente.classList.add("botonPaginasActivo");
      botonUltima.classList.add("botonPaginasActivo");
  } else if(currentPagina >= totalPaginas-1){
      botonPrimera.classList.add("botonPaginasActivo");
      botonAnterior.classList.add("botonPaginasActivo");
      botonSiguiente.classList.add("botonPaginasInactivo");
      botonUltima.classList.add("botonPaginasInactivo");
  }
}

function primeraPagina() {
  if (currentPagina > 0) {
      currentPagina = 0;
      getProductos();
      tratarBotones();
      textoBotones(currentPagina);
  }
}

function anteriorPagina() {
  var offset = elementosPorPagina * (currentPagina - 1);
  if (currentPagina > 0) {
      currentPagina--;
      getProductos(offset);
      tratarBotones();
      textoBotones(currentPagina);
  }
}

function siguientePagina() {
  var offset = elementosPorPagina * (currentPagina + 1);
  if (currentPagina < totalPaginas-1) {
      currentPagina++;
      getProductos(offset);
      tratarBotones();
      textoBotones(currentPagina);
  }
}

function ultimaPagina() {
  var offset = elementosPorPagina * (totalPaginas - 1);
  currentPagina = totalPaginas-1;
  getProductos(offset);
  tratarBotones();
  textoBotones(currentPagina);
}