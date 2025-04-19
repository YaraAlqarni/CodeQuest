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

        // Frontend validation first
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

        //Backend validation 
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
                alert(`Validation failed:\n${errorMessages}`);
                return;
            }

            // Save data into hidden fields only after successful validation
            document.getElementById('hidden-name').value = name;
            document.getElementById('hidden-age').value = age;
            document.getElementById('hidden-phone').value = phone;

            //  go to the next form
            personalInfoCard.style.display = 'none';
            programmingInfoCard.style.display = 'block';

        } catch (err) {
            alert('An error occurred during validation. Please try again.');
            console.error(err);
        }
    });

    programmingInfoForm.addEventListener('submit', (e) => {
        const language = document.getElementById('language').value;
        const level = document.getElementById('level').value;

        if (!language || !level) {
            alert('Please fill out all programming preference fields.');
            return;
        }

        
    });
});
