// PLAY MUSIC

async function playMusic() {

    let input =
        document.getElementById(
            "musicInput"
        );

    let query =
        input.value;

    // VALIDATION

    if (
        query.trim() === ""
    ) {

        alert(
            "Enter music name."
        );

        return;
    }

    // PLAYER

    let player =
        document.getElementById(
            "musicPlayer"
        );

    // LOADING

    player.innerHTML =
        `
        <div class="typing-loader">

            🎵 Searching music...

        </div>
        `;

    try {

        // API CALL

        let response =
            await fetch(

                `${API_BASE_URL}/music?query=${encodeURIComponent(query)}`
            );

        let data =
            await response.json();

        // SUCCESS

        if (
            data.success
        ) {

            player.innerHTML =
                `
                <iframe
                    src="${data.embed_url}?autoplay=1"
                    allow="autoplay"
                    allowfullscreen>

                </iframe>
                `;

        }

        // ERROR

        else {

            player.innerHTML =
                `
                Music not found.
                `;
        }

    } catch {

        player.innerHTML =
            `
            Backend connection error.
            `;
    }
}