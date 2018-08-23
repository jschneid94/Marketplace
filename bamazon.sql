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

ALTER TABLE products 
    ADD product_sales DECIMAL(15,2) DEFAULT 0;