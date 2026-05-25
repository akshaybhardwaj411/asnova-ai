// ========================================
// SETTINGS DATA
// ========================================

let asnovaSettings = {

    model:
        localStorage.getItem(
            "asnova_model"
        ) || "gpt-3.5",

    responseStyle:
        localStorage.getItem(
            "asnova_style"
        ) || "balanced",

    streamSpeed:
        localStorage.getItem(
            "asnova_speed"
        ) || "8",

    accentColor:
        localStorage.getItem(
            "asnova_accent"
        ) || "#3b82f6"
};

// ========================================
// OPEN SETTINGS
// ========================================

function openSettingsModal() {

    // PREVENT DUPLICATE

    if (
        document.getElementById(
            "settingsModal"
        )
    ) {

        return;
    }

    // MODAL

    let modal =
        document.createElement(
            "div"
        );

    modal.id =
        "settingsModal";

    modal.className =
        "settings-modal";

    modal.innerHTML =
        `
        <div class="settings-container">

            <!-- HEADER -->

            <div class="settings-header">

                <div class="settings-title">

                    ⚙ Settings

                </div>

                <button
                    class="close-settings-btn"
                    onclick="closeSettingsModal()">

                    ✕

                </button>

            </div>

            <!-- BODY -->

            <div class="settings-body">

                <!-- MODEL -->

                <div class="settings-group">

                    <label>

                        AI Model

                    </label>

                    <select
                        id="modelSelect"
                        onchange="updateModel()">

                        <option value="gpt-3.5">

                            GPT-3.5 Turbo

                        </option>

                        <option value="gpt-4o-mini">

                            GPT-4o Mini

                        </option>

                        <option value="gpt-4o">

                            GPT-4o

                        </option>

                    </select>

                </div>

                <!-- STYLE -->

                <div class="settings-group">

                    <label>

                        Response Style

                    </label>

                    <select
                        id="styleSelect"
                        onchange="updateStyle()">

                        <option value="balanced">

                            Balanced

                        </option>

                        <option value="creative">

                            Creative

                        </option>

                        <option value="professional">

                            Professional

                        </option>

                        <option value="concise">

                            Concise

                        </option>

                    </select>

                </div>

                <!-- SPEED -->

                <div class="settings-group">

                    <label>

                        Streaming Speed

                    </label>

                    <input
                        type="range"
                        min="1"
                        max="20"
                        value="${asnovaSettings.streamSpeed}"
                        id="speedSlider"
                        oninput="updateSpeed(this.value)">

                    <div
                        class="speed-value"
                        id="speedValue">

                        ${asnovaSettings.streamSpeed}

                    </div>

                </div>

                <!-- ACCENT -->

                <div class="settings-group">

                    <label>

                        Accent Color

                    </label>

                    <div class="accent-options">

                        <button
                            class="accent-btn"
                            style="background:#3b82f6"
                            onclick="changeAccent('#3b82f6')">

                        </button>

                        <button
                            class="accent-btn"
                            style="background:#8b5cf6"
                            onclick="changeAccent('#8b5cf6')">

                        </button>

                        <button
                            class="accent-btn"
                            style="background:#06b6d4"
                            onclick="changeAccent('#06b6d4')">

                        </button>

                        <button
                            class="accent-btn"
                            style="background:#10b981"
                            onclick="changeAccent('#10b981')">

                        </button>

                        <button
                            class="accent-btn"
                            style="background:#f59e0b"
                            onclick="changeAccent('#f59e0b')">

                        </button>

                    </div>

                </div>

            </div>

        </div>
        `;

    document.body.appendChild(
        modal
    );

    // LOAD VALUES

    document.getElementById(
        "modelSelect"
    ).value =
        asnovaSettings.model;

    document.getElementById(
        "styleSelect"
    ).value =
        asnovaSettings.responseStyle;
}

// ========================================
// CLOSE SETTINGS
// ========================================

function closeSettingsModal() {

    let modal =
        document.getElementById(
            "settingsModal"
        );

    if (modal) {

        modal.remove();
    }
}

// ========================================
// UPDATE MODEL
// ========================================

function updateModel() {

    let value =
        document.getElementById(
            "modelSelect"
        ).value;

    asnovaSettings.model =
        value;

    localStorage.setItem(

        "asnova_model",

        value
    );
}

// ========================================
// UPDATE STYLE
// ========================================

function updateStyle() {

    let value =
        document.getElementById(
            "styleSelect"
        ).value;

    asnovaSettings.responseStyle =
        value;

    localStorage.setItem(

        "asnova_style",

        value
    );
}

// ========================================
// UPDATE SPEED
// ========================================

function updateSpeed(value) {

    asnovaSettings.streamSpeed =
        value;

    localStorage.setItem(

        "asnova_speed",

        value
    );

    document.getElementById(
        "speedValue"
    ).innerHTML =
        value;
}

// ========================================
// CHANGE ACCENT
// ========================================

function changeAccent(color) {

    asnovaSettings.accentColor =
        color;

    localStorage.setItem(

        "asnova_accent",

        color
    );

    document.documentElement
        .style
        .setProperty(

            "--accent-color",

            color
        );
}

// ========================================
// APPLY SETTINGS
// ========================================

window.addEventListener(

    "load",

    function() {

        document.documentElement
            .style
            .setProperty(

                "--accent-color",

                asnovaSettings.accentColor
            );
    }
);