window.addEventListener("load", start);

var enlace = window.location.href;
var codigo = enlace.substring(enlace.indexOf("=")+1, enlace.length);
codigo = decodeURI(codigo);


function start(){
    crearForm();
    getHistorial();
}

function crearForm(){
    return new Promise(function(resolve, reject){
        $.ajax({
            method: "POST",
            url: "funciones/FDetallesProducto.php",
            data: {functionName : "buscarProducto", codigo:codigo}
        })
        .done(function(response){
            const arr = JSON.parse(response);
            var arr2 = arr[0];
            console.log(response);
            console.log(arr2);
            crearInputs(arr2.codigo, arr2.subcategoria, arr2.nombre, arr2.categoria, arr2.cantidad, arr2.stockDisponible, arr2.malEstado, arr2.numeroDeSerie, arr2.InformacionAdicional);
        })
    })
}

function crearInputs(cod, subCat, nom, cat, cant, stock, mal, numSer, infoAdicional){
    var div =  document.getElementById("contenedorDetallesProducto");
    var form = document.createElement("form");
    form.setAttribute("id", "formularioDetallesProducto")
/*CÓDIGO*/
    var divCod = document.createElement("div");
    var labelCod =  document.createElement("label");
    labelCod.textContent = "Codigo";
    var inputCod = document.createElement("input");
    inputCod.setAttribute("type", "text");
    inputCod.setAttribute("disabled", "");
    inputCod.setAttribute("value", cod);
    inputCod.setAttribute("id", "codigo");
    inputCod.classList.add("form-control", "form-control-lg", "inputText");
    divCod.appendChild(labelCod);
    divCod.appendChild(inputCod);
/*NOMBRE*/
    var divNom = document.createElement("div");
    var labelNom = document.createElement("label");
    labelNom.textContent= "Nombre";
    labelNom.classList.add("form-label");
    var inputNom = document.createElement("input");
    inputNom.setAttribute("type", "text");
    inputNom.setAttribute("value", nom);
    inputNom.setAttribute("id", "nombre");
    divNom.appendChild(labelNom);
    divNom.appendChild(inputNom);
/*CATEGORIA*/
    var divCat = document.createElement("div");
    var labelCat = document.createElement("label");
    labelCat.textContent = "Categoría";
    var inputCat = document.createElement("input");
    inputCat.setAttribute("type", "text");
    inputCat.setAttribute("list", "inputCategoriaDatalist");
    inputCat.setAttribute("value", cat);
    inputCat.setAttribute("id", "categoria");
    var inputCategoriaDatalist = document.createElement("datalist");
    inputCategoriaDatalist.setAttribute("id", "inputCategoriaDatalist");
    divCat.appendChild(labelCat);
    divCat.appendChild(inputCat);
    divCat.appendChild(inputCategoriaDatalist)
/*SUBCATEGORIA*/
    var divSubCat = document.createElement("div");
    var labelSubCat = document.createElement("label");
    labelSubCat.textContent = "Subcategoría";
    var inputSubCategoria = document.createElement("input");
    inputSubCategoria.setAttribute("type", "text");
    inputSubCategoria.setAttribute("list", "inputSubCategoriaDatalist")
    inputSubCategoria.setAttribute("value", subCat);
    inputSubCategoria.setAttribute("id", "subCategoria");
    var inputSubCategoriaDatalsit = document.createElement("datalist");
    inputSubCategoriaDatalsit.setAttribute("id", "inputSubCategoriaDatalist");
    divSubCat.appendChild(labelSubCat);
    divSubCat.appendChild(inputSubCategoria);
    divSubCat.appendChild(inputSubCategoriaDatalsit)
/*CANTIDAD */
    var divCant = document.createElement("div");
    var labelCant = document.createElement("label");
    labelCant.textContent = "Cantidad";
    var inputCant = document.createElement("input");
    inputCant.setAttribute("type", "number");
    inputCant.setAttribute("value", cant);
    inputCant.setAttribute("id", "cantidad");
    divCant.appendChild(labelCant);
    divCant.appendChild(inputCant);
/*STOCK */
    var divStock = document.createElement("div");
    var labelStock = document.createElement("label");
    labelStock.textContent = "Stock";
    var inputStock = document.createElement("input");
    inputStock.setAttribute("type", "number");
    inputStock.setAttribute("value", stock);
    inputStock.setAttribute("disabled", "");
    inputStock.setAttribute("id", "stock");
    divStock.appendChild(labelStock);
    divStock.appendChild(inputStock);
/*MAL ESTADO */
    var divMal = document.createElement("div");
    var labelMal = document.createElement("label");
    labelMal.textContent = "Mal estado";
    var inputMal = document.createElement("input");
    inputMal.setAttribute("type", "number");
    inputMal.setAttribute("value", mal);
    inputMal.setAttribute("id", "malEstado");
    divMal.appendChild(labelMal);
    divMal.appendChild(inputMal);
/*NUMERO DE SERIE */
    var divNumSer = document.createElement("div");
    var labelNumSer = document.createElement("label");
    labelNumSer.textContent = "Número de serie";
    var inputNumSer = document.createElement("input");
    inputNumSer.setAttribute("type", "text");
    inputNumSer.setAttribute("value", numSer);
    inputNumSer.setAttribute("id", "numeroDeSerie");
    divNumSer.appendChild(labelNumSer);
    divNumSer.appendChild(inputNumSer);
/*BOTON COLUMNAS */
    var botonColumnas = document.createElement("button");
    botonColumnas.textContent = "Añadir columna";
    botonColumnas.setAttribute("id", "botonColumnas");
    botonColumnas.addEventListener("click", function(event){
        event.preventDefault();
        addColumna();
    });
/*BOTON GUARDAR */
    var botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Guardar cambios";
    botonGuardar.setAttribute("id", "botonGuardar");
    botonGuardar.addEventListener("click", function(event){
        event.preventDefault();
        guardarCambios();
    })

    form.appendChild(divCod);
    form.appendChild(divNom);
    form.appendChild(divCat);
    form.appendChild(divSubCat)
    form.appendChild(divCant);
    form.appendChild(divStock);
    form.appendChild(divNumSer);
    form.appendChild(divMal);

    var containerInfoAdicional = document.createElement("div");
    containerInfoAdicional.setAttribute("id", "containerInfoAdicional");
    var infoAd = infoAdicional.split(",");
    for(var i=0;i<infoAd.length-1;i++){
        var divInfo = document.createElement("div");
        var info = infoAd[i];
        info = info.split(":");
        var labelInfo = document.createElement("label");
        labelInfo.textContent = info[0];
        var iconoBorrar = document.createElement("i");
        iconoBorrar.classList.add("botonBorrar", "fa-solid", "fa-ban");
        iconoBorrar.setAttribute("title", "Borrar");
        var inputInfo = document.createElement("input");
        inputInfo.setAttribute("type", "text");
        inputInfo.setAttribute("value", info[1]);
        iconoBorrar.addEventListener("click", function(event){
            this.parentElement.remove();
        })
        divInfo.appendChild(labelInfo);
        divInfo.appendChild(iconoBorrar);
        divInfo.appendChild(inputInfo);
        containerInfoAdicional.appendChild(divInfo);
    }
    form.appendChild(containerInfoAdicional);
    form.appendChild(botonColumnas);
    form.appendChild(botonGuardar);

    div.appendChild(form);
    getCategorias();
    getSubCategorias();
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
        arr.forEach((element)=>{
            var opt = document.createElement("option");
            opt.innerHTML = element.categoria;
            opt.value = element.categoria;
            inputCat.appendChild(opt);
        })
    });
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
        arr.forEach((element)=>{
            var opt = document.createElement("option");
            opt.innerHTML = element.subcategoria;
            opt.value = element.subcategoria;
            inputSubCat.appendChild(opt);
        })
    });
}

