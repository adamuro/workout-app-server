const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("redis");

const User = require("../models/user");
const userValidation = require("../middleware/validation/user");
const verifyToken = require("../middleware/verifyToken");

const redisUrl = process.env.REDISCLOUD_URL;
const redisClient = redis.createClient(redisUrl, { no_ready_check: true });

const usernameUsedError = (username) => new Error(`Username already used \`${username}\``);
const loginError = () => new Error("Invalid username or password");

const router = Router();

router.post("/register", userValidation, async (req, res, next) => {
  const { username, password } = req.body;

  const { usernameUsed, error } = await User.findOne({ username })
    .then((user) => ({ usernameUsed: user !== null }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (usernameUsed) return next(usernameUsedError(username));

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = { username, password: hashedPassword };

  User.create(user)
    .then(({ _id, username }) => {
      const tokenSecret = process.env.TOKEN_SECRET;
      const token = jwt.sign({ _id, username }, tokenSecret);
      redisClient.sadd("tokens", token);
      res.json({ token });
    })
    .catch((error) => next(error));
});

router.post("/login", userValidation, async (req, res, next) => {
  const { username, password } = req.body;

  const { user, error } = await User.findOne({ username })
    .then((user) => ({ user }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (!user) return next(loginError());

  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) return next(loginError());

  const { _id } = user;
  const tokenSecret = process.env.TOKEN_SECRET;
  const token = jwt.sign({ _id, username }, tokenSecret);
  redisClient.sadd("tokens", token);
  res.json({ token });
});

router.delete("/", verifyToken, async (req, res, next) => {
  const { _id } = req.user;

  User.deleteOne({ _id })
    .then(({ deletedCount }) => res.json({ deletedCount }))
    .catch((error) => next(error));
});

router.delete("/logout", verifyToken, async (req, res, next) => {
  const { token } = req;

  redisClient.srem("tokens", token);
  res.json({ message: "Success" });
});

module.exports = router;