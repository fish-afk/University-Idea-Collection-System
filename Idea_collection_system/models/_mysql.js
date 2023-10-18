const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL_PASSWORD,
	database: "Idea_Collection_System",
});

connection.connect((err) => {
	if (err) console.log("Error connecting to sql DB ❌", err);
	else console.log("Connection to sql DB Successful! ✅");
});

module.exports = { connection };
