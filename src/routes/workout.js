const { Router } = require("express");

const Workout = require("../models/workout");

const router = Router();

const idError = (id) => new Error(`Invalid object id \`${id}\``);

router.get("/", (req, res, next) => {
  Workout.find({})
    .sort({ createdAt: -1 })
    .then((docs) => res.json({ docs }))
    .catch((error) => next(error));
});

router.get("/:_id", (req, res, next) => {
  const { _id } = req.params;

  Workout.findById(_id)
    .then((workout) => workout ? res.json({ workout }) : next(idError(_id)))
    .catch((error) => next(error));
});

router.post("/", (req, res, next) => {
  Workout.create({})
    .then((workout) => res.json({ workout }))
    .catch((error) => next(error));
});

router.post("/exercise/:_id", (req, res, next) => {
  const { _id } = req.params;
  const { exercise } = req.body;

  const update = { $push: { exercises: exercise }};
  const options = { new: true };

  Workout.findByIdAndUpdate(_id, update, options)
    .then((workout) => workout ? res.json({ workout }) : next(idError(_id)))
    .catch((error) => next(error));
});

router.post("/series/:exercise_id", (req, res, next) => {
  const { exercise_id } = req.params;
  const { series } = req.body;

  const query = { "exercises._id": exercise_id };
  const update = { $push: { "exercises.$.series": series }};
  const options = { new: true };

  Workout.findOneAndUpdate(query, update, options)
    .then((workout) => workout ? res.json({ workout }) : next(idError(exercise_id)))
    .catch((error) => next(error));
});

router.delete("/:_id", (req, res, next) => {
  const { _id } = req.params;

  Workout.deleteOne({ _id })
    .then(({ deletedCount }) => res.json({ deletedCount }))
    .catch((error) => next(error));
});

router.delete("/exercise/:exercise_id", (req, res, next) => {
  const { exercise_id } = req.params;

  const query = { "exercises._id": exercise_id };
  const update = { $pull: { exercises: { _id: exercise_id }}};
  const options = { new: true };

  Workout.findOneAndUpdate(query, update, options)
    .then((workout) => workout ? res.json({ workout }) : next(idError(exercise_id)))
    .catch((error) => next(error));
});

router.delete("/series/:series_id", (req, res, next) => {
  const { series_id } = req.params;

  const query = { "exercises.series._id": series_id };
  const update = { $pull: { "exercises.$.series": { _id: series_id }}};
  const options = { new: true };

  Workout.findOneAndUpdate(query, update, options)
    .then((workout) => workout ? res.json({ workout }) : next(series_id))
    .catch((error) => next(error));
});

module.exports = router;