document.addEventListener('DOMContentLoaded', () => {
    const personalInfoCard = document.getElementById('personal-info-card');
    const programmingInfoCard = document.getElementById('programming-info-card');
    const nextButton = document.getElementById('next-button');
    const personalInfoForm = document.getElementById('personal-info-form');
    const programmingInfoForm = document.getElementById('programming-info-form');

    nextButton.addEventListener('click', async () => {
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

        let backendValidated = false;

        try {
            const res = await fetch('/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    age,
                    phone,
                    language: 'Java', 
                    level: 'Beginner'
                })
            });

            if (!res.ok) {
                const data = await res.json();
                const errorMessages = data.errors.map(err => `• ${err.msg}`).join('\n');
                alert(`Backend validation failed:\n${errorMessages}`);
                return;
            }

            backendValidated = true;
        } catch (err) {
            console.warn('Backend not available. Fallback to client-side.');
            backendValidated = true;
        }

        if (backendValidated) {
            document.getElementById('hidden-name').value = name;
            document.getElementById('hidden-age').value = age;
            document.getElementById('hidden-phone').value = phone;

            personalInfoCard.style.display = 'none';
            programmingInfoCard.style.display = 'block';
        }
    });

    programmingInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // always handle with JS now

        const language = document.getElementById('language').value;
        const level = document.getElementById('level').value;

        if (!language || !level) {
            alert('Please fill out all programming preference fields.');
            return;
        }

        const name = document.getElementById('hidden-name').value;
        const age = document.getElementById('hidden-age').value;
        const phone = document.getElementById('hidden-phone').value;

        try {
            const res = await fetch('/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, phone, language, level })
            });

            if (!res.ok) {
                const data = await res.json();
                const errorMessages = data.errors.map(err => `• ${err.msg}`).join('\n');
                alert(`Backend validation failed:\n${errorMessages}`);
                return;
            }

            //  Server accepted the submission → go to quiz
            window.location.href = 'Quiz.html';

        } catch (err) {
            console.warn('Server offline. Skipping backend check.');
            // Fallback for offline mode
            window.location.href = 'Quiz.html';
        }
    });
});
