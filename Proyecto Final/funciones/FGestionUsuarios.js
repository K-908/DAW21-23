window.addEventListener("load", start);


function start(){
    if(localStorage.getItem("rol")!="user"){
        crearFormUserReg();
    }
    crearTablaUsuarios();
    listenersOrdenarTabla("containerTablaUsuarios");
}

function crearFormUserReg(){
    var contenedorFormulario = document.getElementById("contenedorFormularioRegistro");
    //Si la persona logueada es superadmin, en el select le dará la opción de crear otros superadmin.
    //Si no, significa que es admin normal, con lo que sólo puede crear usuarios y admin normales.
    var esSuperAdmin = "";
    if(localStorage.getItem('rol')=="superadmin"){
        esSuperAdmin = `<option value="superadmin">Super Admin</option>`;
    }
    //Añadimos el HTML del formulario para registrar usuarios en gestionUsuarios.html
    contenedorFormulario.innerHTML = `
            
                <form name="formularioAlta" id="formularioAlta" class="formularioAltaUsuario">
                <div class="form-outline mb-4">
                    <label class="form-label" for="form3Example1cg">Nombre</label>
                    <input type="text" id="nombre" name="nombre" class="form-control form-control-lg inputText" required />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form3Example3cg">Correo</label>
                    <input type="text" name="correo" id="correo" class="form-control form-control-lg inputText" required />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form3Example4cg">Contraseña</label>
                    <input type="password" id="pass1" name="pass1" class="form-control form-control-lg inputText" required  />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form3Example4cdg">Repetir contraseña</label>
                    <input type="password" name="pass2" id="pass2" class="form-control form-control-lg inputText" required   />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="rol">Rol:</label>
                    <select name="rol" class="form-control form-control-lg gradient-custom-4 text-body optionRole" id="rol">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        ${esSuperAdmin}
                    </select>
                </div>
                <div class="d-flex justify-content-center">
                </div>
                </form>
                <button class="botonFormulario" id="botonAñadirMod" onclick="crearUsuario()">Añadir usuario</button>
            </div>
            </div>`;
}

//Función que crea la tabla y la cabecera de gestionUsuarios.html
function crearTablaUsuarios(){
    console.log(localStorage.getItem("rol"));
    var tablaUsuarios = document.getElementById("containerTablaUsuarios");
    tablaUsuarios.replaceChildren();
    var columnasNoUser = "";
    if(localStorage.getItem("rol")!="user"){
        columnasNoUser = `
        <th><p class='noOrdenable'>Modificar</p></th>
        <th><p class='noOrdenable'>Deshabilitar</p></th>`;
    }
    tablaUsuarios.innerHTML+=`<table class='table' id='tablaUsuarios'>
    <tr class='cabecera' id='cabeceraTablaUsuarios'>
        <th><p class='ordenable'>Usuario</p></th>
        <th><p class='ordenable'>Correo</p></th>
        <th><p class='ordenable'>Rol</p></th>
        ${columnasNoUser}
    </tr>`;
    $.ajax({
        method: "POST",
        url: "funciones/FGestionUsuarios.php",
        data: {functionName : "getAllUsers", rol : localStorage.getItem('rol'), usuario : localStorage.getItem('usuario')}
    })
    .done(function(response){
      const arr = Array.from(JSON.parse(response));
      //console.log(response);
      arr.forEach(element => {
            crearFila(element.nombre, element.correo, element.rol, element.activo);
        });
    })
    ;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result;
}

function crearUsuario(){
    var vnombre = $("#nombre").val();
    if(vnombre.length ==0){
        alert("El nombre no puede estar vacío");
        return;
    }
    var vcorreo = $("#correo").val();
    if(vcorreo.length ==0){
        alert("El correo no puede estar vacío");
        return;
    }
    var vpass1 = $("#pass1").val();
    var vpass2 = $("#pass2").val();

    var vhash = makeid(15);
    if(vpass1.length < 3){
        alert("La contraseña debe contener al menos 3 caracteres");
        return;
    }
    var vrol = $("#rol").val();
    if(vpass1===vpass2){
        $.ajax({
            method: "POST",
            url: "funciones/FGestionUsuarios.php",
            data: {functionName : "crearUsuario", rol:vrol, pass:vpass1, correo:vcorreo, nombre:vnombre, hash:vhash}
        })
        .done(function(response){
            alert(response);
            location.reload();
        })
    } else{
        alert("Las contraseñas no coinciden");
        return;
    }

}
    
