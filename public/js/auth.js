/**
 * Check whether the user has a saved JWT token.
 *
 * Protected pages should call this function.
 */
function requireAuthentication() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return false;
    }

    return true;
}

/**
 * Return the saved user object.
 */
function getLoggedInUser() {
    const savedUser =
        localStorage.getItem("user");

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch (error) {
        console.error(
            "Unable to parse stored user:",
            error
        );

        return null;
    }
}

/**
 * Clear authentication information and return
 * the user to the login page.
 */
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login.html";
}