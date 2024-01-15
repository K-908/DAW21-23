window.addEventListener("load", (event)=>{
    cargarTabla();
    poblarUsuarios();
    setTimeout(()=>{
        establecerColores();
    }, 100);
});
function cargarTabla(){
        $.ajax({
            method: "POST",
            url: "funciones/FDevoluciones.php",
            data: {functionName : "listarEncargos"}
        })
        .done(function(response){
            var resultado = JSON.parse(response);
            if (resultado != null) {
                const arr = Array.from(resultado);
                arr.forEach(element => {
                    crearTabla(element.IDencargo, element.Evento);
                    crearSubCabecera(element.IDencargo);
                    subQuery(element.IDencargo, element.Evento);
                });
            }
        })
}

function filtrarTablas(){
    console.log("filtrando tablas");
    var formCorreo = document.getElementById("inputCorreo");
    var formFecha = document.getElementById("inputFechaHTML");
    var formProducto = document.getElementById("inputProducto");
    console.log("Form Correo: "+formCorreo.value);
    console.log("Form Fecha: "+formFecha.value)
    var listaTablas = document.getElementById("contenedorEncargos").children;
    for(var i=0;i<listaTablas.length;i++){
        var datos = listaTablas[i].getAttribute("id").split("/");
        var productos = listaTablas[i].getElementsByClassName("celdaProducto");
        var listaProductos = [];
        for(var j=0;j<productos.length;j++){
            listaProductos.push(productos[j].innerHTML);
        }
        if((formCorreo.value == "" || formCorreo.value == datos[1]) && (formFecha.value == "" ||formFecha.value == datos[0]) && (formProducto.value == "" || checkProducto(listaProductos, formProducto.value))){
            listaTablas[i].style.display = "table";
        } else{
            listaTablas[i].style.display = "none";
        }
    }
}
function checkProducto(arr, input){
    for(var i=0;i<arr.length;i++){
        if(arr[i].toLowerCase().match(input.toLowerCase())){
            return true;
        }
    }
    return false;
}
function borrarDatos(){
    var formCorreo = document.getElementById("inputCorreo");
    var formFecha = document.getElementById("inputFechaHTML");
    var formProducto = document.getElementById("inputProducto");
    formCorreo.value = "";
    formFecha.value = "";
    formProducto.value = "";
    filtrarTablas();
}
function poblarUsuarios(){
    var inputCorreo = document.getElementById("inputCorreo");
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
                inputCorreo.appendChild(option);
            });
        }
    })
}

function subQuery(IDEncargo){
    $.ajax({
        method: "POST",
        url: "funciones/FDevoluciones.php",
        data: {functionName : "listarIds", IDencargo:IDEncargo}
    }).done(function(response){
        var resultado = JSON.parse(response);
        const arr = Array.from(resultado);
        arr.forEach((element)=>{
            $.ajax({
                method: "POST",
                url: "funciones/FDevoluciones.php",
                data: {functionName : "buscarEncargo", IDPrestamo:element.IDPrestamo}
            })
            .done(function(response){
                var resultado = JSON.parse(response);
                if(resultado!=null){
                    const arr = Array.from(resultado);
                    if(arr.length>0){
                        arr.forEach((element)=>{     
                            if(element.fechaDevolucion == null){
                                crearFila(IDEncargo, element.CorreoUser, element.fechaPrestada, element.fechaPrevistaDevolucion, element.nombre, element.cantidad, element.IDPrestamo)
                            }
                        })
                    }else{
                        var tabla = document.getElementById(IDEncargo);
                        //tabla.remove();
                    }
                }
            })

        })
    })
    crearBoton(IDEncargo);
}