function addColumna(){
    var container = document.getElementById('containerInfoAdicional');
    var textoLabel = prompt("Nombre de la nueva columna");
    if(textoLabel.trim()===""){
        return;
    }
    var divInfo = document.createElement("div");
    divInfo.classList.add("form-outline", "mb-4");
    var nuevoLabel = document.createElement("label");
    nuevoLabel.textContent = textoLabel;
    var nuevaColumna = document.createElement("input");
    nuevaColumna.setAttribute("type", "text");
    nuevaColumna.setAttribute("required", "");
    nuevoLabel.classList.add("nuevoLabel", "form-label");
    nuevaColumna.classList.add("nuevoInput", "form-control", "form-control-lg", "inputText");
    
    var iconoBorrar = document.createElement("i");
    iconoBorrar.classList.add("fa-solid");
    iconoBorrar.classList.add("fa-ban");
    iconoBorrar.classList.add("botonBorrar");
    iconoBorrar.setAttribute("title", "Borrar");
    iconoBorrar.addEventListener("click", function(event){
        this.parentElement.remove();
    })
    
    divInfo.appendChild(nuevoLabel);
    divInfo.appendChild(iconoBorrar);
    divInfo.appendChild(nuevaColumna);
    container.appendChild(divInfo);
    
}

function getInfoAdicional(){
    var infoAdicional = document.getElementById("containerInfoAdicional").children;
    var textoInfoAdicional = "";
    for(var i=0;i<infoAdicional.length;i++){
        textoInfoAdicional+=infoAdicional[i].children[0].innerHTML+":"+infoAdicional[i].children[3].value+",";
    }
    return textoInfoAdicional;
}

