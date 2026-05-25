// LOAD ANALYTICS

window.addEventListener(

    "load",

    loadAnalytics
);

// LOAD DASHBOARD

function loadAnalytics() {

    // STUDY HOURS

    let studyHours =
        parseFloat(

            localStorage.getItem(
                "study_time"
            ) || 0
        );

    document.getElementById(
        "totalStudyHours"
    ).innerText =
        `${studyHours.toFixed(1)} hrs`;

    // GOAL

    let goal =
        parseFloat(

            localStorage.getItem(
                "study_goal"
            ) || 1
        );

    // GOAL COMPLETION

    let percent =
        Math.min(

            Math.round(
                (studyHours / goal) * 100
            ),

            100
        );

    document.getElementById(
        "goalCompletion"
    ).innerText =
        `${percent}%`;

    // CREATE CHART

    createStudyChart(studyHours);
}

// CREATE CHART

function createStudyChart(studyHours) {

    // FIXED CONTEXT

    let ctx =
        document.getElementById(
            "studyChart"
        ).getContext("2d");

    // DESTROY OLD CHART

    if (window.studyChartInstance) {

        window.studyChartInstance.destroy();
    }

    // WEEK DATA

    let weeklyData = [

        (studyHours * 0.5).toFixed(1),
        (studyHours * 0.7).toFixed(1),
        (studyHours * 0.9).toFixed(1),
        (studyHours * 0.6).toFixed(1),
        (studyHours * 0.8).toFixed(1),
        (studyHours * 1.0).toFixed(1),
        (studyHours * 0.75).toFixed(1)
    ];

    // CREATE CHART

    window.studyChartInstance =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels: [

                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],

                datasets: [

                    {
                        label:
                        "Study Hours",

                        data:
                        weeklyData,

                        backgroundColor:
                        "#38bdf8",

                        borderRadius: 8
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        labels: {

                            color: "white"
                        }
                    }
                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "white"
                        },

                        grid: {

                            color:
                            "rgba(255,255,255,0.1)"
                        }
                    },

                    x: {

                        ticks: {

                            color: "white"
                        },

                        grid: {

                            color:
                            "rgba(255,255,255,0.1)"
                        }
                    }
                }
            }
        });
}