// LOAD STREAK

window.addEventListener(

    "load",

    loadStreak
);

// LOAD STREAK

function loadStreak() {

    let streak =
        parseInt(

            localStorage.getItem(
                "study_streak"
            ) || 0
        );

    let lastDate =
        localStorage.getItem(
            "last_study_date"
        );

    let today =
        new Date()
        .toDateString();

    // FIRST TIME

    if (!lastDate) {

        localStorage.setItem(

            "last_study_date",

            today
        );

        localStorage.setItem(

            "study_streak",

            1
        );

        streak = 1;
    }

    // DATE CHECK

    else {

        let last =
            new Date(lastDate);

        let current =
            new Date(today);

        // DIFFERENCE

        let diff =
            Math.floor(

                (current - last)

                /

                (1000 * 60 * 60 * 24)
            );

        // NEXT DAY

        if (diff === 1) {

            streak++;

            localStorage.setItem(

                "study_streak",

                streak
            );

            localStorage.setItem(

                "last_study_date",

                today
            );
        }

        // MISSED DAYS

        else if (diff > 1) {

            streak = 1;

            localStorage.setItem(

                "study_streak",

                streak
            );

            localStorage.setItem(

                "last_study_date",

                today
            );
        }
    }

    // UPDATE UI

    document.getElementById(
        "studyStreak"
    ).innerText =
        `${streak} Days`;
}