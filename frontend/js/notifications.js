// ========================================
// NOTIFICATION SYSTEM
// ========================================

// REQUEST PERMISSION

window.addEventListener(

    "load",

    requestNotificationPermission
);

function requestNotificationPermission() {

    // CHECK SUPPORT

    if (
        !("Notification" in window)
    ) {

        console.log(
            "Notifications not supported."
        );

        return;
    }

    // REQUEST

    if (
        Notification.permission !==
        "granted"
    ) {

        Notification.requestPermission();
    }
}

// SHOW NOTIFICATION

function showNotification(

    title,

    body
) {

    // CHECK PERMISSION

    if (
        Notification.permission ===
        "granted"
    ) {

        new Notification(

            title,

            {
                body: body,

                icon:
                "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            }
        );
    }
}

// ========================================
// STUDY REMINDER
// ========================================

// EVERY 1 HOUR

setInterval(

    () => {

        showNotification(

            "📚 ASnova Reminder",

            "Time to focus on your studies!"
        );

    },

    60 * 60 * 1000
);

// ========================================
// DAILY MOTIVATION
// ========================================

const motivationQuotes = [

    "Small progress is still progress.",

    "Stay consistent. Success follows discipline.",

    "Focus today. Shine tomorrow.",

    "One study session can change your future.",

    "Keep learning. Keep growing."
];

// RANDOM QUOTE

function randomQuote() {

    return motivationQuotes[

        Math.floor(

            Math.random()
            *
            motivationQuotes.length
        )
    ];
}

// DAILY MOTIVATION

setInterval(

    () => {

        showNotification(

            "🔥 Daily Motivation",

            randomQuote()
        );

    },

    3 * 60 * 60 * 1000
);