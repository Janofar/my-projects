require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(appLimiter); 

app.use(bodyParser.json());

//connect database
connectDB();

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
