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
    var sqlString = "SELECT department_id AS ID, d.department_name AS Department, over_head_costs AS `Overhead Costs`,"
    sqlString += "SUM(product_sales) AS `Product Sales`, SUM(product_sales) - over_head_costs AS `Total Profit`"     
    sqlString += "FROM departments d INNER JOIN products p ON d.department_name = p.department_name GROUP BY department_id";
    connection.query(sqlString, function(err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
}

function createNewDepartment() {

}