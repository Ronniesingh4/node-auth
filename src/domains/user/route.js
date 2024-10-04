const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./path/to/userModel"); // Adjust the path to your User model
const router = express.Router();



// Signin
router.post("/signin", async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        // Validate input
        if (!(email && password)) {
            return res.status(400).json({ error: "Empty credentials supplied" });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Successful signin (you might want to send a token or user info)
        res.status(200).json({ message: "Signin successful", user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



// Signup
router.post("/signup", async (req, res) => {
    try {
        let { name, email, password } = req.body;

        // Trim input values
        name = name.trim();
        email = email.trim();
        password = password.trim();

        // Input validation
        if (!(name && email && password)) {
            return res.status(400).json({ error: "All fields are required." });
        } 
        if (!/^[a-zA-Z ]*$/.test(name)) {
            return res.status(400).json({ error: "Name can only contain letters and spaces." });
        }
        if (!/\S+@\S+\.\S+/.test(email)) { // Simple email validation
            return res.status(400).json({ error: "Invalid email format." });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
