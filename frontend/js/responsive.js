// TOGGLE SIDEBAR

function toggleSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList
        .toggle("active");
}

// AUTO CLOSE SIDEBAR
// AFTER CLICKING BUTTONS

document.addEventListener(

    "click",

    function(event) {

        let sidebar =
            document.getElementById(
                "sidebar"
            );

        let menuButton =
            document.querySelector(
                ".menu-toggle"
            );

        // MOBILE ONLY

        if (

            window.innerWidth <= 900 &&

            !sidebar.contains(
                event.target
            ) &&

            !menuButton.contains(
                event.target
            )

        ) {

            sidebar.classList.remove(
                "active"
            );
        }
    }
);

// CLOSE SIDEBAR
// AFTER CLICKING SIDEBAR BUTTON

let sidebarButtons =
    document.querySelectorAll(

        ".sidebar button"
    );

sidebarButtons.forEach(

    button => {

        button.addEventListener(

            "click",

            () => {

                if (
                    window.innerWidth <= 900
                ) {

                    document
                        .getElementById(
                            "sidebar"
                        )
                        .classList
                        .remove("active");
                }
            }
        );
    }
);
