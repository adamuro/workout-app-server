const jwt = require("jsonwebtoken");

const tokenError = () => new Error("Token not provided");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(tokenError);

  const tokenSecret = process.env.TOKEN_SECRET;
  jwt.verify(token, tokenSecret, (error, user) => {
    if (error) return next(error);

    req.user = user;
    next();
  });
};

module.exports = verifyToken;