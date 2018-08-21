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
    const questions = [
        
    ]
}