const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const userRouter = require("./routes/user");
const workoutRouter = require("./routes/workout");
const { notFound, errorHandler } = require("./middleware/error");
const verifyToken = require("./middleware/verifyToken");

//Connect to database
const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbURI = process.env.DATABASE_URI.replace("<USERNAME>", dbUsername).replace("<PASSWORD>", dbPassword);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const app = express();

//Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan("common"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

//Routes
app.get("/", (req, res) => res.json("Hello"));
app.use("/workout", verifyToken, workoutRouter);
app.use("/user", userRouter);

//Error handling
app.use(notFound);
app.use(errorHandler);

//Listen
const port = process.env.PORT || 2137;
app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
