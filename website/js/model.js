
document.addEventListener('DOMContentLoaded', () => {
    const personalInfoCard = document.getElementById('personal-info-card');
    const programmingInfoCard = document.getElementById('programming-info-card');
    const nextButton = document.getElementById('next-button');
    const personalInfoForm = document.getElementById('personal-info-form');
    const programmingInfoForm = document.getElementById('programming-info-form');

    nextButton.addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value.trim();

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
            alert('Name should only contain letters and spaces.');
            return;
        }

        if (!name || !age || !phone) {
            alert('Please fill out all personal information fields.');
            return;
        }

        const ageDate = new Date(age);
        const currentDate = new Date();
        const minAgeDate = new Date(currentDate.getFullYear() - 4, currentDate.getMonth(), currentDate.getDate());
        if (ageDate > minAgeDate) {
            alert('You must be at least 4 years old.');
            return;
        }

        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(phone)) {
            alert('Phone number must start with 05 and be followed by 8 digits.');
            return;
        }

        // Save personal info for later use
        document.getElementById('hidden-name').value = name;
        document.getElementById('hidden-age').value = age;
        document.getElementById('hidden-phone').value = phone;
        localStorage.setItem('userPhone', phone);

        // Hide personal info card and show programming info card
        personalInfoCard.style.display = 'none';
        programmingInfoCard.style.display = 'block';
    });

    programmingInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission to handle via JS

        const level = document.getElementById('level').value;
        const name = document.getElementById('hidden-name').value;
        const age = document.getElementById('hidden-age').value;
        const phone = document.getElementById('hidden-phone').value;

        // Level validation happens here
        if (!level) {
            alert('Please select a programming level.');
            return;  // Prevent form submission if level is not selected
        }

        // Proceed with backend validation and submission
        try {
            // Send both personal info and programming info with level included
            const res = await fetch('/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, phone, language: 'Java', level })
            });

            if (!res.ok) {
                const data = await res.json();
                const errorMessages = data.errors.map(err => `• ${err.msg}`).join('\n');
                alert(`Backend validation failed:\n${errorMessages}`);
                return;
            }
        } catch (err) {
            console.warn('Server offline. Skipping backend check.');
        }

        // Redirect based on selected level
        if (level === 'Beginner') {
            window.location.href = 'Quiz.html';
        } else if (level === 'Intermediate') {
            window.location.href = 'IntermediateQuiz.html';
        } else if (level === 'Advanced') {
            window.location.href = 'AdvancedQuiz.html';
        }
    });
});
