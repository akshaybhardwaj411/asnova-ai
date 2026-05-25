// ========================================
// GLOBAL SEARCH SYSTEM
// ========================================

let searchActive = false;

// ========================================
// OPEN SEARCH MODAL
// ========================================

function openSearchModal() {

    // PREVENT DUPLICATE

    if (
        document.getElementById(
            "searchModal"
        )
    ) {

        return;
    }

    // MODAL

    let modal =
        document.createElement(
            "div"
        );

    modal.id =
        "searchModal";

    modal.className =
        "search-modal";

    modal.innerHTML =
        `
        <div class="search-container">

            <!-- HEADER -->

            <div class="search-header">

                <div class="search-title">

                    🔍 Search Conversations

                </div>

                <button
                    class="close-search-btn"
                    onclick="closeSearchModal()">

                    ✕

                </button>

            </div>

            <!-- INPUT -->

            <input
                type="text"
                id="searchInput"
                class="search-input"
                placeholder="Search chats or messages..."
                oninput="performSearch()">

            <!-- RESULTS -->

            <div
                class="search-results"
                id="searchResults">

            </div>

        </div>
        `;

    document.body.appendChild(
        modal
    );

    // AUTO FOCUS

    setTimeout(() => {

        document
            .getElementById(
                "searchInput"
            )
            .focus();

    }, 100);

    searchActive = true;
}

// ========================================
// CLOSE SEARCH
// ========================================

function closeSearchModal() {

    let modal =
        document.getElementById(
            "searchModal"
        );

    if (modal) {

        modal.remove();
    }

    searchActive = false;
}

// ========================================
// PERFORM SEARCH
// ========================================

function performSearch() {

    let input =
        document.getElementById(
            "searchInput"
        );

    let query =
        input.value
        .toLowerCase()
        .trim();

    let results =
        document.getElementById(
            "searchResults"
        );

    // EMPTY

    if (query === "") {

        results.innerHTML =
            `
            <div class="empty-search">

                Start typing to search conversations...

            </div>
            `;

        return;
    }

    let matchedChats = [];

    // ========================================
    // SEARCH CHATS
    // ========================================

    allChats.forEach(chat => {

        let titleMatch =
            chat.title
            .toLowerCase()
            .includes(query);

        let messageMatch =
            chat.messages
            .join(" ")
            .toLowerCase()
            .includes(query);

        if (
            titleMatch ||
            messageMatch
        ) {

            matchedChats.push(chat);
        }
    });

    // ========================================
    // NO RESULTS
    // ========================================

    if (
        matchedChats.length === 0
    ) {

        results.innerHTML =
            `
            <div class="empty-search">

                No conversations found.

            </div>
            `;

        return;
    }

    // ========================================
    // RENDER RESULTS
    // ========================================

    results.innerHTML = "";

    matchedChats.forEach(chat => {

        // SNIPPET

        let snippet =
            chat.messages
            .join(" ")
            .replace(/<[^>]*>/g, "")
            .substring(0, 140);

        let item =
            document.createElement(
                "div"
            );

        item.className =
            "search-result-item";

        item.innerHTML =
            `
            <div class="search-result-title">

                ${highlightSearch(
                    chat.title,
                    query
                )}

            </div>

            <div class="search-result-snippet">

                ${highlightSearch(
                    snippet,
                    query
                )}...

            </div>
            `;

        item.onclick =
            () => {

                openChat(chat.id);

                closeSearchModal();
            };

        results.appendChild(
            item
        );
    });
}

// ========================================
// HIGHLIGHT MATCH
// ========================================

function highlightSearch(
    text,
    query
) {

    let regex =
        new RegExp(

            `(${query})`,

            "gi"
        );

    return text.replace(

        regex,

        `<span class="search-highlight">$1</span>`
    );
}

// ========================================
// ESC CLOSE
// ========================================

document.addEventListener(

    "keydown",

    function(event) {

        // OPEN SEARCH

        if (
            (
                event.ctrlKey ||
                event.metaKey
            )
            &&
            event.key === "k"
        ) {

            event.preventDefault();

            openSearchModal();
        }

        // CLOSE

        if (
            event.key === "Escape"
            &&
            searchActive
        ) {

            closeSearchModal();
        }
    }
);