window.addEventListener("load", start);

var elementosPorPagina, totalPaginas, currentPagina;

function start() {
    getDatosBotones();
    crearTablaProd();
    //crearBotones();
    document
        .getElementById("checkbox")
        .addEventListener("change", function (event) {
            if (event) {
                //crearBotones();
                rellenarCategorias();
            }
        });
    rellenarCategorias();
}

function getDatosBotones(){
    elementosPorPagina = parseInt(localStorage.getItem("cantidad"));
    if(currentPagina == null || currentPagina == ""){
        currentPagina = 0;
    }
    getNumeroProductos().then((result) => {
        totalPaginas = Math.ceil(result / elementosPorPagina);
        tratarBotones();
        console.log(totalPaginas);
        textoBotones(currentPagina);
    });
}

function descargarCSV() {
    $.ajax({
        method: "POST",
        url: "funciones/FGestionProductos.php",
        data: { functionName: "descargarCSV" },
    }).done(function (response) {
        let CSV = "data:text/csv;charset=utf-8,";
        CSV +=
            "Código" +
            "," +
            "Producto" +
            "," +
            "Nombre" +
            "," +
            "fechaCompra" +
            "," +
            "precioCompra" +
            "," +
            "Categoría" +
            "," +
            "Cantidad" +
            "," +
            "\r\n";
        var result = JSON.parse(response);
        var arr = Array.from(result);
        arr.forEach(function (element) {
            CSV +=
                element.codigo +
                "," +
                element.producto +
                "," +
                element.nombre +
                "," +
                element.fechaCompra +
                "," +
                element.precioCompra +
                "," +
                element.categoria +
                "," +
                element.cantidad +
                "," +
                "\r\n";
        });
        var encodedUri = encodeURI(CSV);
        window.open(encodedUri);
    });
}

function rellenarCategorias() {
    document.getElementById("selectCategoria").innerHTML = "<option></option>";

    var checkbox = document.getElementById("checkbox");
    var ckb = "FALSE";
    if (checkbox.checked == true) {
        ckb = "TRUE";
    }
    $.ajax({
        method: "POST",
        url: "funciones/FGestionProductos.php",
        data: { functionName: "getCategorias", ckb: ckb },
    }).done(function (response) {
        const result = JSON.parse(response);
        const select = document.querySelector("#selectCategoria");
        const categorias = Array.from(result);
        categorias.forEach(function (element) {
            var option = document.createElement("option");
            option.setAttribute("value", element.categoria);
            option.textContent = element.categoria;
            select.appendChild(option);
        });
    });
}

function limpiarTabla() {
    var tabla = document.getElementById("contenedorTabla");
    tabla.innerHTML = "";
}

function getNumeroProductos() {
    var checkbox = document.getElementById("checkbox");
    var ck = "FALSE";
    if(checkbox.checked == true){
        ck = "TRUE";
    }
    var categoria = document.getElementById("selectCategoria").value;
    return new Promise(function (resolve, reject) {
        const ajaxResult = $.ajax({
            method: "POST",
            url: "funciones/FGestionProductos.php",
            data: { functionName: "getNumeroProductos", activo: ck, categoria:categoria},
        })
            .done(function (response) {
                console.log("getNumeroProducto success  "+response);
                resolve(response);
            })
            .fail(function (response) {
                reject("No se ha podido obtener el número de elementos");
            })
    });
}

function crearTablaProd(offset = 0) {
    limpiarTabla();
    var tablaProd = document.getElementById("contenedorTabla");
    tablaProd.replaceChildren();
    tablaProd.innerHTML += `<table class='table' id='tablaProductosIndex'>
    <tr class='cabecera' id="cabeceraListaProductosIndex" style='background-color:${localStorage.getItem(
        "colorCabeceras"
    )}; color:${localStorage.getItem("colorLetraCabecera")}'>
        <th>Código</th>
        <th>Nombre</th>
        <th>Categoría</th>
        <th>Subcategoría</th>
        <th id='cantidadNoOrdena'>Cantidad</th>
    </tr>`;
    getProductos(offset);
}

function getProductos(offset = 0) {
    var checkbox = document.getElementById("checkbox");
    var ckb = "FALSE";
    if (checkbox.checked == true) {
        ckb = "TRUE";
    }
    var categoria = document.getElementById("selectCategoria").value;
    console.log(categoria);
    $.ajax({
        method: "POST",
        url: "funciones/FGestionProductos.php",
        data: {
            functionName: "getProductos",
            offset: offset,
            ckb: ckb,
            elementosPorPagina: elementosPorPagina,
            categoria:categoria
        },
    }).done(function (response) {
        const arr = Array.from(JSON.parse(response));
        arr.forEach((element) => {
            crearFila(
                element.codigo,
                element.subcategoria,
                element.nombre,
                element.categoria,
                element.cantidad
            );
        });
    });
    getDatosBotones();
}

function crearBotones() {
    document.getElementById("contenedorBotones").replaceChildren();
    var checkbox = document.getElementById("checkbox");
    var ck = "FALSE";
    if (checkbox.checked == true) {
        ck = "TRUE";
    }
    var productos;
    getNumeroProductos(ck).then(function (result) {
        productos = result;
        productos = Math.ceil(productos / elementosPorPagina);
        for (var i = 0; i < productos; i++) {
            var boton = document.createElement("button");
            boton.classList.add("botonNumero");
            boton.textContent = i + 1;
            document.getElementById("contenedorBotones").appendChild(boton);
        }
        var botones = document.getElementsByClassName("botonNumero");
        for (var i = 0; i < botones.length; i++) {
            (function (index) {
                botones[index].addEventListener("click", function () {
                    //limpiarTabla();
                    crearTablaProd(index * elementosPorPagina);
                });
            })(i);
        }
    });
}

function crearFila(cod, prod, nom, cat, cant) {
    var fila = document.createElement("tr");
    fila.setAttribute("id", cod);
    fila.classList.add("fila");

    //Celdas con la información del usuario

    var celdaCod = crearCelda(cod);
    var celdaprod = crearCelda(prod);
    var celdaNom = crearCelda(nom);
    var celdaCat = crearCelda(cat);
    var celdaCant = crearCelda(cant);

    //Añadimos las celdas a la fila
    fila.appendChild(celdaCod);
    fila.appendChild(celdaNom);
    fila.appendChild(celdaCat);
    fila.appendChild(celdaprod);
    fila.appendChild(celdaCant);

    document.getElementById("tablaProductosIndex").appendChild(fila);
}

//Función que crea las celdas para las filas de la tabla de usuarios
function crearCelda(data) {
    var celda = document.createElement("td");
    celda.innerHTML = data;
    return celda;
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
        crearTablaProd();
        tratarBotones();
        textoBotones(currentPagina);
    }
}

function anteriorPagina() {
    var offset = elementosPorPagina * (currentPagina - 1);
    if (currentPagina > 0) {
        currentPagina--;
        crearTablaProd(offset);
        tratarBotones();
        textoBotones(currentPagina);
    }
}

function siguientePagina() {
    var offset = elementosPorPagina * (currentPagina + 1);
    if (currentPagina < totalPaginas-1) {
        currentPagina++;
        crearTablaProd(offset);
        tratarBotones();
        textoBotones(currentPagina);
    }
}

function ultimaPagina() {
    var offset = elementosPorPagina * (totalPaginas - 1);
    currentPagina = totalPaginas-1;
    crearTablaProd(offset);
    tratarBotones();
    textoBotones(currentPagina);
}


