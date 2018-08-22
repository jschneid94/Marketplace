const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

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
        if (response.startMenu === "View Products for Sale") {
            viewProducts();
        } else if (response.startMenu === "View Low Inventory") {
            lowInventory();
        } else if (response.startMenu === "Add to Inventory") {
            addInventory();
        } else {
            addProduct();
        }
    });
}

function viewProducts() {
    var sqlString = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(sqlString, function(err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
}

function lowInventory() {
    var sqlString = "SELECT * FROM products WHERE stock_quantity < ?";
    connection.query(sqlString, ["10"], function(err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    })
}

function addInventory() {
    var sqlString = "SELECT * FROM products";
    connection.query(sqlString, function(err, res) {
        if (err) throw err;

        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].item_id + ": " + res[i].product_name);
        }

        var questions = [
            {
                name: "choice",
                type: "list",
                message: "Please select the product:",
                choices: choiceArray
            },
            {
                name: "quantity",
                type: "input",
                message: "How much do you add to this item's inventory?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                } 
            }
        ];

        inquirer.prompt(questions).then(function(answer) {
            var chosenItem;
            var components = answer.choice.trim().split(":");
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(components[0])) {
                    chosenItem = res[i];
                }
            }

            var newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);

            var quantityQuery = "UPDATE products SET ? WHERE ?";
            var values = [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: chosenItem.item_id
                }
            ]

            connection.query(quantityQuery, values, function(err) {
                if (err) throw err;
                console.log(`\nInventory updated: ${chosenItem.product_name} - ${newQuantity}\n`);
                startMenu();
            })
        })
    });
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