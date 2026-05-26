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

            "keydown",

            function (e) {

                if (
                    e.key === "Enter"
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
            "asnova_chats"
        );

    if (saved) {

        allChats =
            JSON.parse(saved);

        renderHistory();
    }
}

// ========================================
// SAVE CHATS
// ========================================

function saveAllChats() {

    localStorage.setItem(

        "asnova_chats",

        JSON.stringify(allChats)
    );
}

// ========================================
// NEW CHAT
// ========================================

function newChat() {

    let id =
        Date.now();

    let chat = {

        id: id,

        title: "New Chat",

        messages: []
    };

    allChats.unshift(chat);

    currentChatId = id;

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
        document.getElementById(
            "historyList"
        );

    history.innerHTML = "";

    allChats.forEach(chat => {

        let item =
            document.createElement(
                "div"
            );

        item.className =
            "history-item";

        item.innerHTML =
            `
            <span onclick="openChat(${chat.id})">

                ${chat.title}

            </span>

            <div class="history-actions">

                <button onclick="renameChat(${chat.id})">

                    ✏️

                </button>

                <button onclick="deleteChat(${chat.id})">

                    🗑️

                </button>

            </div>
            `;

        history.appendChild(item);
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

    document.getElementById(
        "welcomeScreen"
    ).style.display =
        "none";

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

                    ASnova is thinking.

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
        button.parentElement.querySelector(
            ".user-text"
        );

    let oldText =
        userMessage.innerText;

    let newText =
        prompt(
            "Edit message:",
            oldText
        );

    if (
        !newText ||
        newText.trim() === ""
    ) {

        return;
    }

    userMessage.innerText =
        newText;

    updateCurrentChat();
}

// ========================================
// PIN NOTE
// ========================================

function pinNote(button) {

    let text =
        button.parentElement.innerText;

    let pinnedArea =
        document.getElementById(
            "pinnedNotes"
        );

    let note =
        document.createElement(
            "div"
        );

    note.className =
        "pinned-text";

    note.innerHTML =
        `
        📌 ${text}
        `;

    pinnedArea.appendChild(note);
}

// ========================================
// IMAGE PREVIEW
// ========================================

function showImagePreview(file) {

    let reader =
        new FileReader();

    reader.onload =
        function(e) {

            document.getElementById(
                "uploadPreview"
            ).innerHTML =
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
