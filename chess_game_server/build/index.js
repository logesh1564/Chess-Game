"use strict";
const express = require("express");
const app = express();
app.use("/", () => {
    console.log("reaching home Route");
});
app.listen("1564", () => {
    console.log("app started");
});
