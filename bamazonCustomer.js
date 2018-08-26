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
    displayMarket();
});

function start() {
    inquirer.prompt([
        {
            name: "startMenu",
            type: "list",
            message: "Welcome to the Bamazon Market!",
            choices: ["ORDER", "EXIT"]
        }
    ]).then(function(response){
        if (response.startMenu === "ORDER") {
            makeOrder();
        } else {
            connection.end();
        }
    });
}

function displayMarket() {
    var sqlString = "SELECT item_id AS ID, product_name AS Product, price AS Price FROM products";
    connection.query(sqlString, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function makeOrder() {
    var questions = [
        {
            name: "id",
            type: "input",
            message: "What is the ID number for the item you are looking for?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "units",
            type: "input",
            message: "How many units are you looking to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ];
    inquirer.prompt(questions).then(function(response) {
        console.table(response);
        // Confirm order before submitting
        var confirm = [
            {
                name: "confirm",
                type: "list",
                message: "Does your order look correct?",
                choices: ["YES", "NO"]
            }
        ];
        inquirer.prompt(confirm).then(function(answer) {
            if (answer.confirm === "YES") {
                var requestedUnits = response.units;
                var sqlString = "SELECT * FROM products WHERE ?"; 
                connection.query(sqlString, {item_id: response.id}, function(err, res) {
                    if (err) throw err;
                    var itemQuantity = res[0].stock_quantity;

                    // If there are not enough items in stock, start the order over
                    if (requestedUnits > itemQuantity) {
                        console.log(`\nUnfortunately we do not have that number of units in stock. 
                                    Try putting your order through again.`)
                        makeOrder();
                    } 
                    // If there are enough items in stock, push the order through
                    else {
                        var newQuantity = itemQuantity - requestedUnits;
                        var purchaseTotal = (requestedUnits * res[0].price).toFixed(2);
                        var productSalesTotal = parseInt(res[0].product_sales) + parseInt(purchaseTotal)
                        var sqlString = "UPDATE products SET ? WHERE ?";
                        var values = [
                            {
                                // Quantity is lowered and the product's sales total is increased
                                stock_quantity: newQuantity,
                                product_sales: productSalesTotal
                            },
                            {
                                item_id: response.id
                            }
                        ];
                        connection.query(sqlString, values, function(err) {
                            if (err) throw err;
                            console.log(`\nYour order is complete! Your total: $` + purchaseTotal + `\n`);
                            newOrder();
                        });
                    }
                });
            } 
            // If the order is not correct, let user start the order over.
            else {
                console.log(`\nPlease make your order again.\n`)
                makeOrder();
            }
        });
    });
}

function newOrder() {
    inquirer.prompt([
        {
            name: "newOrder",
            type: "list",
            message: "Would you like to make another purchase?",
            choices: ["YES", "NO"]
        }
    ]).then(function(response) {
        if (response.newOrder === "YES") {
            displayMarket();
        } else {
            console.log("\nThanks for visiting! Come back soon :)\n")
            connection.end();
        }
    })
}
