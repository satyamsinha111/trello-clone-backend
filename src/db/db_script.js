const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "trello_clone",
});

// connection.connect(() => {
//   console.log("Connected to db");
// });

module.exports = connection;
