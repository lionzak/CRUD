require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const httpStatusText = require("./utils/http.status.text");

const url = process.env.MONGO_URL;
const port = process.env.PORT;
const path = require("path");

console.log("Connecting to MongoDB...");
async function main() {
  await mongoose.connect(url).then(() => {
    console.log("Connected to MongoDB");
  });
}

main();

const app = express();
app.use(cors());


app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

//global middleware handler for not found routes
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This Resource is not available",
  });
});

//global middleware error handler
app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ status: err.statusText || httpStatusText.ERROR, message: err.message, code: err.statusCode || 500, data: null });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
