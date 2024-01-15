window.addEventListener("load", start);

var favicon, logo = "";

function start(){
    checkRol();
    crearForm();
    eventos();
    cargarDatos();

    //document.getElementById("inputColor").style.backgroundColor = localStorage.getItem("color");
    //document.getElementById("inputColorCabeceras").style.backgroundColor = localStorage.getItem("colorCabecera");
}

function checkRol(){
    if(localStorage.getItem("rol") != 'superadmin'){
        location.href = "index.html";
    }
}

function crearForm(){
    var contenedor =  document.getElementById("contenedorForm"); 

    contenedor.innerHTML= `
                    <div id="divFormAjustes">
                        <form name="formulario" id="formAjustes" enctype="multipart/form-data">

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="form3Example1cg">Color fondo</label>
                                <input type="color" id="inputColor" name="color" class="form-control inputText" required />
                            </div>                            

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="inputColorCabeceras">Color cabeceras</label>
                                <input type="color" id="inputColorCabeceras" name="inputColorCabeceras" required />
                            </div>

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="form3Example4cg">Logo</label>
                                <input type="file" accept="image/*" id="inputLogo" name="logo" required />
                            </div>

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="form3Example4cg">Favicon</label>
                                <input type="file" accept="image/*" id="inputFavicon" name="favicon" required />
                            </div>

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="inputCorreo">Correo recuperar clave</label>
                                <input type="text" name="inputCorreo" id="inputCorreo" required />
                            </div>

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="inputPass">Contraseña</label>
                                <input type="password" name="inputPass" id="inputPass" required />
                            </div>

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="inputPass2">Repetir contraseña</label>
                                <input type="password" name="inputPass2" id="inputPass2" required />
                            </div>

                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="inputCantidad">Productos a mostrar por paginación</label>
                                <input type="number" name="inputCantidad" id="inputCantidad" required />
                            </div>
                            <div class="divElementosForm">
                                <label class="labelFormAjustes" for="caracterDeControl">Caracter de control para códigos de barras</label>
                                <input type="text" id="caracterDeControl" name="caracterDeControl" maxlength="1" />
                            </div>

                            <div>
                            </div>
                            </form>
                            <button id="botonCambiarAjustes" onclick="cambiarAjustes()">Cambiar ajustes</button>
                            <div id='infoAdicional' class="form-outline mb-4"></div>
                    </div>`;
}

function cargarDatos(){
    $.ajax({
        method: "POST",
        url: "funciones/FAjustes.php",
        data: {functionName:"cargarAjustes"}
    })
    .done(function(response){
        const arr = Array.from(JSON.parse(response));
        document.getElementById("inputColor").value = arr[0].color;
        document.getElementById("inputCorreo").value = arr[0].correo;     
        document.getElementById("inputCantidad").value = arr[0].cantidad;
        document.getElementById("inputColorCabeceras").value = arr[0].colorCabecera;
        document.getElementById("caracterDeControl").value = arr[0].caracterControlCodigos;
    })
}

function eventos(){

    document.querySelector("#inputLogo").addEventListener("change", function(){
        const reader = new FileReader();
        
        reader.readAsDataURL(this.files[0]);
        reader.addEventListener("load", ()=>{
            logo = reader.result;            
        })
    })

    document.querySelector("#inputFavicon").addEventListener("change", function(){
        const reader = new FileReader();
        
        reader.readAsDataURL(this.files[0]);
        reader.addEventListener("load", ()=>{
            favicon = reader.result;            
        })
    })
}


function cambiarAjustes(){
    var color = document.getElementById("inputColor").value;
    var correo = document.getElementById("inputCorreo").value;
    var cantidad = document.getElementById("inputCantidad").value;
    var clave = document.getElementById("inputPass").value;
    var clave2 = document.getElementById("inputPass2").value;
    var colorCabeceras = document.getElementById("inputColorCabeceras").value;
    var colorLetra = getColorComplementario(color);
    var caracterControlCodigos = document.getElementById("caracterDeControl").value;
    console.log("Color Letra: "+colorLetra);
    var colorLetraCabecera = getColorComplementario(colorCabeceras);
    console.log("Color Letra Cabeceras: "+colorLetraCabecera);

    if(clave == clave2){
        $.ajax({
            method: "POST",
            url: "funciones/FAjustes.php",
            data: {functionName:"cambiarAjustes", color:color, correo:correo, clave:clave, cantidad:cantidad, favicon:favicon, logo:logo, colorCabeceras:colorCabeceras, colorLetra:colorLetra, colorLetraCabecera:colorLetraCabecera, caracterControlCodigos:caracterControlCodigos}
        })
        .done(function(response){
            if(color!=""){
                localStorage.setItem("color", color);
                localStorage.setItem("colorLetra", colorLetra);
            }
            if(cantidad!=""){
                localStorage.setItem("cantidad", cantidad);
            }
            if(favicon != undefined){
                localStorage.setItem("favicon", favicon);
            }
            if(colorCabeceras != ""){
                localStorage.setItem("colorCabeceras", colorCabeceras);
                localStorage.setItem("colorLetraCabecera", colorLetraCabecera);
            }
            if(caracterControlCodigos != ""){
                localStorage.setItem("caracterControlCodigos", caracterControlCodigos);
            }
            if(logo !=""){
                localStorage.setItem("logo", logo);
            }
            if(favicon != ""){
                localStorage.setItem("favicon", favicon);
            }
            
            alert(response);
            location.reload();
        })
    } else{
        alert("Las contraseñas no coinciden");
    }
}

var colorLetra;

function getColorComplementario(hex){
    hex = hex.replace("#", "");
    const R = parseInt(hex.substr(0, 2), 16);
    const G = parseInt(hex.substr(2, 2), 16);
    const B = parseInt(hex.substr(4, 2), 16);
    var comp = ((0.299*R)+(0.587*G)+(0.114*B))/255;
    if(comp<0.5){
        return "#FFFFFF";
    } 
    return "#000000";
}