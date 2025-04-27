
document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    const form = document.querySelector(".quiz-form");
    const answerButtons = document.querySelectorAll(".answer-button");

    const correctAnswers = {
        0: "B", 1: "C", 2: "C", 3: "C", 4: "A",
        5: "C", 6: "C", 7: "C", 8: "B", 9: "A"
    };

    const userAnswers = {};

    answerButtons.forEach(button => {
        button.addEventListener("click", () => {
            const questionArticle = button.closest(".question");

            // Remove selected class from all buttons in this question
            questionArticle.querySelectorAll(".answer-button").forEach(btn => {
                btn.classList.remove("selected");
            });

            // Add selected class to clicked one
            button.classList.add("selected");

            // Save user answer
            const questionIndex = Array.from(document.querySelectorAll(".question")).indexOf(questionArticle);
            userAnswers[questionIndex] = button.value;
        });
    });

    // Reset button logic
    form.addEventListener("reset", () => {
        setTimeout(() => {
            document.querySelectorAll(".answer-button").forEach(btn => {
                btn.classList.remove("selected");
            });
            for (let key in userAnswers) delete userAnswers[key];
        }, 0);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const totalQuestions = Object.keys(correctAnswers).length;

        // Make sure all questions are answered
        if (Object.keys(userAnswers).length < totalQuestions) {
            alert("Please answer all the questions before submitting.");
            return;
        }

        const confirmSubmit = confirm("Are you sure you want to submit your answers?");
        if (!confirmSubmit) return;

        let score = 0;
        const total = Object.keys(correctAnswers).length;
        let resultHTML = `<h2 style="text-align:center;"></h2><div style="padding: 1em;">`;

        document.querySelectorAll(".question").forEach((questionEl, index) => {
            const userAnswer = userAnswers[index];
            const correct = correctAnswers[index];
            const isCorrect = userAnswer === correct;
            if (isCorrect) score++;

            resultHTML += `
            <div style="margin-bottom: 1em;">
                <p><strong>Q${index + 1}:</strong> ${questionEl.querySelector("p").textContent}</p>
                <p>Your Answer: <span style="color:${isCorrect ? 'green' : 'red'};">${userAnswer}</span></p>
                <p>Correct Answer: <span style="color:green;">${correct}</span></p>
            </div>
            <hr />
        `;
    });

    resultHTML = `<h2 style="text-align:center;">You scored ${score} out of ${total}</h2>` + resultHTML + `
    <div style="text-align:center; margin-top: 2em;">
        <button onclick="window.location.href = 'P4.html'" style="padding: 10px 20px; font-size: 1em; margin: 5px; background-color: #a855f7; color: white;">Back</button>
        <button onclick="window.location.href='/user-info?phone=${localStorage.getItem('userPhone')}'" style="padding: 10px 20px; font-size: 1em; margin: 5px; background-color: #a855f7; color: white;">Show User Data</button>
    </div>
    `;

    // Get the user's phone number from localStorage
    const phone = localStorage.getItem('userPhone');
    if (!phone) {
        alert('Phone number not found. Please try again.');
        return;
    }

    // Prepare the data
    const data = {
        phone: phone,
        score: score
    };

    // Send to server
    fetch('/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(serverResponse => {
        console.log('Score submitted successfully:', serverResponse);
        document.body.innerHTML = resultHTML;
        window.scrollTo(0, 0);
    })
    .catch((error) => {
        console.error('Error submitting score:', error);
        alert("Error submitting score.");
    });
});
});