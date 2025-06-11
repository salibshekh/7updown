const express = require("express");
require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");

const { errorResponse } = require("./utils/responseHelper");

const app = express();

const { pool } = require("./configuration/dbConfig");


app.use(cors());           
app.use(helmet());         
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const indexRoutes = require("./routes/indexRoute");
app.use("/api/v1", indexRoutes);


pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("MySQL pool initialized");
    connection.release();
  }
});


app.use((err, req, res, next) => {
  console.error("Uncaught Error:", err.stack);
  return errorResponse(res, err.message || "Something went wrong!", 500, err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
