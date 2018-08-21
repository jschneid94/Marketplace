const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    startMenu();
});

function startMenu() {
    inquirer.prompt([
        {
            name: "startMenu",
            type: "list",
            message: "Bamazon Manager",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(response){
        if (response.startMenu[0]) {
            viewProducts();
        } else if (response.startMenu[1]) {
            lowInventory();
        } else if (response.startMenu[2]) {
            addInventory();
        } else {
            addProduct();
        }
    });
}

function viewProducts() {

}

function lowInventory() {

}

function addInventory() {

}

function addProduct() {
    
}