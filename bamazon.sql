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
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Speaker", "Electronics", 49.95, 500), 
    ("Towel Set", "Bathroom", 15, 150),
    ("Firestick", "Electronics", 39.99, 1000),
    ("Mixer", "Kitchen", 79.99, 100);

INSERT INTO departments (department_name, over_head_costs)
Values ("Home & Furniture", 300),
        ("Kitchen", 400),
        ("Electronics", 1000),
        ("Bathroom", 200),
        ("Outdoor", 50),
        ("Beauty", 80);

ALTER TABLE products 
    ADD product_sales DECIMAL(15,2) DEFAULT 0;

CREATE VIEW product_sales_by_department AS
    SELECT department_id AS ID, 
            d.department_name AS Department, 
            over_head_costs AS `Overhead Costs`, 
            product_sales AS `Product Sales`
            -- (product_sales - over_head_costs) AS `Total Profit` 
    FROM products p, departments d
    WHERE d.department_name = p.department_name;

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