// ========================================
// API CONFIG
// ========================================

// LOCAL BACKEND

const LOCAL_API =
    "http://127.0.0.1:8000";

// DEPLOYED BACKEND
// CHANGE LATER

const LIVE_API =
    "https://your-backend-url.onrender.com";

// AUTO DETECT

const API_BASE_URL =

    window.location.hostname ===
    "127.0.0.1"

    ||

    window.location.hostname ===
    "localhost"

    ?

    LOCAL_API

    :

    LIVE_API;