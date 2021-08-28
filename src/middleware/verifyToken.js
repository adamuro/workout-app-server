const jwt = require("jsonwebtoken");
const redis = require("redis");
const { promisify } = require("util");

const redisUrl = process.env.REDISCLOUD_URL;
const redisClient = redis.createClient(redisUrl, { no_ready_check: true });
redisClient.sismember = promisify(redisClient.sismember);

const tokenError = () => new Error("Token invalid or not provided");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(tokenError());

  const tokenValid = await redisClient.sismember("tokens", token);
  if (!tokenValid) return next(tokenError());

  const tokenSecret = process.env.TOKEN_SECRET;
  jwt.verify(token, tokenSecret, (error, user) => {
    if (error) return next(error);

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = verifyToken;