//Función que crea las filas para la tabla de usuarios
function crearFila(nom, cor, rol, act){
    var fila = document.createElement("tr");
    
    //Celdas con la información del usuario
    var celdaNom = crearCelda(nom);
    var celdaCor = crearCelda(cor);
    var celdarol = crearCelda(rol);

    var inputNom = document.createElement("input");
    inputNom.setAttribute("id", "nombreHidden");
    inputNom.setAttribute("type", "hidden");
    inputNom.setAttribute("value", nom);

    var inputCorreo = document.createElement("input");
    inputCorreo.setAttribute("name", "correoHidden");
    inputCorreo.setAttribute("id", "correoHidden");
    inputCorreo.setAttribute("type", "hidden");
    inputCorreo.setAttribute("value", cor);    

    var inputRol = document.createElement("input");
    inputRol.setAttribute("type", "hidden");
    inputRol.setAttribute("id", "rolHidden");
    inputRol.setAttribute("value", rol);

    //Creación del botón y asignamos la función "borrarUser"
    var botonBorrar = document.createElement("button");
    var celdaBorrar = document.createElement("td");
    botonBorrar.setAttribute("class", "botonDeshabilitar");
    if(act=="1"){
        botonBorrar.textContent = "Deshabilitar";
        botonBorrar.addEventListener("click", function(){
            borrarUser(cor);
        });
    } else if(act=="0"){
        botonBorrar.textContent = "Habilitar";
        botonBorrar.style.backgroundColor = "green";
        botonBorrar.addEventListener("click", function(){
            habilitarUser(cor);
        });
    }

    celdaBorrar.appendChild(botonBorrar);

    //Botón para modificar usuario
    var botonModificar = document.createElement("button");
    var celdaModificar = document.createElement("td");
    botonModificar.textContent = "Modificar";
    botonModificar.setAttribute("class", "botonModificar")
    botonModificar.addEventListener("click", function(){
        cambiarBotonAñadirMod(nom, cor, rol);
    });
    celdaModificar.appendChild(botonModificar);

    //Añadimos las celdas a la fila
    fila.appendChild(celdaNom);
    fila.appendChild(celdaCor);
    fila.appendChild(celdarol);
    //fila.appendChild(form);
    fila.appendChild(inputNom);
    fila.appendChild(inputCorreo);
    fila.appendChild(inputRol);
    if(localStorage.getItem("rol")!="user"){
        fila.appendChild(celdaModificar);
        fila.appendChild(celdaBorrar);
    }
    document.getElementById("tablaUsuarios").appendChild(fila);
}

//Función que crea las celdas para las filas de la tabla de usuarios
function crearCelda(data){
    var celda = document.createElement("td");
    celda.innerHTML=data;
    return celda;
}

//Función para borrar usuarios de la base de datos.
//Se lanza cuando se hace click en el botón "Borrar" de la tabla
function borrarUser(vcorreo){
    var confirmar = confirm("Quieres deshabilitar la cuenta "+vcorreo+"?");
    console.log(vcorreo);
    if(!confirmar){
        return;
    }
    $.ajax({
        method: "POST",
        url: "funciones/FBorrarModUser.php",
        data: {functionName: "borrarUser", correo:vcorreo}
    })
    .done(function(response){
      document.getElementById("respuestas").innerHTML = response;
      crearTablaUsuarios();
    }) 
}

//Función para volver a habilitar a usuarios.
function habilitarUser(correo){
    var confirmar = confirm("Quieres habilitar la cuenta "+correo+"?");
    if(!confirmar){
        return;
    }
    $.ajax({
        method: "POST",
        url: "funciones/FBorrarModUser.php",
        data: {functionName: "habilitarUser", correo:correo}
    })
    .done(function(response){
      document.getElementById("respuestas").innerHTML = response;
      crearTablaUsuarios();
    }) 
}

//Función para modificar usuarios de la base de datos.
//Se lanza cuando se hace click en el botón de "Modificar usuario" del formulario
function modificarUser(){
    var vnombre = $("#nombre").val();
    var vcorreo = $("#correo").val();
    var vpass1 = $("#pass1").val();
    var vpass2 = $("#pass2").val();
    var vrol = $("#rol").val();
    var vcorreoAnterior = $("#correoAnterior").val();

    if(vpass1===vpass2){
        $.ajax({
            method: "POST",
            url: "funciones/FBorrarModUser.php",
            data: {functionName : "modificarUser", rol:vrol, pass:vpass1, correo:vcorreo, nombre:vnombre, correoAnterior:vcorreoAnterior}
        })
        .done(function(response){
            alert(response);
            location.reload();
        })
    } else{
        alert("Las contraseñas no coinciden");
        return;
    }
    
}

/* Función para modificar el formulario de alta cuando se pinche en el 
    botón de modificar */
function cambiarBotonAñadirMod(nom, cor, rol){
    //Cambiar titulo y boton del formulario y añadir datos al formulario del usuario 
    document.getElementById("botonAñadirMod").innerHTML = "Modificar usuario";
    document.getElementById("nombre").value = nom;
    document.getElementById("rol").value = rol;
    document.getElementById("correo").value = cor;
    document.getElementById("botonAñadirMod").textContent = "Modificar usuario";

    /*Comprobar si existen los inputs, si no existen se crean inputs invisibles con el correo y rol anterior. 
    Si existen se elimina el value y se cambia por el nuevo */ 
    if(document.getElementById("rolAnterior")==null && document.getElementById("correoAnterior")==null){
        var inputRolAnterior = document.createElement("input");
        inputRolAnterior.setAttribute("type", "hidden");
        inputRolAnterior.setAttribute("value", rol);
        inputRolAnterior.setAttribute("id", "rolAnterior");

        var inputCorAnterior = document.createElement("input");
        inputCorAnterior.setAttribute("type", "hidden");
        inputCorAnterior.setAttribute("id", "correoAnterior");
        inputCorAnterior.setAttribute("value", cor);

        document.getElementById("formAlta").appendChild(inputCorAnterior);
        document.getElementById("formAlta").appendChild(inputRolAnterior);
    } else{
        document.getElementById("correoAnterior").removeAttribute("value");
        document.getElementById("rolAnterior").removeAttribute("value");

        document.getElementById("correoAnterior").setAttribute("value", cor);
        document.getElementById("rolAnterior").setAttribute("value", rol);
    }
    
    /* Comprobar el evento onclick del boton 
    Si ya tiene el evento, se elimina y se añade el evento modificarUser */
    if(document.getElementById("botonAñadirMod").hasAttribute("onclick") == true){
        document.getElementById("botonAñadirMod").removeAttribute("onclick");
        document.getElementById("botonAñadirMod").setAttribute("onclick", "modificarUser()");
    }
    
}