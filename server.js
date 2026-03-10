require("colors");
const express = require("express");
const cors = require("cors");

const { env, corsOptions } = require("./config");

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to Merchant 360 API" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(env.PORT, () => {
  console.log(
    `Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`.bgGreen.white
      .bold,
  );
});
