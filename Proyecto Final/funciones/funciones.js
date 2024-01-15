// menu.js
window.addEventListener("load", start());

function start() {
  setDatos();
  checkLogin();
}

function setDatos() {
  if (localStorage.getItem("color") === null) {
    $.ajax({
      method: "POST",
      url: "funciones/FAjustes.php",
      data: { functionName: "cargarAjustes" },
    }).done(function (response) {
      const result = JSON.parse(response);
      const arr = Array.from(result);
      //document.querySelector("#imgLogo").setAttribute("src", result.logo);
      //console.log("dsa");
      //console.log(result.logo);
      console.log(arr[0].logo);
      localStorage.setItem("logo", arr[0].logo);
      localStorage.setItem("color", arr[0].color);
      localStorage.setItem("cantidad", arr[0].cantidad);
      localStorage.setItem("favicon", arr[0].favicon);
      localStorage.setItem("colorCabeceras", arr[0].colorCabecera);
      localStorage.setItem("colorLetra", arr[0].colorLetra);
      localStorage.setItem("colorLetraCabecera", arr[0].colorLetraCabecera);
    });
  }
}

function setBotonMenuSeleccionado() {
  var fullURL = window.location.href;
  var lastSlashIndex = fullURL.lastIndexOf('/');
  var fileName = fullURL.substring(lastSlashIndex + 1);
  var botones = document.querySelector("#menuPrincipalFilaBotones");
  for (const boton of botones.children) {
    if (boton.getAttribute("href") == fileName) {
      boton.children[0].classList.add("seleccionado");
    }
  }
}


//Función que devuelve el código HTML para el menú de la página.
//Cambia en función del rol del usuario conectado

function createMenu() {
  /*/////////////////////////////
  Convertir blobs a imágenes v
  /////////////////////////////
  var logoBlob = new Blob([ localStorage.getItem("logo") ], { type:'image/*' });
  
  const readerLogo = new FileReader();

  readerLogo.onload = function(e){
    const dataURL = e.target.result;
    localStorage.setItem("logo", dataURL);
  }
  readerLogo.readAsDataURL(logoBlob);

  /////////////////////////////
  Convertir blobs a imágenes ^
  /////////////////////////////*/
  document
    .querySelector("#imgLogo")
    .setAttribute("src", localStorage.getItem("logo"));
  document.body.style.backgroundColor = localStorage.getItem("color");
  document.querySelector("#navBar").style.backgroundColor =
    localStorage.getItem("color");
  var cabeceras = document.getElementsByClassName("cabecera");

  for (var i = 0; i < cabeceras.length; i++) {
    cabeceras[i].style.backgroundColor = localStorage.getItem("colorCabeceras");
    cabeceras[i].style.color = localStorage.getItem("colorLetraCabecera");
  }
  document.body.style.color = localStorage.getItem("colorLetra");

  var superAdmin = "";
  if (localStorage.getItem("rol") == "superadmin") {
    superAdmin = `<a href="ajustes.html"><div class="botonMenuPrincipal"><span class='textoBotonMenuPrincipal'>Ajustes</span></div></a>`;
  }
  var link = document.querySelector("link[rel~='icon']");
  link.href = localStorage.getItem("favicon");
  //console.log(localStorage.getItem("favicon"));
  //Seleccionamos el div con ID menu-container que aparecerá en todas las páginas.
  var navBar = document.getElementById("navBar");
  navBar.classList.add("divTable");

  var menuFila = document.createElement("header");
  menuFila.setAttribute("id", "menuPrincipalFilaBotones");
  //Dependiendo del rol del usuario logueado, añadirá unos elementos u otros la menú.
  if (localStorage.getItem("rol") == "user") {
    menuFila.innerHTML = `
                                <a href="index.html"><div class="botonMenuPrincipal"><span class='textoBotonMenuPrincipal'>Home</span></div></a>
                                <a href="gestionUsuarios.html"><div class="botonMenuPrincipal"><span class='textoBotonMenuPrincipal'>Usuarios</span></div></a>
                                `;
  } else {
    menuFila.innerHTML = `
                                <a href="index.html"><div class="botonMenuPrincipal""><span class='textoBotonMenuPrincipal'>Home</span></div></a>
                                <a href="gestionProductos.html"><div class="botonMenuPrincipal""><span class='textoBotonMenuPrincipal'>Productos</span></div></a>
                                <a href="prestamo.html"><div class="botonMenuPrincipal""><span class='textoBotonMenuPrincipal'>Préstamos</span></div></a>
                                <a href="devoluciones.html"><div class="botonMenuPrincipal""><span class='textoBotonMenuPrincipal'>Devoluciones</span></div></a>
                                <a href="gestionUsuarios.html"><div class="botonMenuPrincipal""><span class='textoBotonMenuPrincipal'>Usuarios</span></div></a>
                                ${superAdmin}
                                `;
  }
  //Añadimos el menú al contenedor que hay en la página HTML
  navBar.appendChild(menuFila);
  navBar.innerHTML += `<div id="contenedorBotonSalir"><a id="aSalirMenuPrincipal" href="#"><div id="botonSalir" class="botonMenuPrincipal" onclick='cerrarSesion()'><span class='textoBotonMenuPrincipal'>Salir</span></div></a></div>`;
  setBotonMenuSeleccionado();
}

function checkLogin() {
  if (localStorage.getItem("usuario") === null) {
    location.href = "login.html";
  }
}

function cerrarSesion() {
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario");

  window.location.href = "login.html";
}

function sortTable(tab, n) {
  var rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  var table = document.getElementById(tab);
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
    no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /*Loop through all table rows (except the
      first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //Change i=0 if you have the header th a separate table.
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
        one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      console.log("N: " + n);
      console.log(rows[i].getElementsByTagName("td")[n]);
      console.log(rows[i + 1].getElementsByTagName("td")[n]);
      /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (isNaN(x.innerHTML)) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (isNaN(x.innerHTML)) {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function listenersOrdenarTabla(tab) {
  var tabla = document.getElementById(tab);
  var filas = tabla.getElementsByTagName("tr");
  var cabeceras = tabla.getElementsByTagName("th");
  for (var i = 0; i < cabeceras.length; i++) {
    (function (index) {
      cabeceras[index].addEventListener("click", function () {
        sortTable(tab, index);
      });
    })(i);
  }
}