function guardarCambios(){
    var cod = document.getElementById("codigo").value;
    var subCat = document.getElementById("subCategoria").value;
    var nom = document.getElementById("nombre").value;
    var cat = document.getElementById("categoria").value;
    var cant = document.getElementById("cantidad").value;
    var stock = document.getElementById("stock").value;
    var mal = document.getElementById("malEstado").value;
    var numeroDeSerie = document.getElementById("numeroDeSerie").value;
    var info = getInfoAdicional();
    $.ajax({
        method: "POST",
        url: "funciones/FDetallesProducto.php",
        data: {
                functionName : "guardarCambios", 
                codigo:cod, 
                subCategoria:subCat, 
                nombre:nom, categoria:cat, 
                cantidad:cant, 
                stock:stock, 
                mal:mal, 
                info:info, 
                numeroDeSerie:numeroDeSerie}
    })
    .done(function(response){
        alert(response);
    })
}

function getHistorial(){
    $.ajax({
        method: "POST",
        url: "funciones/FDetallesProducto.php",
        data: {functionName: "historialDevoluciones", codigo:codigo}
    })
    .done(function(response){
        const arr = Array.from(JSON.parse(response));
        arr.forEach(element => {
            crearFila(element.CorreoUser, element.cantidad, element.prestamista, element.fechaPrestada, element.fechaDevolucion);
        });
    })
}

function crearFila(cor, cant, prest, fechP, fechD){
    var tabla = document.getElementById("tablaHistorial");
    var fila = document.createElement("tr");
    fila.classList.add("fila");
    
    var celdaCor = document.createElement("td");
    celdaCor.textContent = cor;

    var celdaPrest = document.createElement("td");
    celdaPrest.textContent = prest;

    var celdaCant = document.createElement("td");
    celdaCant.textContent = cant;
    
    
    var celdaFechP = document.createElement("td");
    celdaFechP.textContent = fechP;
    
    
    var celdaFechD = document.createElement("td");
    celdaFechD.textContent = fechD;

    fila.appendChild(celdaCor);
    fila.appendChild(celdaPrest);
    fila.appendChild(celdaCant);
    fila.appendChild(celdaFechP);
    fila.appendChild(celdaFechD);
    
    tabla.appendChild(fila);
}