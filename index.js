const express = require("express");
const app = express();
const fs = require('fs');

app.use(express.json());

// error handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Something went wrong!");
});

// validate name
const checkName = (req,res,next) => {
    const {firstName,lastName} = req.body;
    // Validate first name and last name
    const capitalizeFirstLetter = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
    const validate = (name) => {
        return name === capitalizeFirstLetter(name);
    };
    if (!validate(firstName)) {
        return res.status(400).json({ error: 'First name start with a capital letter.' });
    }
    if (!validate(lastName)) {
        return res.status(400).json({ error: 'Last name start with a capital letter.' });
    }
    next();
}

// password 
const checkPassword = (req,res,next) => {
    const {password} = req.body;
    const validatePassword = (password) => {
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const hasUpperCase = /[A-Z]+/.test(password);
        const hasNumber = /[0-9]+/.test(password);
        const isLengthValid = password.length >= 8;
        
        return hasSpecialChar && hasUpperCase && hasNumber && isLengthValid;
    };
    
    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password must contain at least one special character, one uppercase letter, one numeric character, and be at least 8 characters long.' });
    }
    next();
}

const checkEmail = (req,res,next) => {
    const {email} = req.body;

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }
    next();
}

const checkPhoneNumber = (req,res,next) => {
    const {phoneNumber} = req.body;

    if (phoneNumber.length < 10) {
        return res.status(400).json({ error: 'Phone number must have a minimum length of 10 digits.' });
    }
    next();
}


app.post("/userRegister",checkName,checkPassword,checkEmail,checkPhoneNumber, (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    // Create dataToAppend object
    const dataToAppend = { firstName, lastName, email, password, phoneNumber };

    fs.appendFile("UserData.txt", JSON.stringify(dataToAppend) + "\n", (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error happend while appending data into file.");
        }
        console.log("User registered successfully!");
        return res.status(200).json({ message: 'User registered successfully!' });
    });
});

app.listen(5000, () => {
    console.log("Server running on Port 5000");
});