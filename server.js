const express = require("express");
const path = require("path");
const notesRouter = require("./routes/notes.js");
// initialize our express server
const app = express();

const PORT = process.env.PORT || 3001;

// set up middleware to allow json and urlencoded data passing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up express to deliver files from the public dir
app.use(express.static(__dirname + '/public'));

// set up our notes api route
app.use("/api/notes", notesRouter);

// set up get route for notes
app.get("/notes", (req,res) => 
    res.sendFile(path.join(__dirname, "public", "notes.html"))
);
// wildcard to send to homepage
app.get("/*", (req, res) => 
    res.sendFile(path.join(__dirname, "public", "index.html"))
);

// start listening for requrests on designated port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
