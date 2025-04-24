document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    const form = document.querySelector(".quiz-form");
    const answerButtons = document.querySelectorAll(".answer-button");
    const correctAnswers = {
        0: "C", 1: "C", 2: "B", 3: "B", 4: "C",
        5: "C", 6: "D", 7: "B", 8: "C", 9: "B"};

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

    // Submit logic
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const totalQuestions = Object.keys(correctAnswers).length;

    // Make sure all questions are answered.
    if (Object.keys(userAnswers).length < totalQuestions) {
        alert("Please answer all the questions before submitting.");
        return;
    }
    
        // Confirmation dialog
        const confirmSubmit = confirm("Are you sure you want to submit your answers?");
        if (!confirmSubmit) return;
        
        let score = 0;
        const total = Object.keys(correctAnswers).length;
        let resultHTML = `<h2 style="text-align:center;"></h2><div style="padding: 1em;">`;

        document.querySelectorAll(".question").forEach((questionEl, index) => {
            const userAnswer = userAnswers[index] ;
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

        resultHTML = `<h2 style="text-align:center;">You scored ${score} out of ${total}</h2>` + resultHTML + "</div>";
        document.body.innerHTML = resultHTML;
        window.scrollTo(0, 0);
    });
});