function crearBoton(IDEncargo){
    var celdaBotonesCabecera = document.createElement("th");
    celdaBotonesCabecera.classList.add("celdaBotonesCabecera");
    var botonDevolverTodo = document.createElement("button");
    botonDevolverTodo.setAttribute("id", "devolverTodo");
    botonDevolverTodo.textContent = "Devolver todo";
    botonDevolverTodo.addEventListener("click", function(){
        devolverTodo(IDEncargo)
            .then(()=>{
                location.reload();
            })
            .catch((error)=>{
                console.log(error);
                location.reload();
            })
    });

    celdaBotonesCabecera.appendChild(botonDevolverTodo);


    var botonImprimir = document.createElement("button");
    botonImprimir.textContent = "Imprimir";
    var url = "imprimir.html?codigo="+IDEncargo;
    botonImprimir.addEventListener("click", function(){
        abrirVentanaNueva(url);
    });

    celdaBotonesCabecera.appendChild(botonImprimir);

    var cabeceraTabla = document.getElementById("cabecera"+IDEncargo);
    cabeceraTabla.appendChild(celdaBotonesCabecera);

}

function abrirVentanaNueva(url){
    window.open(url, "Imprimir", "width=300, height:500");
}

function crearTabla(IDEncargo, Evento){
    var contenedorEncargos = document.getElementById("contenedorEncargos");
    var tabla = document.createElement("table");
    tabla.setAttribute("id", IDEncargo);
    var fila = document.createElement("tr");
    fila.setAttribute("id", "cabecera"+IDEncargo);
    tabla.classList.add("divTable");
    //fila.classList.add("divTableCabecera");
    fila.classList.add("primeraCabecera");
    //fila.style.backgroundColor = localStorage.getItem("colorCabeceras");
    
    var cabeceraUsuario = document.createElement("th");
    cabeceraUsuario.setAttribute("id", "usuario"+IDEncargo);
    //cabeceraUsuario.classList.add("cabecera");
    var cabeceraFechas = document.createElement("th");
    cabeceraFechas.setAttribute("id", "fechas"+IDEncargo);

    var cabeceraFechaDevolucion = document.createElement("th");
    cabeceraFechaDevolucion.setAttribute("id", "fechaDev"+IDEncargo);
    //cabeceraFechas.classList.add("cabecera");
    var cabeceraEvento = document.createElement("th");
    cabeceraEvento.setAttribute("id", "evento"+IDEncargo);
    cabeceraEvento.textContent = Evento;
    //cabeceraEvento.classList.add("cabecera");
    fila.appendChild(cabeceraUsuario);
    fila.appendChild(cabeceraFechas);
    fila.appendChild(cabeceraFechaDevolucion);
    fila.appendChild(cabeceraEvento);
    tabla.appendChild(fila);    
    contenedorEncargos.appendChild(tabla);
}
function crearSubCabecera(IDEncargo){
    var fila = document.createElement("tr");
    fila.classList.add("cabecera")
    fila.style.backgroundColor = localStorage.getItem("colorCabeceras");
    //fila.classList.add("subCabecera");
    var celdaProd = document.createElement("td");
    celdaProd.textContent = "Producto";
    var celdaCom = document.createElement("td");
    celdaCom.textContent = "Comentario";
    
    var celdaFecha = document.createElement("td");
    celdaFecha.textContent = "Fecha de devolución";
    var celdaCant = document.createElement("td");
    celdaCant.textContent = "Cantidad";
    var celdaDevolver = document.createElement("td");
    celdaDevolver.textContent = "Devolver";
    fila.appendChild(celdaProd);
    fila.appendChild(celdaCom);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaCant);
    fila.appendChild(celdaDevolver);
    document.getElementById(IDEncargo).appendChild(fila);
}
function crearFila(IDEncargo, usuario, fechaP, fechaD, prod, cant, idPres){
    var tabla = document.getElementById(IDEncargo);
    
    var cabeceraUsuario = document.getElementById("usuario"+IDEncargo);
    var cabeceraFechas = document.getElementById("fechas"+IDEncargo);
    var cabeceraFechaDevolucion = document.getElementById("fechaDev"+IDEncargo);
    cabeceraFechaDevolucion.textContent = "Fecha de devolución "+fechaD;
    cabeceraUsuario.textContent = usuario;
    cabeceraFechas.textContent = "Fecha de entrega: "+fechaP;

    
    var fila = tabla.insertRow(2);
    fila.classList.add("divTableRow");
    fila.setAttribute("idPRestamo", idPres);
    //Creamos las 4 casillas con texto de la fila
    var celdaCodProd = crearCelda(prod);
    celdaCodProd.classList.add("celdaProducto");
    
    var celdaComentario = document.createElement("td");
    var areaTexto = document.createElement("textarea");
    areaTexto.setAttribute("id", "comentario"+idPres);
    celdaComentario.appendChild(areaTexto);
    var celdaFecha = document.createElement("td");
    var inputFecha = document.createElement("input");
    inputFecha.setAttribute("type", "date");
    var fecha = new Date();
    var hoy = fecha.toISOString().split('T')[0];
    inputFecha.setAttribute("value", hoy);
    inputFecha.setAttribute("min", hoy);
    inputFecha.setAttribute("id", "fecha"+idPres);
    celdaFecha.appendChild(inputFecha);
    var celdaCant = document.createElement("td");
    var inputCant = document.createElement("input");
    inputCant.setAttribute("type", "number");
    inputCant.setAttribute("min", 0);
    inputCant.setAttribute("value", cant)
    inputCant.setAttribute("max", cant);
    inputCant.setAttribute("id", "cant"+idPres);
    celdaCant.appendChild(inputCant);
    //Creamos un botón que llamará a la función "devolver" para marcar el producto como devuelto
    var celdaDev = document.createElement("td");
    var botonDev = document.createElement("button");
    botonDev.classList.add("botonDevolver");
    botonDev.textContent = "Devolver";
    botonDev.addEventListener("click", function(){
        devolverProd(idPres);
    });
    celdaDev.appendChild(botonDev);
    fila.appendChild(celdaCodProd);
    fila.appendChild(celdaComentario);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaCant);
    fila.appendChild(celdaDev);
}
function devolverProd(idPrestamo){
    var cantidad = document.getElementById("cant"+idPrestamo).value;
    var fecha = document.getElementById("fecha"+idPrestamo).value;
    var com = document.getElementById("comentario"+idPrestamo).value;
    if(cantidad>0){
        $.ajax({
            method: "POST",
            url: "funciones/FDevoluciones.php",
            data: {functionName : "devolverProd", idprestamo:idPrestamo, cant:cantidad, fecha:fecha, comentario:com}
        })
        .done(function(response){
            alert("Producto devuelto");
            location.reload();
        })
    } else{
        alert("No puedes devolver 0 productos");
    }
    
}
function crearCelda(data){
    var celda = document.createElement("td");
    celda.innerHTML=data;
    return celda;
}


