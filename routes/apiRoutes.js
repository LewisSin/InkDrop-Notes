const dbPath = "./db/db.json"; // Path to the JSON database for easier reference
const fs = require("fs");
const fsPromises = fs.promises; // Utilize promises for file system operations
const generateUniqueId = require("generate-unique-id");
const expressRouter = require("express").Router();

// Route to retrieve notes
expressRouter.get("/", async (req, res) => {
    console.info(`${req.method} request received for notes`);
    try {
        const data = await fsPromises.readFile(dbPath, "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error reading from db.json:", error);
        res.status(500).send("Error reading note data.");
    }
});

// Route to add a new note
expressRouter.post("/", async (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = { title, text, id: generateUniqueId() };
        try {
            const data = await fsPromises.readFile(dbPath, "utf8");
            const notes = JSON.parse(data);
            notes.push(newNote);
            await fsPromises.writeFile(dbPath, JSON.stringify(notes, null, 4));
            res.json(newNote);
        } catch (error) {
            console.error("Error writing new note:", error);
            res.status(500).send("Error saving new note.");
        }
    } else {
        res.status(400).send("Please provide both a title and text for the note.");
    }
});

// Route to delete a note
expressRouter.delete("/:id", async (req, res) => {
    const noteId = req.params.id;
    try {
        const data = await fsPromises.readFile(dbPath, "utf8");
        const notes = JSON.parse(data);
        const filteredNotes = notes.filter((note) => note.id !== noteId);
        await fsPromises.writeFile(dbPath, JSON.stringify(filteredNotes, null, 4));
        res.json({ message: `Note with id ${noteId} has been deleted.` });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).send(`Error deleting note with id ${noteId}.`);
    }
});

module.exports = expressRouter;
