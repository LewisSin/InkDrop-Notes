const express = require("express");
const pathUtil = require("path");
const defaultPort = process.env.PORT || 3001;
const noteApp = express();
const noteRoutes = require("./routes/apiRoutes");

// Parse JSON and urlencoded request bodies
noteApp.use(express.json());
noteApp.use(express.urlencoded({ extended: true }));

// Serve files from the 'public' directory
noteApp.use(express.static("public"));

// Landing page route
noteApp.get("/", (req, res) => {
    res.sendFile(pathUtil.join(__dirname, "/public/index.html"));
});

// Notes page route
noteApp.get("/notes", (req, res) => {
    res.sendFile(pathUtil.join(__dirname, "/public/notes.html"));
});

// Use the API routes for notes
noteApp.use("/api/notes", noteRoutes);

// Launch the server
noteApp.listen(defaultPort, () => {
    console.log(`Note Taker app now live at http://localhost:${defaultPort}`);
});
