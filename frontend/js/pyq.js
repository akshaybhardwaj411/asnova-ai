// GENERATE PYQ

async function generatePYQ() {

    let file =
        document.getElementById(
            "pdfFile"
        ).files[0];

    // VALIDATION

    if (!file) {

        alert(
            "Please upload a PDF first."
        );

        return;
    }

    // OPTIONS

    let type =
        document.getElementById(
            "pyqType"
        ).value;

    let difficulty =
        document.getElementById(
            "pyqDifficulty"
        ).value;

    let count =
        document.getElementById(
            "pyqCount"
        ).value;

    // CHAT BOX

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    // LOADING

    let loading =
        document.createElement("div");

    loading.className =
        "message ai";

    loading.innerHTML =
        `
        <div class="typing-loader">

            🧪 Generating AI PYQs...

        </div>
        `;

    chatBox.appendChild(
        loading
    );

    scrollBottom();

    // FORM DATA

    let formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "type",
        type
    );

    formData.append(
        "difficulty",
        difficulty
    );

    formData.append(
        "count",
        count
    );

    try {

        // API CALL

        let response =
            await fetch(

                `${API_BASE_URL}/generate-pyq`,

                {
                    method: "POST",

                    body: formData
                }
            );

        let data =
            await response.json();

        // SUCCESS

        if (data.pyq) {

            let formatted =
                formatPYQ(
                    data.pyq
                );

            loading.innerHTML =
                `
                <div class="ai-content">

                    <strong>
                        🧪 AI PYQ Generator
                    </strong>

                    <br><br>

                    <span style="color:#38bdf8;">

                        Type:
                        ${type.toUpperCase()}

                    </span>

                    <br>

                    <span style="color:#f59e0b;">

                        Difficulty:
                        ${difficulty.toUpperCase()}

                    </span>

                    <br><br>

                    ${formatted}

                </div>

                <button
                    class="pin-btn"
                    onclick="pinNote(this)">

                    📌

                </button>
                `;

            // SPEAK

            speakText(
                "PYQs generated successfully."
            );

        }

        // ERROR

        else {

            loading.innerHTML =
                `
                Error generating PYQs.
                `;
        }

    } catch {

        loading.innerHTML =
            `
            Backend connection error.
            `;
    }

    // SAVE

    saveChats();

    // SCROLL

    scrollBottom();
}

// FORMAT PYQ

function formatPYQ(text) {

    // LINE BREAKS

    text =
        text.replace(/\n/g, "<br>");

    // NUMBERING

    text =
        text.replace(

            /(\d+\.)/g,

            "<br><br><strong style='color:#38bdf8;'>$1</strong>"
        );

    // BULLETS

    text =
        text.replace(

            /•/g,

            "<br>•"
        );

    return text;
}