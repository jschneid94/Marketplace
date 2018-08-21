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
    start();
});

function start() {
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
                console.log("Unfortunately we do not have that number of units in stock. Try putting your order through again.")
                start();
            } else {
                var newQuantity = itemQuantity - requestedUnits;
                var purchaseTotal = (requestedUnits * res[0].price).toFixed();
                var sqlString = "UPDATE products SET ? WHERE ?"

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
                    console.log("Your order is complete! Here is how much you spent: " + purchaseTotal);
                    connection.end();
                });
            }
        });
    });
}

