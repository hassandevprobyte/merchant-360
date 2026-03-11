require("colors");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const bootstrap = require("./bootstrap");
const { env, corsOptions } = require("./config");
const apiRoutes = require("./routes");

bootstrap();

const app = express();

// app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(compression());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(`${env.API_VERSION}`, apiRoutes);
app.use(`${env.API_VERSION}/auth`, require("./routes/authRoute"));

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
