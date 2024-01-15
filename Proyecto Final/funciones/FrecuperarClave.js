function start(){
    comprobarHashValido();
    crearFormulario();
}

function crearFormulario(){
    var contenedorFormulario = document.getElementById("contenedorFormulario");
    contenedorFormulario.innerHTML=`
    <div class="container h-100">
    <div class="row d-flex justify-content-center align-items-center h-50">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card-body p-5">
                <form name="formularioAlta">

                    <div class="form-outline mb-4">
                        <label class="form-label" for="form3Example1cg">Contraseña</label>
                        <input type="password" id="pass1" name="pass1" class="form-control form-control-lg inputText" required/>
                    </div>

                    <div class="form-outline mb-4">
                        <label class="form-label" for="form3Example3cg">Repite la contraseña</label>
                        <input type="password" name="pass2" id="pass2" class="form-control form-control-lg inputText" required/>
                    </div>
                    </form>
                    <button class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" id="añadirProd" onclick="cambiarPass()">Cambiar Contraseña</button>
            </div>
        </div>
    </div>
</div>`
}

function comprobarHashValido(){
    var enlace = window.location.href;
    var hash = enlace.substring(enlace.indexOf("=")+1, enlace.length);

    $.ajax({
        method: "POST",
        url: "funciones/FrecuperarClave.php",
        data: {functionName : "comprobarHash", hash:hash}
    })
    .done(function(response){
        if(response==="F"){
            alert("Enlace no válido");
            location.href = "index.html";
        }
    })
}

function comprobarPass(){
    var pass1 = document.getElementById("pass1").value;
    var pass2 = document.getElementById("pass2").value;
    if(pass1 === pass2 && pass1!=""){
        return true;
    }
    alert("Las contraseñas no coinciden o están vacías.")
    return false;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result;
}

function cambiarPass(){
    if(comprobarPass()){
        var pass1 = document.getElementById("pass1").value;
        var enlace = window.location.href;
        var hash = enlace.substring(enlace.indexOf("=")+1, enlace.length);
        var nuevoHash = makeid(15);
        $.ajax({
            method: "POST",
            url: "funciones/FrecuperarClave.php",
            data: {functionName : "cambiarPass", pass:pass1, hash:hash, nuevoHash:nuevoHash}
        })
        .done(function(response){
            alert(response);
            location.href = "index.html";
        })
    }
}