// menu.js
function createMenu() {
    var menuContainer = document.getElementById("menu-container");

    // Create a list element for the menu
    var menuList = document.createElement("ul");

    // Create menu items
    var menuItems = ["Home", "About", "Services", "Contact"];

    menuItems.forEach(function (item) {
        var menuItem = document.createElement("li");
        menuItem.textContent = item;
        menuList.appendChild(menuItem);
    });

    // Append the menu to the container
    menuContainer.appendChild(menuList);
}

// Call the createMenu function to generate the menu
createMenu();