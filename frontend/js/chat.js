// ========================================
// GLOBALS
// ========================================

let currentChatId = null;

let allChats = [];

// ========================================
// INITIALIZE
// ========================================

window.onload = function () {

    loadChats();

    // ENTER KEY

    document
        .getElementById(
            "prompt"
        )
        .addEventListener(

            "keypress",

            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    askAI();
                }
            }
        );
};

// ========================================
// LOAD CHATS
// ========================================

function loadChats() {

    let saved =
        localStorage.getItem(
            "asnova_all_chats"
        );

    if (saved) {

        allChats =
            JSON.parse(saved);

        renderHistory();

        if (
            allChats.length > 0
        ) {

            openChat(
                allChats[0].id
            );
        }
    }
}

// ========================================
// SAVE CHATS
// ========================================

function saveAllChats() {

    localStorage.setItem(

        "asnova_all_chats",

        JSON.stringify(allChats)
    );
}

// ========================================
// NEW CHAT
// ========================================

function newChat() {

    currentChatId =
        Date.now();

    let chat = {

        id: currentChatId,

        title: "New Chat",

        messages: []
    };

    allChats.unshift(chat);

    saveAllChats();

    renderHistory();

    document.getElementById(
        "chatBox"
    ).innerHTML = "";

    document.getElementById(
        "welcomeScreen"
    ).style.display =
        "block";
}

// ========================================
// RENDER HISTORY
// ========================================

function renderHistory() {

    let history =
        document.querySelector(
            ".history-section"
        );

    history.innerHTML =
        `
        <h3>

            Recent Chats

        </h3>
        `;

    allChats.forEach(chat => {

        let item =
            document.createElement(
                "div"
            );

        item.className =
            "history-chat";

        // ACTIVE

        if (
            chat.id === currentChatId
        ) {

            item.classList.add(
                "active-chat"
            );
        }

        item.innerHTML =
            `
            <div
                class="history-title"
                onclick="openChat(${chat.id})">

                ${chat.title}

            </div>

            <div class="history-actions">

                <button
                    onclick="renameChat(${chat.id})">

                    ✏️

                </button>

                <button
                    onclick="deleteChat(${chat.id})">

                    🗑

                </button>

            </div>
            `;

        history.appendChild(
            item
        );
    });
}

// ========================================
// OPEN CHAT
// ========================================

function openChat(id) {

    currentChatId = id;

    let chat =
        allChats.find(

            c => c.id === id
        );

    if (!chat) return;

    document.getElementById(
        "chatBox"
    ).innerHTML =
        chat.messages.join("");

    // WELCOME

    if (
        chat.messages.length > 0
    ) {

        document.getElementById(
            "welcomeScreen"
        ).style.display =
            "none";
    }

    else {

        document.getElementById(
            "welcomeScreen"
        ).style.display =
            "block";
    }

    renderHistory();

    scrollBottom();
}

// ========================================
// RENAME CHAT
// ========================================

function renameChat(id) {

    let chat =
        allChats.find(

            c => c.id === id
        );

    if (!chat) return;

    let newTitle =
        prompt(

            "Rename chat:",

            chat.title
        );

    if (
        !newTitle ||
        newTitle.trim() === ""
    ) {

        return;
    }

    chat.title =
        newTitle;

    saveAllChats();

    renderHistory();
}

// ========================================
// DELETE CHAT
// ========================================

function deleteChat(id) {

    let confirmDelete =
        confirm(
            "Delete this chat?"
        );

    if (!confirmDelete) {

        return;
    }

    allChats =
        allChats.filter(

            chat => chat.id !== id
        );

    saveAllChats();

    if (
        allChats.length === 0
    ) {

        currentChatId = null;

        document.getElementById(
            "chatBox"
        ).innerHTML = "";

        document.getElementById(
            "welcomeScreen"
        ).style.display =
            "block";
    }

    else {

        openChat(
            allChats[0].id
        );
    }

    renderHistory();
}

// ========================================
// UPDATE CHAT
// ========================================

