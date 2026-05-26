// ========================================
// TOGGLE SIDEBAR
// ========================================

function toggleSidebar(event) {

    // PREVENT INSTANT CLOSE

    if (event) {

        event.stopPropagation();
    }

    document
        .getElementById(
            "sidebar"
        )
        .classList
        .toggle("active");
}

// ========================================
// AUTO CLOSE SIDEBAR
// ========================================

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

            sidebar.classList.contains(
                "active"
            ) &&

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

// ========================================
// PREVENT CLOSE WHEN CLICKING INSIDE
// ========================================

document
    .getElementById("sidebar")
    .addEventListener(

        "click",

        function(event) {

            event.stopPropagation();
        }
    );

// ========================================
// CLOSE AFTER SIDEBAR BUTTON CLICK
// ========================================

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
