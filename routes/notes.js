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

// set up delete route for deleting existing notes by id
notes.delete("/:id", (req, res) => {
    // pull id from request params
    const thisId = req.params.id;
    console.log("delete request recieved for id " + thisId);
    
    // read existing notes from db file
    fs.readFile(dbPath, "utf8", (err, data) => {
        if(err) {
            console.log(err)
            return err;
        }

        let notesList = JSON.parse(data);
        let newNotesList = [];
        
        // loop through list of notes looking for the note matching this id
        for (let i = 0; i < notesList.length; i++) {
            const thisNote = notesList[i];
            if(thisNote.id !== thisId) {
                // if this note isn't the one we're deleting, add it to ournew notes

                newNotesList.push(thisNote);
            }

        }

        // once we've looped through the notes and only added notes that didn't match the id
        // compare the length of the before and after array to see if anything was deleted

        // if they're the same length, something went wrong
        if(notesList.length == newNotesList.length) {
            res.status(500).send("error, no note matched id " + thisId);
            console.log("error, no note matched id " + thisId);
        }
        else {
            console.log("removed note " + thisId);
            // write our new notes list back to file
            fs.writeFile(dbPath, JSON.stringify(newNotesList), (err) => {
                if(err) {
                    console.log(err);
                    res.status(500).send("error: " + err);
                }
                else {
                    res.status(200).send(newNotesList);
                }
            });
            
        }


    })

})

module.exports = notes;