const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "https://accredian-backend-task-9ts1.onrender.com",
    "https://accredian-backend-task-9ts1.onrender.com/api/referals",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "working!!" });
});

app.use("/api", require("./routes/api.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
