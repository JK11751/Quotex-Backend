const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");


const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://quotex-blond.vercel.app"], 
    credentials: true,
  })
);

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

//Routes Middleware
app.use("/api/users", userRoute);

// Erro Middleware
app.use(errorHandler);

// Routes
app.get("/", (req, res) => {
  res.send("Home Pages");
});

//connect to mongoose
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
