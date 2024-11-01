require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();

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
