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
    var divider = "================================================================================"
    var sqlString = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(sqlString, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                divider + `\n` +
                `Product ID: ` + res[i].item_id +
                ` || Name: ` + res[i].product_name +
                ` || Price: $` + res[i].price +
                ` || Quantity: ` + res[i].stock_quantity +
                `\n` + divider
            );
        }
        startMenu();
    });
}

function lowInventory() {

}

function addInventory() {

}

function addProduct() {

}

function exit() {
    inquirer.prompt([
        {
            name: "exit",
            type: "list",
            message: "",
            choices: ["EXIT"]
        }
    ]).then(function() {
        startMenu();
    });
}