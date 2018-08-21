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

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Speaker", "Electronics", 49.95, 500), 
    ("Towel Set", "Bathroom", 15, 150),
    ("Firestick", "Electronics", 39.99, 1000),
    ("Mixer", "Kitchen", 79.99, 100);