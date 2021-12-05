const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const { connection } = require("../db");
router.use(auth.jwt_decode);

router.post("/project", (req, res) => {
  console.log(req.user);
  connection.query(
    `SELECT * FROM Users Where Email = '${req.user.email}'`,
    (err, rows, field) => {
      if (err) {
        throw err;
      } else {
        console.log(rows[0].UserID);
        const userId = rows[0].UserID;
        let values = [req.body.proj_name, req.body.proj_desc];
        connection.query(
          "INSERT INTO Projects (ProjectName,ProjectDesc) VALUES(?)",
          [values],
          (err, rows, fields) => {
            if (err) {
              throw err;
            } else {
              //   console.log(rows, fields);
              let values = [rows.insertId, undefined, userId];
              connection.query(
                "INSERT INTO ProjectTaskUserMapping (ProjectID,TaskID,UserID) VALUES (?)",
                [values],
                (err, rows, fields) => {
                  if (err) {
                    throw err;
                  } else {
                    console.log(rows);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
  res.send("Hello");
});

module.exports = router;