function updateCurrentChat() {

    let chat =
        allChats.find(

            c => c.id === currentChatId
        );

    if (!chat) return;

    chat.messages =
        Array.from(

            document.getElementById(
                "chatBox"
            ).children

        ).map(

            el => el.outerHTML
        );

    saveAllChats();
}

// ========================================
// FORMAT RESPONSE
// ========================================

function formatResponse(text) {

    let html =
        marked.parse(text);

    let temp =
        document.createElement(
            "div"
        );

    temp.innerHTML =
        html;

    temp.querySelectorAll(
        "pre code"
    ).forEach(block => {

        hljs.highlightElement(
            block
        );
    });

    return temp.innerHTML;
}

// ========================================
// AUTO SCROLL
// ========================================

function scrollBottom() {

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

// ========================================
// CREATE WRAPPER
// ========================================

function createMessageWrapper(type) {

    let wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        `message-wrapper ${type}`;

    return wrapper;
}

// ========================================
// USER MESSAGE
// ========================================

function createUserMessage(text) {

    let wrapper =
        createMessageWrapper(
            "user-wrapper"
        );

    wrapper.innerHTML =
        `
        <div class="avatar user-avatar">

            👤

        </div>

        <div class="message user">

            <div class="user-text">

                ${text}

            </div>

            <button
                class="edit-btn"
                onclick="editMessage(this)">

                ✏️

            </button>

        </div>
        `;

    return wrapper;
}

// ========================================
// AI MESSAGE
// ========================================

function createAIMessage() {

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

            <div class="ai-thinking">

                <div class="thinking-dots">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

                <div class="thinking-text">

                    ASnova is thinking...

                </div>

            </div>

            <div class="shimmer-loader">

            </div>

        </div>
        `;

    return wrapper;
}

// ========================================
// STREAM RESPONSE
// ========================================

function streamResponse(
    aiContainer,
    aiText
) {

    let aiMessage =
        aiContainer.querySelector(
            ".message.ai"
        );

    let formattedText =
        formatResponse(
            aiText
        );

    let i = 0;

    let speed = 8;

    function typeEffect() {

        if (
            i < formattedText.length
        ) {

            aiMessage.innerHTML =
                formattedText.substring(
                    0,
                    i
                ) +
                `
                <span class="typing-cursor">

                    ●

                </span>
                `;

            i++;

            scrollBottom();

            setTimeout(
                typeEffect,
                speed
            );
        }

        else {

            aiMessage.innerHTML =
                `
                <div class="ai-content">

                    ${formattedText}

                </div>

                <button
                    class="pin-btn"
                    onclick="pinNote(this)">

                    📌

                </button>
                `;

            speakText(aiText);

            updateCurrentChat();
        }
    }

    typeEffect();
}

// ========================================
// ASK AI
// ========================================

async function askAI() {

    let input =
        document.getElementById(
            "prompt"
        );

    let promptText =
        input.value;

    if (
        promptText.trim() === ""
    ) return;

    // CREATE CHAT

    if (!currentChatId) {

        newChat();
    }

    // AUTO TITLE

    let currentChat =
        allChats.find(

            c => c.id === currentChatId
        );

    if (
        currentChat &&
        currentChat.title ===
        "New Chat"
    ) {

        currentChat.title =
            promptText.substring(
                0,
                30
            );

        renderHistory();
    }

    // HIDE WELCOME

    document.getElementById(
        "welcomeScreen"
    ).style.display =
        "none";

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    // USER MESSAGE

    let userMessage =
        createUserMessage(
            promptText
        );

    chatBox.appendChild(
        userMessage
    );

    input.value = "";

    // AI MESSAGE

    let aiMessage =
        createAIMessage();

    chatBox.appendChild(
        aiMessage
    );

    scrollBottom();

    updateCurrentChat();

    try {

        let response =
            await fetch(

                `${API_BASE_URL}/chat?prompt=${encodeURIComponent(promptText)}`
            );

        let data =
            await response.json();

        let aiText =
            data.response ||
            data.error;

        streamResponse(
            aiMessage,
            aiText
        );
    }

    catch(error) {

    let message =
        `
        <div class="error-box">

            ❌ Unable to connect to ASnova AI.

            <br><br>

            Please check:

            <ul>

                <li>Backend server is running</li>

                <li>Internet connection</li>

                <li>API quota availability</li>

            </ul>

        </div>
        `;

    aiMessage.querySelector(
        ".message.ai"
    ).innerHTML =
        message;
}
}

// ========================================
// EDIT MESSAGE
// ========================================

async function editMessage(button) {

    let userMessage =
        button.parentElement;

    let oldText =
        userMessage.querySelector(
            ".user-text"
        ).innerText;

    let newText =
        prompt(
            "Edit your message:",
            oldText
        );

    if (
        !newText ||
        newText.trim() === ""
    ) {

        return;
    }

    userMessage.querySelector(
        ".user-text"
    ).innerText =
        newText;

    let wrapper =
        userMessage.parentElement;

    let aiWrapper =
        wrapper.nextElementSibling;

    if (
        aiWrapper &&
        aiWrapper.classList.contains(
            "ai-wrapper"
        )
    ) {

        let aiMessage =
            aiWrapper.querySelector(
                ".message.ai"
            );

        aiMessage.innerHTML =
            `
            <span class="typing-cursor">

                ●

            </span>
            `;

        try {

            let response =
                await fetch(

                    `${API_BASE_URL}/chat?prompt=${encodeURIComponent(newText)}`
                );

            let data =
                await response.json();

            let aiText =
                data.response ||
                data.error;

            streamResponse(
                aiWrapper,
                aiText
            );
        }

        catch {

            aiMessage.innerHTML =
                `
                Error regenerating response.
                `;
        }
    }
}

// ========================================
// TOOLS MENU
// ========================================

function toggleToolsMenu() {

    document
        .getElementById(
            "toolsMenu"
        )
        .classList
        .toggle(
            "active"
        );
}

// ========================================
// MOBILE SIDEBAR
// ========================================

function toggleSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList
        .toggle(
            "active"
        );
}

// ========================================
// PROMPTS
// ========================================

function usePrompt(text) {

    document.getElementById(
        "welcomeScreen"
    ).style.display =
        "none";

    document.getElementById(
        "prompt"
    ).value =
        text;

    askAI();
}

// ========================================
// PDF PREVIEW
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

                </div>
                `;
        }
    );

