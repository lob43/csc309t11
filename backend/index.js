const express = require("express");
const routes = require("./routes");
const cors = require("cors");

require("dotenv").config();

const app = express();

const FRONTEND_URL =process.env.FRONTEND_URL || "http://localhost:5173";

console.log(FRONTEND_URL)

app.use(cors({origin:FRONTEND_URL}));
app.use(express.json());
app.use('', routes);

module.exports = app;