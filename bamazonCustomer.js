const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "toot",
    database: "bamazon"
  });

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    var questions = [
        {
            name: "item_id",
            type: "input",
            message: "What is id number for the item you are looking for?"
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
    ]

    inquirer.prompt(questions).then(function(response) {
        if ()
    });
}

function checkID() {
    var sqlString = "SELECT item_id FROM products"

    connection.query(sqlString, function(err) {
        if (err) throw err;


    });
}