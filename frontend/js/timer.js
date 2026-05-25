let timer;

let totalTime = 25 * 60;

let currentTime = totalTime;

let isRunning = false;

// UPDATE DISPLAY

function updateTimerDisplay() {

    let minutes =
        Math.floor(currentTime / 60);

    let seconds =
        currentTime % 60;

    minutes =
        minutes < 10
        ? "0" + minutes
        : minutes;

    seconds =
        seconds < 10
        ? "0" + seconds
        : seconds;

    document.getElementById(
        "timerDisplay"
    ).innerText =
        `${minutes}:${seconds}`;
}

// CHANGE TIMER DURATION

function changeTimerDuration() {

    let minutes =
        parseInt(

            document.getElementById(
                "timerSelect"
            ).value
        );

    totalTime =
        minutes * 60;

    currentTime =
        totalTime;

    updateTimerDisplay();
}

// START / PAUSE / RESUME

function toggleTimer() {

    let controlButton =
        document.getElementById(
            "timerControlBtn"
        );

    // START / RESUME

    if (!isRunning) {

        isRunning = true;

        controlButton.innerText =
            "⏸ Pause";

        timer = setInterval(() => {

            currentTime--;

            updateTimerDisplay();

            // TIMER COMPLETE

            if (currentTime <= 0) {

                clearInterval(timer);

                isRunning = false;

                controlButton.innerText =
                    "▶ Start";

                // NOTIFICATION

                if (
                    Notification.permission ===
                    "granted"
                ) {

                    new Notification(

                        "ASnova Pomodoro",

                        {
                            body:
                            "Study session completed!"
                        }
                    );
                }

                // VOICE

                speakText(
                    "Great job! Your study session is complete."
                );

                // STUDY HOURS

                let selectedMinutes =
                    parseInt(

                        document.getElementById(
                            "timerSelect"
                        ).value
                    );

                let hours =
                    selectedMinutes / 60;

                updateStudyTime(hours);

                // POMODORO COUNT

                updatePomodoroCount();

                // RESET TIMER

                currentTime =
                    totalTime;

                updateTimerDisplay();
            }

        }, 1000);
    }

    // PAUSE

    else {

        clearInterval(timer);

        isRunning = false;

        controlButton.innerText =
            "▶ Resume";
    }
}

// RESET TIMER

function resetTimer() {

    clearInterval(timer);

    isRunning = false;

    currentTime =
        totalTime;

    updateTimerDisplay();

    document.getElementById(
        "timerControlBtn"
    ).innerText =
        "▶ Start";
}

// UPDATE POMODORO COUNT

function updatePomodoroCount() {

    let count =
        parseInt(

            localStorage.getItem(
                "pomodoro_count"
            ) || 0
        );

    count++;

    localStorage.setItem(

        "pomodoro_count",

        count
    );

    document.getElementById(
        "pomodoroCount"
    ).innerText =
        count;
}

// LOAD POMODORO COUNT

window.addEventListener(

    "load",

    () => {

        let count =
            localStorage.getItem(
                "pomodoro_count"
            ) || 0;

        document.getElementById(
            "pomodoroCount"
        ).innerText =
            count;
    }
);

// INITIAL DISPLAY

updateTimerDisplay();