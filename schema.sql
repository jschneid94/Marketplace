CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(15,2) NOT NULL,
    product_sales DECIMAL(15,2) DEFAULT 0,
    PRIMARY KEY (department_id)
);

CREATE VIEW product_sales_by_department AS
SELECT department_id AS ID, 
        d.department_name AS Department, 
        over_head_costs AS `Overhead Costs`, 
        SUM(product_sales) AS `Product Sales`,
	    SUM(product_sales) - over_head_costs AS `Total Profit`
FROM departments d
INNER JOIN products p
ON d.department_name = p.department_name
GROUP BY department_id;