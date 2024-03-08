const express = require("express");
const paths = require("path");
const serverPort = process.env.PORT || 3001;
const app = express();
const routes = require("./routes/apiRoutes");

// Middleware for parsing application/json
app.use(express.json());
// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Route to serve the landing page
app.get("/", (req, res) => {
    res.sendFile(paths.join(__dirname, "public/index.html"));
});

// Route to serve the notes page
app.get("/notes", (req, res) => {
    res.sendFile(paths.join(__dirname, "public/notes.html"));
});

// API routes for notes
app.use("/api/notes", routes);

// Starting the server
app.listen(serverPort, () => {
    console.log(`InkDrop Notes app is listening at http://localhost:${serverPort}`);
});
