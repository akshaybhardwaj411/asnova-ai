// ========================================
// FLASHCARD DATA
// ========================================

let flashcards = [];

let currentFlashcard = 0;

// ========================================
// GENERATE FLASHCARDS
// ========================================

async function generateFlashcards() {

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

                    🎴

                </div>

                <div class="pdf-details">

                    <div class="pdf-name">

                        ${file.name}

                    </div>

                    <div class="pdf-action">

                        Generate Flashcards

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

                `${API_BASE_URL}/generate-flashcards`,

                {
                    method: "POST",

                    body: formData
                }
            );

        let data =
            await response.json();

        let aiText =
            data.flashcards ||
            data.error;

        // ========================================
        // STREAM RAW RESPONSE
        // ========================================

        streamResponse(
            aiWrapper,
            aiText
        );

        // ========================================
        // BUILD FLASHCARDS
        // ========================================

        setTimeout(() => {

            parseFlashcards(aiText);

            renderFlashcardUI();

        }, 1200);

        removeUploadedFile();
    }

    catch(error) {

    let message =
        `
        <div class="error-box">

            ❌ Flashcard generation failed.

            <br><br>

            Possible issues:

            <ul>

                <li>Invalid PDF</li>

                <li>Backend offline</li>

                <li>AI service unavailable</li>

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
// PARSE FLASHCARDS
// ========================================

function parseFlashcards(text) {

    flashcards = [];

    let blocks =
        text.split("Q:");

    blocks.forEach(block => {

        if (
            block.trim() === ""
        ) return;

        let parts =
            block.split("A:");

        if (
            parts.length < 2
        ) return;

        flashcards.push({

            question:
                parts[0].trim(),

            answer:
                parts[1].trim()
        });
    });

    currentFlashcard = 0;
}

// ========================================
// RENDER FLASHCARD UI
// ========================================

function renderFlashcardUI() {

    if (
        flashcards.length === 0
    ) return;

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    let wrapper =
        createMessageWrapper(
            "ai-wrapper"
        );

    wrapper.innerHTML =
        `
        <div class="avatar ai-avatar">

            ✨

        </div>

        <div class="message ai">

            <div class="flashcard-header">

                🎴 AI Flashcards

            </div>

            <div
                class="flashcard-container">

                <div
                    class="flashcard"
                    id="flashcard"
                    onclick="flipFlashcard()">

                    <div
                        class="flashcard-inner">

                        <!-- FRONT -->

                        <div
                            class="flashcard-front">

                            <div
                                class="flashcard-label">

                                Question

                            </div>

                            <div
                                class="flashcard-text"
                                id="flashcardQuestion">

                                ${flashcards[0].question}

                            </div>

                        </div>

                        <!-- BACK -->

                        <div
                            class="flashcard-back">

                            <div
                                class="flashcard-label">

                                Answer

                            </div>

                            <div
                                class="flashcard-text"
                                id="flashcardAnswer">

                                ${flashcards[0].answer}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <!-- CONTROLS -->

            <div class="flashcard-controls">

                <button
                    onclick="previousFlashcard()">

                    ⬅ Previous

                </button>

                <div
                    class="flashcard-counter"
                    id="flashcardCounter">

                    1 / ${flashcards.length}

                </div>

                <button
                    onclick="nextFlashcard()">

                    Next ➡

                </button>

            </div>

        </div>
        `;

    chatBox.appendChild(
        wrapper
    );

    scrollBottom();
}

// ========================================
// FLIP CARD
// ========================================

function flipFlashcard() {

    document
        .getElementById(
            "flashcard"
        )
        .classList
        .toggle(
            "flipped"
        );
}

// ========================================
// UPDATE CARD
// ========================================

function updateFlashcard() {

    document
        .getElementById(
            "flashcardQuestion"
        )
        .innerHTML =
        flashcards[
            currentFlashcard
        ].question;

    document
        .getElementById(
            "flashcardAnswer"
        )
        .innerHTML =
        flashcards[
            currentFlashcard
        ].answer;

    document
        .getElementById(
            "flashcardCounter"
        )
        .innerHTML =
        `
        ${currentFlashcard + 1}
        /
        ${flashcards.length}
        `;

    // RESET FLIP

    document
        .getElementById(
            "flashcard"
        )
        .classList
        .remove(
            "flipped"
        );
}

// ========================================
// NEXT CARD
// ========================================

function nextFlashcard() {

    if (
        currentFlashcard <
        flashcards.length - 1
    ) {

        currentFlashcard++;

        updateFlashcard();
    }
}

// ========================================
// PREVIOUS CARD
// ========================================

function previousFlashcard() {

    if (
        currentFlashcard > 0
    ) {

        currentFlashcard--;

        updateFlashcard();
    }
}