window.addEventListener("load", start);

function start(){
    crearInputs();    
}

function crearInputs(){
    var contenedor = document.getElementById("contenedor");
    
    //Añadimos el HTML del formulario para registrar usuarios en gestionUsuarios.html
    contenedor.innerHTML = `
    <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-50">
                <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                    <div class="card-body p-5">
                        <form id="formularioLogin">
                            <div class="form-outline mb-4">
                                <label class="form-label" for="form3Example1cg">Indica tu correo</label>
                                <input type="text" id="correoInput" name="correo" class="form-control form-control-lg inputText" required />
                            </div>
                        </form>
                    </div>
                    <div class="d-flex justify-content-center">                        
                        <button class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" id="botonCambiar" onclick="enviarCorreo()">Cambiar contraseña</button>
                    </div>
                </div>
            </div>
        </div>
        `;
}

/* Función para enviar el correo al correo del usuario */
function enviarCorreo(){
    var correo = document.getElementById("correoInput").value;
    console.log(correo)
    $.ajax({
        method: "POST",
        url: "funciones/FCambioContrasena.php",
        data: {functionName : "enviarCorreo", correo:correo}
    })
    .done(function(response){
        alert("Correo enviado");
        location.href = "index.html";
    })
}

function cambiarContrasena(){
    var clave =  document.getElementById("clave").value;
    var repetir = document.getElementById("repetir").value;
    
    if(clave === repetir){
        $.ajax({
            method: "POST",
            url: "funciones/FCambioContrasena.php",
            data: {functionName : "cambiarContrasena", clave:clave}
        })
        .done(function(response){
            alert(response);
        })
    } else{
        alert("Las claves no son iguales");    
        return;    
    }
}
