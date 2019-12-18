const fs = require("fs");
const path = require("path");

const config = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});
