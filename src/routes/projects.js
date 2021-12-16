const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const { connection } = require("../db");
const res = require("express/lib/response");
router.use(auth.jwt_decode);
//TODO: Integrate Git Flow
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
                    return res.status(201).json({
                      message: "Project created",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
  // res.send("Hello");
});

router.get("/project", (req, res) => {
  connection.query(
    `SELECT * FROM Users Where Email = '${req.user.email}'`,
    (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        const userId = rows[0].UserID;
        connection.query(
          `SELECT Projects.ProjectID, Projects.ProjectName, Projects.ProjectDesc ,Users.UserName FROM Projects JOIN ProjectTaskUserMapping ON Projects.ProjectID = ProjectTaskUserMapping.ProjectID JOIN Users ON Users.UserID=ProjectTaskUserMapping.UserID WHERE ProjectTaskUserMapping.UserID=${userId}`,
          (err, rows, fields) => {
            if (err) {
              throw err;
            } else {
              console.log(rows);
              res.status(200).json(rows);
            }
          }
        );
      }
    }
  );
});

router.get("/project/:id", (req, res) => {
  let projectId = req.params.id;
  connection.query(
    `SELECT * FROM Users Where Email = '${req.user.email}'`,
    (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        const userId = rows[0].UserID;
        connection.query(
          `SELECT Projects.ProjectID, Projects.ProjectName, Projects.ProjectDesc ,Users.UserName FROM Projects JOIN ProjectTaskUserMapping ON Projects.ProjectID = ProjectTaskUserMapping.ProjectID JOIN Users ON Users.UserID=ProjectTaskUserMapping.UserID WHERE ProjectTaskUserMapping.UserID=${userId} && ProjectTaskUserMapping.ProjectID=${projectId}`,
          (err, rows, fields) => {
            if (err) {
              throw err;
            } else {
              console.log(rows);
              res.status(200).json(rows);
            }
          }
        );
      }
    }
  );
});

router.put("/project/:id", (req, res) => {
  let projectId = req.params.id;
  connection.query(
    `UPDATE Projects SET ProjectName='${req.body.project_name}',ProjectDesc='${req.body.project_desc}' WHERE ProjectID=${projectId}`,
    (err, rows, field) => {
      if (err) {
        throw err;
      } else {
        console.log(rows, field);
        return res.status(200).json({
          message: "Project updated successfully",
        });
      }
    }
  );
});

module.exports = router;
