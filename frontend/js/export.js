// EXPORT CHAT

function exportChat() {

    let messages =
        document.querySelectorAll(
            ".message"
        );

    let pins =
        document.querySelectorAll(
            ".pinned-text"
        );

    let content =
        "========== ASnova AI ==========\n\n";

    // DATE

    let now =
        new Date();

    content +=
        `Exported On: ${now.toLocaleString()}\n\n`;

    content +=
        "========== CHAT HISTORY ==========\n\n";

    // CHATS

    messages.forEach(message => {

        // USER

        if (
            message.classList.contains(
                "user"
            )
        ) {

            content +=
                `👤 USER:\n`;

            content +=
                `${message.innerText}\n\n`;
        }

        // AI

        else {

            content +=
                `🤖 ASNOVA AI:\n`;

            content +=
                `${message.innerText}\n\n`;
        }
    });

    // PINNED NOTES

    if (pins.length > 0) {

        content +=
            "========== PINNED NOTES ==========\n\n";

        pins.forEach(pin => {

            content +=
                `📌 ${pin.innerText}\n\n`;
        });
    }

    // CREATE FILE

    let blob =
        new Blob(

            [content],

            {
                type: "text/plain"
            }
        );

    let link =
        document.createElement("a");

    // FILENAME

    let date =
        now.toISOString()
        .split("T")[0];

    link.href =
        URL.createObjectURL(blob);

    link.download =
        `ASnova_Export_${date}.txt`;

    // DOWNLOAD

    link.click();
}