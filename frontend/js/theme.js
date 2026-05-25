// LOAD THEME

window.addEventListener(

    "load",

    loadTheme
);

// TOGGLE THEME

function toggleTheme() {

    let body =
        document.getElementById(
            "body"
        );

    // TOGGLE CLASS

    body.classList.toggle(
        "light-mode"
    );

    // SAVE THEME

    if (

        body.classList.contains(
            "light-mode"
        )

    ) {

        localStorage.setItem(

            "theme",

            "light"
        );

    } else {

        localStorage.setItem(

            "theme",

            "dark"
        );
    }
}

// LOAD SAVED THEME

function loadTheme() {

    let savedTheme =
        localStorage.getItem(
            "theme"
        );

    // LIGHT MODE

    if (
        savedTheme === "light"
    ) {

        document
            .getElementById(
                "body"
            )
            .classList
            .add(
                "light-mode"
            );
    }
}

// SMOOTH TRANSITION

document.addEventListener(

    "DOMContentLoaded",

    () => {

        document.body.style.transition =
            "background 0.3s, color 0.3s";
    }
);