// ========================================
// REMOVE PDF
// ========================================

function removeUploadedFile() {

    document.getElementById(
        "pdfFile"
    ).value = "";

    document.getElementById(
        "uploadPreview"
    ).innerHTML = "";
}

// ========================================
// IMAGE PREVIEW
// ========================================

document
    .getElementById(
        "imageFile"
    )
    .addEventListener(

        "change",

        function(event) {

            let file =
                event.target.files[0];

            if (!file) return;

            showImagePreview(file);
        }
    );

// ========================================
// SHOW IMAGE PREVIEW
// ========================================

function showImagePreview(file) {

    let reader =
        new FileReader();

    reader.onload =
        function(e) {

            let preview =
                document.getElementById(
                    "uploadPreview"
                );

            preview.innerHTML =
                `
                <div class="image-chip">

                    <img
                        src="${e.target.result}"
                        onclick="openImageModal('${e.target.result}')">

                    <span>

                        ${file.name}

                    </span>

                    <button
                        onclick="removeImageFile()">

                        ✕

                    </button>

                </div>
                `;
        };

    reader.readAsDataURL(file);
}

// ========================================
// REMOVE IMAGE
// ========================================

function removeImageFile() {

    document.getElementById(
        "imageFile"
    ).value = "";

    document.getElementById(
        "uploadPreview"
    ).innerHTML = "";
}

// ========================================
// IMAGE MODAL
// ========================================

function openImageModal(src) {

    let modal =
        document.getElementById(
            "imageModal"
        );

    let image =
        document.getElementById(
            "modalImage"
        );

    image.src = src;

    modal.classList.add(
        "active"
    );
}

