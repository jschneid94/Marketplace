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
    var questions = [
        {
            name: "department",
            type: "input",
            message: "What department do you want to add?"
        },
        {
            name: "overhead",
            type: "input",
            message: "What is the overhead cost for this department?",
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
                var sqlString = "INSERT INTO departments SET ?";
                var values = {
                    department_name: res.department,
                    over_head_costs: res.overhead
                }
                connection.query(sqlString, values, function(err) {
                    if (err) throw err;
                    viewByDepartment();
                    console.log("Department has been added!")
                });
            } else {
                console.log(`\nPlease re-enter the department info\n`)
                createNewDepartment();
            }
        });
    });
}