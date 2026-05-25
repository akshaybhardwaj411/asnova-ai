// ========================================
// AUTO SAVE SYSTEM
// ========================================

// SAVE ALL APP DATA

function saveAppState() {

    // CHATS

    localStorage.setItem(

        "asnova_chats",

        document.getElementById(
            "chatBox"
        ).innerHTML
    );

    // PINS

    localStorage.setItem(

        "asnova_pins",

        document.getElementById(
            "pinnedList"
        ).innerHTML
    );

    // TASKS

    localStorage.setItem(

        "planner_tasks",

        document.getElementById(
            "taskList"
        ).innerHTML
    );
}

// AUTO SAVE EVERY 10 SECONDS

setInterval(

    saveAppState,

    10000
);

// ========================================
// LOAD APP DATA
// ========================================

window.addEventListener(

    "load",

    loadAppState
);

function loadAppState() {

    // LOAD CHATS

    let chats =
        localStorage.getItem(
            "asnova_chats"
        );

    if (chats) {

        document.getElementById(
            "chatBox"
        ).innerHTML =
            chats;
    }

    // LOAD PINS

    let pins =
        localStorage.getItem(
            "asnova_pins"
        );

    if (pins) {

        document.getElementById(
            "pinnedList"
        ).innerHTML =
            pins;
    }

    // LOAD TASKS

    let tasks =
        localStorage.getItem(
            "planner_tasks"
        );

    if (tasks) {

        document.getElementById(
            "taskList"
        ).innerHTML =
            tasks;
    }
}

// ========================================
// CLEAR CHATS
// ========================================

function clearChats() {

    // CONFIRM

    let confirmClear =
        confirm(

            "Are you sure you want to clear all chats?"
        );

    // CANCEL

    if (!confirmClear) {

        return;
    }

    // CLEAR CHAT BOX

    document.getElementById(
        "chatBox"
    ).innerHTML = "";

    // REMOVE STORAGE

    localStorage.removeItem(
        "asnova_chats"
    );

    // SUCCESS

    alert(
        "Chats cleared successfully."
    );
}

// ========================================
// CLEAR ALL DATA
// ========================================

function clearAllData() {

    // CONFIRM

    let confirmDelete =
        confirm(

            "Delete all ASnova data?"
        );

    // CANCEL

    if (!confirmDelete) {

        return;
    }

    // CLEAR STORAGE

    localStorage.clear();

    // RELOAD APP

    location.reload();
}