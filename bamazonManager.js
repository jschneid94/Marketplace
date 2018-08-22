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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(response){
        if (response.startMenu === "View Products for Sale") {
            viewProducts();
        } else if (response.startMenu === "View Low Inventory") {
            lowInventory();
        } else if (response.startMenu === "Add to Inventory") {
            addInventory();
        } else if (response.startMenu === "Add New Product") {
            addProduct();
        } else {
            connection.end();
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
        // Create an array of all products for choice options
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].item_id + ": " + res[i].product_name);
        }
        // Prompt for the item to increase inventory for and the amount to increase
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
            // Assigns the choice components to a variable
            var chosenItem;
            var components = answer.choice.trim().split(":");
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(components[0])) {
                    chosenItem = res[i];
                }
            }
            // Update the chosen item's stock quantity
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
            // Notify the user of the item and its updated quantity
            connection.query(quantityQuery, values, function(err) {
                if (err) throw err;
                console.log(`\nInventory updated: ${chosenItem.product_name} - ${newQuantity}\n`);
                startMenu();
            })
        })
    });
}

function addProduct() {
    var questions = [
        {
            name: "name",
            type: "input",
            message: "What is the name of the product you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What department does this product belong in?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price for this item?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            } 
        },
        {
            name: "quantity",
            type: "input",
            message: "How many of these items do you want in stock?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ];
    inquirer.prompt(questions).then(function(res) {
        console.table(res);
        // Confirm the entered information is correct
        var confirm = [
            {
                name: "confirm",
                type: "list",
                message: "Does this information look correct?",
                choices: ["YES", "NO"]
            }
        ];
        inquirer.prompt(confirm).then(function(answer) {
            if (answer.confirm === "YES") {
                var sqlString = "INSERT INTO products SET ?";
                var newProduct = {
                    product_name: res.name,
                    department_name: res.department,
                    price: res.price,
                    stock_quantity: res.quantity
                };
                connection.query(sqlString, newProduct, function(err) {
                    if (err) throw err;
                    viewProducts();
                    console.log("Product has been added!")
                })
            } else {
                console.log(`\nPlease re-enter the product info\n`)
                addProduct();
            }
        });
    })
}
