const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(6).max(32).required(),
  password: Joi.string().min(6).max(32).required(),
});

const userValidation = (req, res, next) => {
  userSchema.validateAsync(req.body)
    .then(user => {
      req.body = user;
      next();
    })
    .catch((error) => next(error));
};

module.exports = userValidation;