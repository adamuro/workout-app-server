const mongoose = require("mongoose");
const { Schema } = mongoose;

const Series = {
  weight: Number,
  reps: Number,
};

const Exercise = {
  name: String,
  series: [Series]
};

const workoutSchema = new Schema(
  { exercises: [Exercise] },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;