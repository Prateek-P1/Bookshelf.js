// database.js
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Login-tut", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.error("Database Connection Failed", err);
});

// Define User Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Create User Collection
const collection = mongoose.model("users", Loginschema);

module.exports = collection;
