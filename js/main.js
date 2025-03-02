// script.js

// Get the cards and buttons
const languageCard = document.getElementById('language-card');
const levelCard = document.getElementById('level-card');
const languageButtons = document.querySelectorAll('.language-button');
const levelButtons = document.querySelectorAll('.level-button');
const selectedLanguageInput = document.getElementById('selected-language');

// Add event listeners to language buttons
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Store the selected language
        selectedLanguageInput.value = button.getAttribute('data-value');

        // Hide the language card and show the level card
        languageCard.style.display = 'none';
        levelCard.style.display = 'block';
    });
});

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedLevel = button.getAttribute('data-value');

        
        if (selectedLevel === "Beginner") {
            window.location.href = "Quiz.html";
        } else if (selectedLevel === "Intermediate") {
            window.location.href = "Quiz.html";
        } else if (selectedLevel === "Advanced") {
            window.location.href = "Quiz.html";
        }
    });
});