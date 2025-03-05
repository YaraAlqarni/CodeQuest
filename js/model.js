document.addEventListener('DOMContentLoaded', () => {
    const personalInfoCard = document.getElementById('personal-info-card');
    const programmingInfoCard = document.getElementById('programming-info-card');
    const nextButton = document.getElementById('next-button');
    const personalInfoForm = document.getElementById('personal-info-form');
    const programmingInfoForm = document.getElementById('programming-info-form');

    
    nextButton.addEventListener('click', () => {
       
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value;

        if (!name || !age || !phone) {
            alert('Please fill out all personal information fields.');
            return;
        }

       
        const phoneRegex = /^\d{10}$/; 
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

      
        personalInfoCard.style.display = 'none';
        programmingInfoCard.style.display = 'block';
    });

   
    programmingInfoForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const language = document.getElementById('language').value;
        const level = document.getElementById('level').value;

        if (!language || !level) {
            alert('Please fill out all programming preference fields.');
            return;
        }

        window.location.href = 'Quiz.html';
    });
});