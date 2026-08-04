const API_BASE_URL = "/api";

/**
 * Return the saved JWT token.
 */
function getToken() {
    return localStorage.getItem("token");
}

/**
 * Send an HTTP request to the ISMS API.
 *
 * @param {string} endpoint
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        ...options.headers
    };

    /*
     * Only add Content-Type when a request body is present.
     * DELETE requests may not contain a body.
     */
    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    /*
     * A 204 response has no response body.
     */
    if (response.status === 204) {
        return null;
    }

    const contentType =
        response.headers.get("content-type");

    let data = null;

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    /*
     * Redirect to login when the token is missing,
     * invalid, or expired.
     */
    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login.html";

        throw new Error(
            data?.message ||
            "Your session has expired."
        );
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
}