// ========================================
// SIDEBAR TOGGLE
// ========================================

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

// TOGGLE SIDEBAR

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("active");
});

// CLOSE WHEN CLICKING OUTSIDE

document.addEventListener("click", (e) => {

    const clickedInsideSidebar =
        sidebar.contains(e.target);

    const clickedMenu =
        menuBtn.contains(e.target);

    if (
        !clickedInsideSidebar &&
        !clickedMenu
    ) {

        sidebar.classList.remove("active");
    }
});

// CLOSE AFTER CLICKING SIDEBAR BUTTON

const sidebarButtons =
    sidebar.querySelectorAll("button");

sidebarButtons.forEach((btn) => {

    btn.addEventListener("click", () => {

        if (window.innerWidth < 900) {

            sidebar.classList.remove("active");
        }
    });
});
