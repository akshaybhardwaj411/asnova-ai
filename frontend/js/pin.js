// LOAD PINS

window.addEventListener(

    "load",

    loadPins
);

// PIN NOTE

function pinNote(button) {

    let fullText =
        button.parentElement
        .querySelector(".ai-content")
        .innerText;

    // SHORT PREVIEW

    let shortText =
        fullText.length > 120

        ?

        fullText.substring(0, 120) + "..."

        :

        fullText;

    // CHECK DUPLICATES

    let existingPins =
        document.querySelectorAll(
            ".pinned-text"
        );

    for (let pin of existingPins) {

        if (
            pin.innerText === shortText
        ) {

            alert(
                "This note is already pinned."
            );

            return;
        }
    }

    // DATE

    let now =
        new Date();

    let date =
        now.toLocaleDateString();

    let time =
        now.toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"
        });

    // CREATE PIN

    let pinnedList =
        document.getElementById(
            "pinnedList"
        );

    let li =
        document.createElement("li");

    li.className =
        "pinned-item";

    li.innerHTML =
        `
        <div class="pinned-text">

            ${shortText}

        </div>

        <div class="pin-time">

            📅 ${date}
            •
            ⏰ ${time}

        </div>

        <button
            class="remove-pin"
            onclick="removePin(this)">

            ❌ Remove

        </button>
        `;

    // ANIMATION

    li.style.opacity = "0";

    li.style.transform =
        "translateY(10px)";

    pinnedList.appendChild(li);

    setTimeout(() => {

        li.style.transition =
            "0.3s";

        li.style.opacity =
            "1";

        li.style.transform =
            "translateY(0)";

    }, 50);

    // SAVE

    savePins();
}

// REMOVE PIN

function removePin(button) {

    let pin =
        button.parentElement;

    // ANIMATION

    pin.style.opacity =
        "0";

    pin.style.transform =
        "translateX(20px)";

    setTimeout(() => {

        pin.remove();

        savePins();

    }, 250);
}

// SAVE PINS

function savePins() {

    localStorage.setItem(

        "asnova_pins",

        document.getElementById(
            "pinnedList"
        ).innerHTML
    );
}

// LOAD PINS

function loadPins() {

    let savedPins =
        localStorage.getItem(
            "asnova_pins"
        );

    if (savedPins) {

        document.getElementById(
            "pinnedList"
        ).innerHTML =
            savedPins;
    }
}