function devolverTodo(IDEncargo) {
    return new Promise(async (resolve, reject) => {
      var tabla = document.getElementById(IDEncargo);
      try {
        for (var i = 2; i < tabla.rows.length; i++) {
          var row = tabla.rows[i];
          var idPrestamo = row.getAttribute("idPrestamo");
          var cantidad = document.getElementById("cant" + idPrestamo).value;
          var fecha = document.getElementById("fecha" + idPrestamo).value;
          var com = document.getElementById("comentario" + idPrestamo).value;
  
          await $.ajax({
            method: "POST",
            url: "funciones/FDevoluciones.php",
            data: {
              functionName: "devolverProd",
              idprestamo: idPrestamo,
              cant: cantidad,
              fecha: fecha,
              comentario: com,
            },
          });
  
          console.log("Successfully processed row:", idPrestamo);
        }
  
        console.log("Fin del programa");
        resolve(); // Resolve the promise after all AJAX calls are completed
      } catch (error) {
        console.error("Error in devolverTodo:", error);
        reject(error); // Reject the promise if there's an error
      }
    });
  }
  


function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


function establecerColores(){
    var cabeceras = document.getElementsByClassName("cabecera");
    console.log("Cabeceras length: "+cabeceras.length);
    for(var i=0;i<cabeceras.length;i++){
      cabeceras[i].style.backgroundColor = localStorage.getItem("colorCabeceras");
      cabeceras[i].style.color = localStorage.getItem("colorLetraCabecera");
    }
}