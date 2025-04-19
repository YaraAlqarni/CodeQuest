const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'P4.html'));
});


// Route to handle form submission
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

    body('language')
        .notEmpty().withMessage('Language is required')
        .isIn(['Java', 'Python']).withMessage('Invalid language'),

    body('level')
        .notEmpty().withMessage('Level is required')
        .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level')

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return all validation errors
        return res.status(400).json({ errors: errors.array() });
    }

    // If all inputs are valid
    res.send('Form submitted successfully!');
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
