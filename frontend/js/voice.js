let voiceEnabled = true;

let selectedVoice = null;

// LOAD VOICES

function loadVoices() {

    let voices =
        speechSynthesis.getVoices();

    // INDIAN FEMALE VOICE

    selectedVoice =
        voices.find(

            voice =>

                (
                    voice.lang.includes("en-IN")
                    ||

                    voice.name
                    .toLowerCase()
                    .includes("india")
                )

                &&

                (
                    voice.name
                    .toLowerCase()
                    .includes("female")
                    ||

                    voice.name
                    .toLowerCase()
                    .includes("heera")
                    ||

                    voice.name
                    .toLowerCase()
                    .includes("zira")
                )
        );

    // FALLBACK

    if (!selectedVoice) {

        selectedVoice =
            voices.find(

                voice =>

                    voice.lang.includes("en")
            );
    }
}

// LOAD

speechSynthesis.onvoiceschanged =
    loadVoices;

// SPEAK TEXT

function speakText(text) {

    // DISABLED

    if (!voiceEnabled) return;

    // STOP OLD

    speechSynthesis.cancel();

    // CREATE

    let speech =
        new SpeechSynthesisUtterance(
            text
        );

    // VOICE

    speech.voice =
        selectedVoice;

    // SETTINGS

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    // VISUAL EFFECT

    document.body.classList.add(
        "speaking"
    );

    // REMOVE EFFECT

    speech.onend = () => {

        document.body.classList.remove(
            "speaking"
        );
    };

    // SPEAK

    speechSynthesis.speak(
        speech
    );
}

// TOGGLE VOICE

function toggleVoice() {

    voiceEnabled =
        !voiceEnabled;

    let button =
        document.getElementById(
            "voiceToggleBtn"
        );

    // ENABLED

    if (voiceEnabled) {

        button.innerText =
            "🔊 Voice ON";

        localStorage.setItem(

            "voice_enabled",

            "true"
        );

        speakText(
            "Voice assistant enabled."
        );
    }

    // DISABLED

    else {

        speechSynthesis.cancel();

        button.innerText =
            "🔇 Voice OFF";

        localStorage.setItem(

            "voice_enabled",

            "false"
        );
    }
}

// LOAD SETTINGS

window.addEventListener(

    "load",

    () => {

        // VOICE STATUS

        let saved =
            localStorage.getItem(
                "voice_enabled"
            );

        if (saved === "false") {

            voiceEnabled = false;

            document.getElementById(
                "voiceToggleBtn"
            ).innerText =
                "🔇 Voice OFF";
        }

        // LOAD VOICES

        loadVoices();
    }
);

// VOICE INPUT

function startListening() {

    // CHECK SUPPORT

    if (
        !(
            "webkitSpeechRecognition"
            in window
        )
    ) {

        alert(
            "Voice recognition not supported."
        );

        return;
    }

    let recognition =
        new webkitSpeechRecognition();

    // SETTINGS

    recognition.lang =
        "en-IN";

    recognition.continuous =
        false;

    recognition.interimResults =
        false;

    // START

    recognition.start();

    // INDICATOR

    let button =
        document.getElementById(
            "voiceToggleBtn"
        );

    button.innerText =
        "🎤 Listening...";

    // RESULT

    recognition.onresult =
        function(event) {

            let transcript =
                event.results[0][0]
                .transcript;

            document.getElementById(
                "prompt"
            ).value =
                transcript;

            button.innerText =
                voiceEnabled

                ?

                "🔊 Voice ON"

                :

                "🔇 Voice OFF";
        };

    // END

    recognition.onend =
        function() {

            button.innerText =
                voiceEnabled

                ?

                "🔊 Voice ON"

                :

                "🔇 Voice OFF";
        };

    // ERROR

    recognition.onerror =
        function() {

            button.innerText =
                voiceEnabled

                ?

                "🔊 Voice ON"

                :

                "🔇 Voice OFF";

            alert(
                "Voice recognition failed."
            );
        };
}