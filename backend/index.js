const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config"); // Import database configuration

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views folder is correctly resolved
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
// Home route (login page)
app.get("/", (req, res) => {
    res.render("login");
});

// Sign-up page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Sign-up route
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.status(400).send("User name already exists. Please enter a different name");
        }

        // Hash password and save user
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new collection({ name: username, password: hashedPassword });
        await newUser.save();

        console.log("User registered:", newUser);
        res.redirect("/"); // Redirect to login page after successful registration
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            return res.json({ success: true }); // Login successful
        } else {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



// Start server
const PORT = 4000; // Use port 5000 for consistency
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
