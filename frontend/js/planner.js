// LOAD TASKS

window.addEventListener(

    "load",

    loadTasks
);

// ADD TASK

function addTask() {

    let taskInput =
        document.getElementById(
            "taskInput"
        );

    let taskTime =
        document.getElementById(
            "taskTime"
        );

    let task =
        taskInput.value;

    let time =
        taskTime.value;

    // VALIDATION

    if (
        task.trim() === ""
    ) {

        alert(
            "Enter a task."
        );

        return;
    }

    // TASK LIST

    let taskList =
        document.getElementById(
            "taskList"
        );

    // CREATE TASK

    let li =
        document.createElement("li");

    li.className =
        "task-item";

    li.innerHTML =
        `
        <div>

            <strong>
                ${task}
            </strong>

            <br>

            <small>
                ⏰ ${time || "No Time"}
            </small>

        </div>

        <div class="task-actions">

            <button
                class="complete-btn"
                onclick="completeTask(this)">

                ✅

            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(this)">

                ❌

            </button>

        </div>
        `;

    taskList.appendChild(li);

    // CLEAR INPUTS

    taskInput.value = "";

    taskTime.value = "";

    // SAVE

    saveTasks();
}

// COMPLETE TASK

function completeTask(button) {

    let task =
        button.parentElement
        .parentElement;

    // STYLE

    task.style.opacity =
        "0.6";

    task.style.textDecoration =
        "line-through";

    // DISABLE BUTTON

    button.disabled = true;

    // UPDATE COUNT

    updateCompletedTasks();

    // SAVE

    saveTasks();
}

// DELETE TASK

function deleteTask(button) {

    button.parentElement
        .parentElement
        .remove();

    saveTasks();
}

// UPDATE COMPLETED TASKS

function updateCompletedTasks() {

    let completed =
        parseInt(

            localStorage.getItem(
                "completed_tasks"
            ) || 0
        );

    completed++;

    localStorage.setItem(

        "completed_tasks",

        completed
    );

    document.getElementById(
        "tasksCompleted"
    ).innerText =
        completed;
}

// SAVE TASKS

function saveTasks() {

    localStorage.setItem(

        "planner_tasks",

        document.getElementById(
            "taskList"
        ).innerHTML
    );
}

// LOAD TASKS

function loadTasks() {

    // TASKS

    let savedTasks =
        localStorage.getItem(
            "planner_tasks"
        );

    if (savedTasks) {

        document.getElementById(
            "taskList"
        ).innerHTML =
            savedTasks;
    }

    // COMPLETED COUNT

    let completed =
        localStorage.getItem(
            "completed_tasks"
        ) || 0;

    document.getElementById(
        "tasksCompleted"
    ).innerText =
        completed;
}