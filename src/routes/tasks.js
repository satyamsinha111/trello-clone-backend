const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const { connection } = require("../db");
router.use(auth.jwt_decode);

router.post("/task/:projectId", (req, res) => {
  let projectId = req.params.projectId;
  let values = [req.body.task_name, req.body.task_desc, projectId];
  connection.query(
    "INSERT INTO Tasks (TaskName,TaskDesc,ProjectID) VALUES (?)",
    [values],
    (err, row, fields) => {
      if (err) {
        throw err;
      } else {
        return res.status(201).json({
          message: "Task created successfully",
        });
      }
    }
  );
});

router.put("/task/:taskId", (req, res) => {
  connection.query(
    `UPDATE Tasks SET TaskName='${req.body.task_name}',TaskDesc='${req.body.task_desc}' WHERE TaskID=${req.params.taskId}`,
    (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json({
          message: "Task updated successfully",
        });
      }
    }
  );
});

router.delete("/task/:taskId", (req, res) => {
  connection.query(
    `DELETE FROM Tasks WHERE TaskID=${req.params.taskId}`,
    (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json({
          message: "Task deleted",
        });
      }
    }
  );
});

router.get("/task/:taskId/:status", (req, res) => {
  let status = req.params.status;
  let taskId = req.params.taskId;
  connection.query(
    `UPDATE Tasks SET TaskStatus=${status} WHERE TaskID=${taskId}`,
    (err, row, fields) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json({
          message: "Status updated successfully",
        });
      }
    }
  );
});

router.get("/task/:projectId", (req, res) => {
  let projectId = req.params.projectId;
  connection.query(
    `SELECT * FROM Tasks WHERE ProjectID='${projectId}'`,
    (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json(rows);
      }
    }
  );
});

module.exports = router;
