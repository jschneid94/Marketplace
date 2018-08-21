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
        if (response.startMenu[0]) {
            makeOrder();
        } else {
            connection.end();
        }
    });
}

function displayMarket() {
    var divider = "===================================================="
    var sqlString = "SELECT item_id, product_name, price FROM products";
    connection.query(sqlString, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                divider + `\n` +
                `Product ID: ` + res[i].item_id +
                ` || Name: ` + res[i].product_name +
                ` || Price: $` + res[i].price +
                `\n` + divider
            );
        }
        start();
    });
}

function makeOrder() {
    var questions = [
        {
            name: "id",
            type: "input",
            message: "What is id number for the item you are looking for?",
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
        var requestedUnits = response.units;

        var sqlString = "SELECT * FROM products WHERE ?"; 

        connection.query(sqlString, {item_id: response.id}, function(err, res) {
            if (err) throw err;
            var itemQuantity = res[0].stock_quantity;

            if (requestedUnits > itemQuantity) {
                console.log(`\nUnfortunately we do not have that number of units in stock. 
                            Try putting your order through again.`)
                displayMarket();
            } else {
                var newQuantity = itemQuantity - requestedUnits;
                var purchaseTotal = (requestedUnits * res[0].price).toFixed();

                var sqlString = "UPDATE products SET ? WHERE ?";
                var values = [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: response.id
                    }
                ]

                connection.query(sqlString, values, function(err) {
                    if (err) throw err;
                    console.log(`\nYour order is complete! Your total: $` + purchaseTotal + `\n`);
                    newOrder();
                });
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
