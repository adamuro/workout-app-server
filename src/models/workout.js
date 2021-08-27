const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { timestamps: { updatedAt: false }};

const Series = {
  weight: Number,
  reps: Number,
};

const Exercise = {
  name: String,
  series: [Series]
};

const workoutSchema = new Schema({
  exercises: [Exercise]
}, options);

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;