// ========================================
// CLOSE MODAL
// ========================================

function closeImageModal() {

    document
        .getElementById(
            "imageModal"
        )
        .classList
        .remove(
            "active"
        );
}

// ========================================
// ESC CLOSE
// ========================================

document.addEventListener(

    "keydown",

    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeImageModal();
        }
    }
);

// ========================================
// DRAG & DROP
// ========================================

const dragOverlay =
    document.getElementById(
        "dragOverlay"
    );

document.addEventListener(

    "dragenter",

    function(event) {

        event.preventDefault();

        dragOverlay.classList.add(
            "active"
        );
    }
);

document.addEventListener(

    "dragover",

    function(event) {

        event.preventDefault();
    }
);

document.addEventListener(

    "dragleave",

    function(event) {

        if (
            event.clientX === 0 ||
            event.clientY === 0
        ) {

            dragOverlay.classList.remove(
                "active"
            );
        }
    }
);

document.addEventListener(

    "drop",

    function(event) {

        event.preventDefault();

        dragOverlay.classList.remove(
            "active"
        );

        let file =
            event.dataTransfer.files[0];

        if (!file) return;

        // IMAGE

        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            const dt =
                new DataTransfer();

            dt.items.add(file);

            document.getElementById(
                "imageFile"
            ).files =
                dt.files;

            showImagePreview(file);
        }

        // PDF

        else {

            const dt =
                new DataTransfer();

            dt.items.add(file);

            document.getElementById(
                "pdfFile"
            ).files =
                dt.files;

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

                </div>
                `;
        }
    }
);

// ========================================
// AI IMAGE ANALYSIS
// ========================================

async function analyzeImage() {

    let imageInput =
        document.getElementById(
            "imageFile"
        );

    let file =
        imageInput.files[0];

    if (!file) {

        alert(
            "Please upload an image first."
        );

        return;
    }

    // HIDE WELCOME

    document.getElementById(
        "welcomeScreen"
    ).style.display =
        "none";

    let chatBox =
        document.getElementById(
            "chatBox"
        );

    // SHOW IMAGE

    let reader =
        new FileReader();

    reader.onload =
        async function(e) {

            // USER MESSAGE

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

                    <img
                        class="chat-upload-image"
                        src="${e.target.result}"
                        onclick="openImageModal('${e.target.result}')">

                    <div class="image-analysis-label">

                        Analyze this image

                    </div>

                </div>
                `;

            chatBox.appendChild(
                userWrapper
            );

            // AI MESSAGE

            let aiWrapper =
                createAIMessage();

            chatBox.appendChild(
                aiWrapper
            );

            scrollBottom();

            // FORM DATA

            let formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            try {

                let response =
                    await fetch(

                        `${API_BASE_URL}/analyze-image`,

                        {
                            method: "POST",

                            body: formData
                        }
                    );

                let data =
                    await response.json();

                let aiText =
                    data.response ||
                    data.error;

                streamResponse(
                    aiWrapper,
                    aiText
                );
            }

            catch(error) {

    let message =
        `
        <div class="error-box">

            ❌ Image analysis failed.

            <br><br>

            Possible reasons:

            <ul>

                <li>Unsupported image</li>

                <li>Large image size</li>

                <li>Backend offline</li>

                <li>API limit reached</li>

            </ul>

        </div>
        `;

    aiWrapper.querySelector(
        ".message.ai"
    ).innerHTML =
        message;
}
        };

    reader.readAsDataURL(file);
}

// ========================================
// NETWORK STATUS
// ========================================

window.addEventListener(

    "offline",

    function() {

        let warning =
            document.createElement(
                "div"
            );

        warning.className =
            "network-warning";

        warning.id =
            "networkWarning";

        warning.innerHTML =
            `
            ❌ No internet connection
            `;

        document.body.appendChild(
            warning
        );
    }
);

window.addEventListener(

    "online",

    function() {

        let warning =
            document.getElementById(
                "networkWarning"
            );

        if (warning) {

            warning.remove();
        }
    }
);