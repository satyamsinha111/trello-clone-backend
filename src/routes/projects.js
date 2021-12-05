const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");

router.use(auth.jwt_decode);

router.post("/project", (req, res) => {
  console.log(req.user);
  res.send("Hello");
});

module.exports = router;
