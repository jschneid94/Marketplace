# Marketplace

Marketplace, also known as Bamazon, is an Amazon-like storefront terminal app built using Node.js and SQL.

## Getting Started

To run this app, you will need clone this repository and set up a locally hosted MysQL database. Use bamazon_schema to create your tables and bamazon_seeds to insert the values into the table. 

You may also want to add a password and if necessary change the host, port or user values in each of the javascript files.

```
var connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user: 'root',
password: '**Password**',
database: 'bamazon'
});
```

### Prerequisites

To run this program, you will need to have Node.js and MySQL installed. This app also requires the mysql, inquirer, and console.table package modules. These can be installed by using the dependencies in the package file:

```
npm install
```

or by installing the modules individually:

```
npm install mysql
npm install inquirer
npm install console.table

```

## Going to the Marketplace

### Bamazon Customer

The customer facing version of this app that allows a user to view available items in the store and purchase them. The app can be run using the following command in your bash terminal:

```
node bamazonCustomer.js
```

![Bamazon Marketplace Customer](./images/bamazonCustomer.png)

Bamazon Customer has only function, which is to order an item on the market. Selecting order will prompt the user to select the ID of the item they wish to purchase and choose how many units they wish to buy. Finally, they will be asked to confirm their order, and upon ordering they will see their purchase total.


### Bamazon Manager

The first of two internal Bamazon apps, Bamazon Manager allows the user to keep inventory of the market and add more stock or items in the store. It is run using the following command:

```
node bamazonManager.js
```

This app has four primary functions:

##### View Products For Sale

* Lists all available items in the store, much like in the Customer app, but with an additional column for quantity. 

##### View Low Inventory

* Lists all items with an inventory lower than 10.

![Bamazon Manager Low Inventory List](./images/bamazonManager1.png)

##### Add To Inventory

* Prompts the user to select an item in the marketplace and increase its quantity by a certain amount.

##### Add New Product

* Prompts the user to add an item to the marketplace. Users are asked to enter the product's name, department, price, and quantity, followed by a confirmation prompt.

![Bamazon Manager Add New Prodcut](./images/bamazonManager2.png)

### Bamazon Supervisor

The second internal Bamazon app that references a second data set for the marketplace's departments. This app can be run using the following command:

```
node BamazonSupervisor.js
```

Bamazon Supervisor has two commands:

##### View Product By Sales Department

* Lists departments in the marketplace that also have items stocked in that department. *Note* - The final column, Total Profit, is not a stored value and is created on the fly within the app by substracting the overhead costs from the department's combined sales. 

![Bamazon Supervisor View Departments](./images/bamazonSupervisor.png)

##### Create New Department

* Prompts the user to create a new department by entering its name and its overhead cost.

