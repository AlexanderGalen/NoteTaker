const notes = require("express").Router();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(process.cwd(), "db", "db.json");

// set up get route for notes api
notes.get("/", (req, res) => {
    console.log("get reqeust to notes successful")
    // read from db.json and return that as json
    fs.readFile(dbPath, (err, data) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json(JSON.parse(data));
        }
    })
});

notes.post("/", (req, res) => {
    console.log("post request to notes recieved");
    console.log(req.body);
    res.status(200).send("successfully added note")
})

// set up post route for notes api

module.exports = notes;