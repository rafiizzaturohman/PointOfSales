# PointOfSales

## Introduction

This is a simple full stack application that can help record sales and purchases in stores. An application based on [ExpressJS](https://expressjs.com/), [PostgresQL](https://www.postgresql.org/), [EmbeddedJS or EJS](https://ejs.co/), [JQuery](https://jquery.com/) and [Node.JS](https://nodejs.org/en).

<h4>What is a Point Of Sales?</h4>

Point of Sales (POS) is a system that is used in the needs of various types of retail business to be able to facilitate the process of buying and selling transactions quickly, safely and systematically.

Client side code is written in EJS and the server API is written in ExpressJS.

## Before You Begin

* PostgresQL - Go through [PostgresQL Official Website](https://www.postgresql.org/) and proceed to their [Official Manual or Documentation](https://www.postgresql.org/docs/), which should help you understand SQL and PostgresQL better.

* ExpressJS - The best way to understand ExpressJS is through it's [Official Manual or Documentation](https://expressjs.com/), which has a [Getting Started](https://expressjs.com/en/starter/installing.html) guide, as well an [ExpressJS](https://expressjs.com/en/guide/routing.html) guide for general express topics.

* Node.JS - Start by going through [Node.JS Official Website](https://nodejs.org/en) which should get you going with the Node.JS platform.

* JQuery - You can start by going to [JQuery Official Website](https://jquery.com/) to better understand how the API can be used on the front end.

## Prerequisites

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.

* Node.JS - [Download & Install Node.JS](https://nodejs.org/en/download/current), and the npm package manager.

* PostgresQL - [Download & Install PostgresQL](https://www.postgresql.org/download/), and make sure it's running on the default port (27017).

## Technologies

Front End:
* EmbeddedJS
* HTML
* TailwindCSS
* JQuery

_Source files in ```PointOfSales/views/``` folder_

Back End:
* Node.JS
* ExpressJS
* bcrypt
* express-session

_Source files in ```PointOfSales/``` folder_

DataBase Management System (DBMS):
* PostgresQL

## Entity

### User

* Email
* Password
* Role (Administrator or Operator) 

### Customer
* Name
* Address
* Phone

## Quick Start

Open terminal to run the server

```bash
# Clone the repository
git clone https://github.com/rafiizzaturohman/PointOfSales

# Go inside the directory and install all dependencies
cd PointOfSales && npm install

# Start Server
npm start
```

This application should run on port 3009, you can access it through browser, just go to http://localhost:3009/.

## Features
* Log In and Log Out
* Password validation
* Create new account

Note: Only admins can create new accounts

* Earning and Overview Diagram
* Notifications

Note: Notifications only show if you are logged in as Admin

* Data Filter in Dashboard
    * By Start Date
    * By End Date
    * By Start Date and End Date
* Earning Monthly Report
* Earning Monthly Data Download (.csv file)
* And more.

You can check all features on my youtube channel for demo
Link: https://youtu.be/cWl0g3xPRes

## Default Account

### Admin

```
Email: admin@gmail.com
Password: 123
```

### Operator
```
Email: operator@gmail.com
Password: 1234
```

## Screenshot
<div    >
    <img widt="49%" src="./assets/images/Screenshot from 2023-07-17 05-09-18.png" />
    <img widt="49%" src="./assets/images/Screenshot from 2023-07-17 05-09-28.png" />
</div>