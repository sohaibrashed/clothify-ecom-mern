require("dotenv").config();
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");
const sanitize = require("express-mongo-sanitize");
// const xss = require("xss");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const categoryRouter = require("./routes/category");
const brandRouter = require("./routes/brand");
const reviewRouter = require("./routes/review");
const favoriteRouter = require("./routes/favorite");
const dashboardRouter = require("./routes/dashboard");
const otpRouter = require("./routes/OTP");
const uploadRouter = require("./routes/upload");
const recaptchaRouter = require("./routes/recaptcha");
const paymentRouter = require("./routes/payment");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  console.info(`Node Env: ${process.env.NODE_ENV}`);
  app.use(morgan("dev"));
}

app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   message: "Too many requests, please try again later.",
// });

// app.use("/api", limiter);

app.use(cookieParser());
app.use(helmet());
app.use(sanitize());
app.use(hpp());
// app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/recaptcha", recaptchaRouter);
app.use("/api/v1/payments", paymentRouter);

app.all("*", (req, res, next) => {
  next(new Error(`this ${req.path} URL, NOT FOUND`));
});

app.use(errorHandler);

module.exports = app;
