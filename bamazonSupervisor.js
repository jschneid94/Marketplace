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
            message: "Bamazon Supervisor",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function(response){
        if (response.startMenu === "View Product Sales by Department") {
            viewByDepartment();
        } else if (response.startMenu === "Create New Department") {
            createNewDepartment();
        } else {
            connection.end();
        }
    });
}

function viewByDepartment() {

}

function createNewDepartment() {
    
}