const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const options = { timestamps: true };

const Series = {
  weight: Number,
  reps: Number,
};

const Exercise = {
  name: String,
  series: [Series]
};

const workoutSchema = new Schema({
  user: ObjectId,
  exercises: [Exercise]
}, options);

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;