async function loadQuiz() {
    const quizContainer = document.getElementById("quizContainer");

    // Fetch quiz questions
    const response = await fetch("https://fwd-tastequest.onrender.com/quiz");
    const questions = await response.json();

    // Render questions
    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question";

        const questionText = document.createElement("p");
        questionText.textContent = `${index + 1}. ${question.question}`;
        questionDiv.appendChild(questionText);
        const optionsList = document.createElement("ul");
        optionsList.style.paddingLeft = "20px"; // Indent options

        question.options.forEach((option, optIndex) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `question${index}`;
            radio.value = optIndex;

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement("br"));
        });

        quizContainer.appendChild(questionDiv);
    });
}

document.getElementById("submitQuiz").addEventListener("click", async () => {
    const answers = [];
    const questions = document.querySelectorAll(".question");

    questions.forEach((_, index) => {
        const selectedOption = document.querySelector(`input[name='question${index}']:checked`);
        answers.push(selectedOption ? parseInt(selectedOption.value) : -1);
    });

    const userEmail = prompt("Enter your email to submit the quiz:");
    const response = await fetch("https://fwd-tastequest.onrender.com/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, answers }),
    });

    const result = await response.json();
    document.getElementById("quizResult").textContent = `Quiz submitted! Your score: ${result.score}/10`;
});

loadQuiz();
