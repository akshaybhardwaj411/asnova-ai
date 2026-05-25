// LOAD GOAL

window.addEventListener(

    "load",

    loadGoal
);

// SAVE GOAL

function saveGoal() {

    let goal =
        document.getElementById(
            "studyGoal"
        ).value;

    // VALIDATION

    if (
        !goal ||
        goal <= 0
    ) {

        alert(
            "Enter valid study hours."
        );

        return;
    }

    // SAVE

    localStorage.setItem(

        "study_goal",

        goal
    );

    // UPDATE UI

    document.getElementById(
        "goalDisplay"
    ).innerText =
        `${goal} hrs`;

    // REFRESH ANALYTICS

    if (
        typeof loadAnalytics ===
        "function"
    ) {

        loadAnalytics();
    }
}

// LOAD GOAL

function loadGoal() {

    let savedGoal =
        localStorage.getItem(
            "study_goal"
        );

    // DISPLAY GOAL

    if (savedGoal) {

        document.getElementById(
            "goalDisplay"
        ).innerText =
            `${savedGoal} hrs`;

        document.getElementById(
            "studyGoal"
        ).value =
            savedGoal;
    }

    // STUDY TIME

    let studyTime =
        localStorage.getItem(
            "study_time"
        ) || 0;

    document.getElementById(
        "studyTimeDisplay"
    ).innerText =
        `${studyTime} hrs`;
}

// UPDATE STUDY TIME

function updateStudyTime(hours) {

    let current =
        parseFloat(

            localStorage.getItem(
                "study_time"
            ) || 0
        );

    // ADD HOURS

    current += hours;

    // SAVE

    localStorage.setItem(

        "study_time",

        current.toFixed(1)
    );

    // UPDATE UI

    document.getElementById(
        "studyTimeDisplay"
    ).innerText =
        `${current.toFixed(1)} hrs`;

    // REFRESH ANALYTICS

    if (
        typeof loadAnalytics ===
        "function"
    ) {

        loadAnalytics();
    }
}