const express = require("express");
const { body, validationResult } = require('express-validator');
const path = require('path');
const mysql = require("mysql2");

const app = express();
const PORT = 3307;

app.use("/", express.static("./website"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MySQL Connection (MAMP default)
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "codequest",
    port: 3306,
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'html', 'index.html'));
});

// Form validation and redirect to quiz
app.post('/submit-form', [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must contain only letters and spaces'),

    body('age')
        .notEmpty().withMessage('Age is required')
        .isDate().withMessage('Age must be a valid date')
        .custom((value) => {
            const ageDate = new Date(value);
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate());
            if (ageDate > minDate) {
                throw new Error('You must be at least 4 years old.');
            }
            return true;
        }),

    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .matches(/^05\d{8}$/).withMessage('Phone number must start with 05 and be 10 digits long'),

    body('level')
        .notEmpty().withMessage('Level is required')
        .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Save user info into the database
    const { name, age, phone, level } = req.body;
    const sql = `INSERT INTO user (name, age, phone, level) VALUES (?, ?, ?, ?)`;
    const values = [name, age, phone, level];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving user data to database:', err);
            return res.status(500).send('Database error.');
        }

        // After saving user info, redirect to quiz page
        res.sendFile(path.join(__dirname, 'website', 'html', 'Quiz.html'));
    });
});

app.post('/submit-score', (req, res) => {
    const { phone, score } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    if (!Number.isInteger(score) || score < 0 || score > 100) {
        return res.status(400).json({ error: 'Invalid score value.' });
    }

    const sql = `UPDATE user SET score = ? WHERE phone = ?`;
    const values = [score, phone];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating score:', err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.json({ success: true });
    });
});

// Fetch user info by phone number
app.get('/user-info', (req, res) => {
    const phone = req.query.phone;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    const sql = 'SELECT * FROM user WHERE phone = ?';

    pool.query(sql, [phone], (err, results) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = results[0];

        // HTML page to display user data
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>User Information</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; background-color: #161b22; color: white; }
                    h1 { text-align: center; color: #a855f7; }
                    .info { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #1f2937; }
                    p { font-size: 1.2em; color: #a855f7; }
                    button {
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 1em;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        background-color: #a855f7;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <h1>User Information</h1>
                <div class="info">
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Age:</strong> ${user.age}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Level:</strong> ${user.level}</p>
                    <p><strong>Score:</strong> ${user.score !== null ? user.score : 'Not yet submitted'}</p>
                    <button onclick="window.location.href='/'">Back to Home</button>
                </div>
            </body>
            </html>
        `;

        res.send(html);
    });
});


app.post('/submit-contact', [
    body('first-name')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must only contain letters and spaces'),

    body('last-name')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Last name must only contain letters and spaces'),

    body('gender')
        .trim()
        .notEmpty().withMessage('Gender is required')
        .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
        .isIn(['Male', 'Female']).withMessage('Invalid gender'),

    body('telephone')
        .notEmpty().withMessage('Telephone is required')
        .matches(/^05\d{8}$/).withMessage('Telephone must start with 05 and be 10 digits long'),

    body('date-of-birth')
        .notEmpty().withMessage('Date of birth is required')
        .isDate().withMessage('Date of birth must be a valid date'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('language')
        .notEmpty().withMessage('Language is required'),

    body('message')
        .optional()
        .isLength({ max: 1000 }).withMessage('Message must be less than 1000 characters')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If no validation errors, continue saving
    const {
        ['first-name']: firstName,
        ['last-name']: lastName,
        gender,
        telephone,
        ['date-of-birth']: dob,
        email,
        language,
        message
    } = req.body;

    const sql = `INSERT INTO \`contact-info\` 
        (first_name, last_name, gender, telephone, date_of_birth, email, language, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [firstName, lastName, gender, telephone, dob, email, language, message];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving to database:', err);
            return res.status(500).send('Database error.');
        }

        // After inserting, fetch the newly inserted data
        const newContactSql = `SELECT * FROM \`contact-info\` WHERE telephone = ?`;
        pool.query(newContactSql, [telephone], (err, rows) => {
            if (err) {
                console.error('Error fetching saved contact data:', err);
                return res.status(500).send('Error fetching data.');
            }

            const contact = rows[0];
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Contact Information Saved</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; background-color: #161b22 }
                    h1 { text-align: center; color: #a855f7 }
                    h2 { text-align: center; color: #a855f7; margin-top: 10px; }
                    .info { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
                    p { font-size: 1.2em;color: #a855f7 }
                    button {
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 1em;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        background-color: #a855f7;
                        color: white
                    }
                </style>
            </head>
            <body>
                <h1>Contact Information Saved</h1>
                <h2>Thank you for contacting us!</h2>
                <div class="info">
                    <p><strong>First Name:</strong> ${contact.first_name}</p>
                    <p><strong>Last Name:</strong> ${contact.last_name}</p>
                    <p><strong>Gender:</strong> ${contact.gender}</p>
                    <p><strong>Telephone:</strong> ${contact.telephone}</p>
                    <p><strong>Date of Birth:</strong> ${contact.date_of_birth}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Language:</strong> ${contact.language}</p>
                    <p><strong>Message:</strong> ${contact.message}</p>
                    <button onclick="window.location.href='/'">Back to Home</button>
                </div>
            </body>
            </html>
        `;

            res.send(html);
        });
    });
});


// Serve other quiz pages
app.get('/P4.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'html', 'P4.html'));
});

app.get('/Quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'html', 'Quiz.html'));
});

app.get('/IntermediateQuiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'html', 'IntermediateQuiz.html'));
});

app.get('/AdvancedQuiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'html', 'AdvancedQuiz.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
