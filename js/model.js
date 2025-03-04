document.addEventListener('DOMContentLoaded', () => {
    const personalInfoCard = document.getElementById('personal-info-card');
    const programmingInfoCard = document.getElementById('programming-info-card');
    const nextButton = document.getElementById('next-button');
    const personalInfoForm = document.getElementById('personal-info-form');
    const programmingInfoForm = document.getElementById('programming-info-form');

    // Handle "Next" button click
    nextButton.addEventListener('click', () => {
        // Validate personal info fields
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value;

        if (!name || !age || !phone) {
            alert('Please fill out all personal information fields.');
            return;
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^\d{10}$/; // Example: 10-digit phone number
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        // Hide personal info card and show programming info card
        personalInfoCard.style.display = 'none';
        programmingInfoCard.style.display = 'block';
    });

    // Handle programming info form submission
    programmingInfoForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Get form values
        const language = document.getElementById('language').value;
        const level = document.getElementById('level').value;

        // Validate inputs
        if (!language || !level) {
            alert('Please fill out all programming preference fields.');
            return;
        }

        // Redirect to Quiz.html
        window.location.href = 'Quiz.html';
    });
});