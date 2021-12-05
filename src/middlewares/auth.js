let jwt = require("jsonwebtoken");

exports.jwt_decode = (req, res, next) => {
  let decoded = jwt.verify(req.headers.token, "secret");
  console.log("Decoded token", decoded);
  req.user = decoded;
  next();
};
