const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;


app.get("/", (req, res) =>{
    res.send("hii, i am root")
});

















app.listen(8080, ()=>{
    console.log("server is started");
    
})