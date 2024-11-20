const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landingv2.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Dynamically import the 'open' module and use it
    const { default: open } = await import("open");
    open(`http://localhost:${PORT}`);
});
