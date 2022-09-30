const notes = require("express").Router();
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require('uuid');


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

    console.log(req.body);
    // generate a unique ID for this note and make an object containing the note data
    const thisNote = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text,               
    }

    // read from db to get existing notes as an array
    fs.readFile(dbPath, "utf8", (err, data) => {
        if(err) {
            console.log(err);
        }
        else {

            let notesList = JSON.parse(data);
            
            // add our note to the end of the existing notes
            notesList.push(thisNote);

            // write our new notes list as a json string
            fs.writeFile(dbPath, JSON.stringify(notesList), (err) => {
                if(err) {
                    console.log(err);
                }
                else {
                    // once we've written our new notes, just send this note's data as a response for the front end
                    console.log("successfully added note ", thisNote);
                    res.status(200).json(thisNote);
                }
            })
            

        }
    }) 

})

// set up post route for notes api

module.exports = notes;