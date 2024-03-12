const pathToDatabase = "./db/db.json"; // Updated path variable for clarity
const fileSystem = require("fs").promises; // Direct import of promises from 'fs'
const createUniqueID = require("generate-unique-id"); // Slightly changed naming
const router = require("express").Router(); // Renamed for simplicity

// Fetch all notes
router.get("/", async (request, response) => {
    console.info(`Received ${request.method} request for notes`);
    try {
        const notesData = await fileSystem.readFile(pathToDatabase, "utf8");
        response.json(JSON.parse(notesData));
    } catch (error) {
        console.error("Failed to read notes from database:", error);
        response.status(500).send("Failed to retrieve notes.");
    }
});

// Create a new note
router.post("/", async (request, response) => {
    const { title, text } = request.body;
    if (title && text) {
        const note = { title, text, id: createUniqueID() };
        try {
            const notesData = await fileSystem.readFile(pathToDatabase, "utf8");
            const notes = JSON.parse(notesData);
            notes.push(note);
            await fileSystem.writeFile(pathToDatabase, JSON.stringify(notes, null, 4));
            response.json(note);
        } catch (error) {
            console.error("Failed to save the note:", error);
            response.status(500).send("Failed to save the note.");
        }
    } else {
        response.status(400).send("Both title and text are required to create a note.");
    }
});

// Delete a note by ID
router.delete("/:id", async (request, response) => {
    const { id } = request.params;
    try {
        const notesData = await fileSystem.readFile(pathToDatabase, "utf8");
        const notes = JSON.parse(notesData);
        const remainingNotes = notes.filter(note => note.id !== id);
        await fileSystem.writeFile(pathToDatabase, JSON.stringify(remainingNotes, null, 4));
        response.json({ message: `Note ${id} has been removed.` });
    } catch (error) {
        console.error("Failed to delete the note:", error);
        response.status(500).send(`Could not delete note with ID ${id}.`);
    }
});

module.exports = router;
