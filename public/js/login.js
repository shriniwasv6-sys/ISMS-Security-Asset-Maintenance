const loginForm =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

/*
 * If a token already exists, send the user
 * directly to the dashboard.
 */
const existingToken =
    localStorage.getItem("token");

if (existingToken) {
    window.location.href =
        "/dashboard.html";
}

loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        loginMessage.textContent = "";
        loginMessage.className =
            "login-message";

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        if (!email || !password) {
            showLoginError(
                "Email and password are required."
            );

            return;
        }

        loginButton.disabled = true;
        loginButton.textContent =
            "Signing In...";

        try {
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Login failed."
                );
            }

            /*
             * Support common backend response shapes.
             */
            const token =
                data.token ||
                data.accessToken ||
                data.data?.token;

            const user =
                data.user ||
                data.data?.user ||
                {
                    email
                };

            if (!token) {
                throw new Error(
                    "Login succeeded, but no token was returned."
                );
            }

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            loginMessage.className =
                "login-message success-message";

            loginMessage.textContent =
                "Login successful. Redirecting...";

            window.location.href =
                "/dashboard.html";
        } catch (error) {
            showLoginError(error.message);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent =
                "Sign In";
        }
    }
);

function showLoginError(message) {
    loginMessage.className =
        "login-message error-message";

    loginMessage.textContent = message;
}