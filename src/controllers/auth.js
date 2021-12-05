const jwt = require("jsonwebtoken");
const salt_rounds = 10;
const bcrypt = require("bcrypt");
const { connection } = require("../db");

exports.login = (req, res) => {
  let email = req.body.email;
  let plain_password = req.body.password;
  let sql = `SELECT * FROM Users WHERE Email='${email}'`;

  connection.query(sql, (err, results, fields) => {
    if (err) {
      throw err;
    } else {
      console.log(plain_password, results[0].PasswordHash);
      let is_password_matching = bcrypt.compareSync(
        plain_password,
        results[0].PasswordHash
      );
      if (is_password_matching) {
        let token = jwt.sign(
          {
            email: results[0].Email,
            name: results[0].UserName,
          },
          "secret"
        );
        return res.status(200).json({
          message: "Logged in successfully",
          token: token,
        });
      } else {
        return res.status(200).json({
          message: "Incorrect username or password",
        });
      }
    }
  });
  // let is_password_matching = bcrypt.compareSync(plain_password,"")
};

exports.register = (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let pass_hash = bcrypt.hashSync(password, salt_rounds);
  let sql = "INSERT INTO Users(UserName,Email,PasswordHash) VALUES (?)";
  let values = [username, email, pass_hash];
  connection.query(sql, [values], (err, result, fields) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      return res.status(200).json({
        message: "Registered successfully",
      });
    }
  });
};
