// ========================================
// QUIZ DATA
// ========================================

let currentQuiz = [];

let currentScore = 0;

// ========================================
// GENERATE QUIZ
// ========================================

async function generateQuiz() {

    let pdfInput =
        document.getElementById(
            "pdfFile"
        );

    let file =
        pdfInput.files[0];

    // NO FILE

    if (!file) {

        alert(
            "Please upload a PDF first."
        );

        return;
    }

    // HIDE WELCOME

    document.getElementById(
        "welcomeScreen"
    ).style.display =
        "none";

    // CHAT BOX

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    // ========================================
    // USER MESSAGE
    // ========================================

    let userWrapper =
        createMessageWrapper(
            "user-wrapper"
        );

    userWrapper.innerHTML =
        `
        <div class="avatar user-avatar">

            👤

        </div>

        <div class="message user">

            <div class="pdf-upload-card">

                <div class="pdf-icon">

                    🧠

                </div>

                <div class="pdf-details">

                    <div class="pdf-name">

                        ${file.name}

                    </div>

                    <div class="pdf-action">

                        Generate Quiz

                    </div>

                </div>

            </div>

        </div>
        `;

    chatBox.appendChild(
        userWrapper
    );

    // ========================================
    // AI LOADING
    // ========================================

    let aiWrapper =
        createAIMessage();

    chatBox.appendChild(
        aiWrapper
    );

    scrollBottom();

    // ========================================
    // FORM DATA
    // ========================================

    let formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    try {

        // ========================================
        // API CALL
        // ========================================

        let response =
            await fetch(

                `${API_BASE_URL}/generate-quiz`,

                {
                    method: "POST",

                    body: formData
                }
            );

        let data =
            await response.json();

        let aiText =
            data.quiz ||
            data.error;

        // ========================================
        // STREAM RAW QUIZ
        // ========================================

        streamResponse(
            aiWrapper,
            aiText
        );

        // ========================================
        // BUILD INTERACTIVE QUIZ
        // ========================================

        setTimeout(() => {

            renderQuizUI(aiText);

        }, 1200);

        removeUploadedFile();
    }

    catch(error) {

    let message =
        `
        <div class="error-box">

            ❌ Quiz generation failed.

            <br><br>

            Try:

            <ul>

                <li>Using a smaller PDF</li>

                <li>Checking backend connection</li>

                <li>Trying again later</li>

            </ul>

        </div>
        `;

    aiWrapper.querySelector(
        ".message.ai"
    ).innerHTML =
        message;
}
}

// ========================================
// PARSE QUIZ
// ========================================

function parseQuiz(text) {

    let blocks =
        text.split("Question");

    currentQuiz = [];

    blocks.forEach(block => {

        if (
            block.trim() === ""
        ) return;

        let lines =
            block
            .split("\n")
            .filter(
                line =>
                line.trim() !== ""
            );

        let question =
            lines[0] || "";

        let options =
            [];

        let answer = "";

        lines.forEach(line => {

            if (
                line.startsWith("A)") ||
                line.startsWith("B)") ||
                line.startsWith("C)") ||
                line.startsWith("D)")
            ) {

                options.push(line);
            }

            if (
                line
                .toLowerCase()
                .includes(
                    "correct answer"
                )
            ) {

                answer =
                    line
                    .split(":")[1]
                    ?.trim();
            }
        });

        currentQuiz.push({

            question,
            options,
            answer
        });
    });
}

// ========================================
// RENDER QUIZ
// ========================================

function renderQuizUI(text) {

    parseQuiz(text);

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    let wrapper =
        createMessageWrapper(
            "ai-wrapper"
        );

    let html = `
    <div class="avatar ai-avatar">

        ✨

    </div>

    <div class="message ai">

        <div class="quiz-header">

            🧠 Interactive Quiz

        </div>
    `;

    currentQuiz.forEach(

        (quiz, index) => {

            html +=
            `
            <div class="quiz-card">

                <div class="quiz-question">

                    ${index + 1}.
                    ${quiz.question}

                </div>

                <div class="quiz-options">
            `;

            quiz.options.forEach(option => {

                html +=
                `
                <button
                    class="quiz-option"
                    onclick="checkAnswer(this,
                    '${quiz.answer}')">

                    ${option}

                </button>
                `;
            });

            html +=
            `
                </div>

                <div class="quiz-answer">

                </div>

            </div>
            `;
        }
    );

    html +=
    `
        <div class="quiz-score"
             id="quizScore">

            Score: 0

        </div>

    </div>
    `;

    wrapper.innerHTML = html;

    chatBox.appendChild(
        wrapper
    );

    scrollBottom();
}

// ========================================
// CHECK ANSWER
// ========================================

function checkAnswer(
    button,
    correctAnswer
) {

    let options =
        button.parentElement
        .querySelectorAll(
            ".quiz-option"
        );

    // DISABLE

    options.forEach(option => {

        option.disabled = true;
    });

    // ANSWER BOX

    let answerBox =
        button.parentElement
        .nextElementSibling;

    // CORRECT

    if (
        button.innerText.includes(
            correctAnswer
        )
    ) {

        button.classList.add(
            "correct-answer"
        );

        currentScore++;

        answerBox.innerHTML =
            `
            ✅ Correct
            `;
    }

    // WRONG

    else {

        button.classList.add(
            "wrong-answer"
        );

        answerBox.innerHTML =
            `
            ❌ Correct Answer:
            ${correctAnswer}
            `;

        // SHOW CORRECT

        options.forEach(option => {

            if (
                option.innerText.includes(
                    correctAnswer
                )
            ) {

                option.classList.add(
                    "correct-answer"
                );
            }
        });
    }

    // UPDATE SCORE

    document.getElementById(
        "quizScore"
    ).innerHTML =
        `
        Score: ${currentScore}
        `;
}