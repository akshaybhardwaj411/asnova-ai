// ========================================
// PDF SUMMARY SYSTEM
// ========================================

async function summarizePDF() {

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

                    📄

                </div>

                <div class="pdf-details">

                    <div class="pdf-name">

                        ${file.name}

                    </div>

                    <div class="pdf-action">

                        Summarize this PDF

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

                `${API_BASE_URL}/upload-pdf`,

                {
                    method: "POST",

                    body: formData
                }
            );

        let data =
            await response.json();

        let aiText =
            data.summary ||
            data.error;

        // ========================================
        // STREAM RESPONSE
        // ========================================

        streamResponse(
            aiWrapper,
            aiText
        );

        // ========================================
        // AUTO CLEAR PDF
        // ========================================

        removeUploadedFile();
    }

    catch(error) {

    let message =
        `
        <div class="error-box">

            ❌ PDF summarization failed.

            <br><br>

            Possible reasons:

            <ul>

                <li>Large PDF upload</li>

                <li>Corrupted PDF</li>

                <li>Backend unavailable</li>

                <li>AI quota exceeded</li>

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
// AUTO PDF UPLOAD LISTENER
// ========================================

document
    .getElementById(
        "pdfFile"
    )
    .addEventListener(

        "change",

        function(event) {

            let file =
                event.target.files[0];

            if (!file) return;

            let preview =
                document.getElementById(
                    "uploadPreview"
                );

            preview.innerHTML =
                `
                <div class="file-chip">

                    📄 ${file.name}

                    <button
                        onclick="removeUploadedFile()">

                        ✕

                    </button>

                    <button
                        class="analyze-pdf-btn"
                        onclick="summarizePDF()">

                        Summarize

                    </button>

                </div>
                `;
        }
    );