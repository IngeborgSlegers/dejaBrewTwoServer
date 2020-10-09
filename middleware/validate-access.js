const jwt = require("jsonwebtoken");
const { User } = require("../models/indexModel");

const validateAccess = (req, res, next) => {
  const { authorization } = req.headers;
  const payload = authorization
    ? jwt.verify(
        authorization.includes("Bearer")
          ? authorization.split(" ")[1]
          : authorization,
        process.env.JWT_SECRET
      )
    : undefined;
  if (payload) {
    User.findOne({
      where: {
        id: payload.id,
        role: "admin",
      },
    }).then((user) => {
      req.user = user;
      next();
    });
  } else {
    res.status(403).json({
      message: "Forbidden",
    });
  }
};

module.exports = validateAccess;
