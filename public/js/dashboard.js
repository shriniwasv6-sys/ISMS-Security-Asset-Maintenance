requireAuthentication();
renderLayout("dashboard");

const dashboardMessage =
    document.getElementById(
        "dashboardMessage"
    );

const refreshButton =
    document.getElementById(
        "refreshDashboard"
    );

/**
 * Extract an array from different possible
 * backend response structures.
 */
function extractArray(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.users)) {
        return data.users;
    }

    if (Array.isArray(data?.sites)) {
        return data.sites;
    }

    if (Array.isArray(data?.vendors)) {
        return data.vendors;
    }

    if (Array.isArray(data?.categories)) {
        return data.categories;
    }

    return [];
}

async function loadDashboard() {
    dashboardMessage.textContent = "";

    try {
        /*
         * Promise.allSettled allows the dashboard
         * to continue loading even when one endpoint
         * is unavailable.
         */
        const results = await Promise.allSettled([
            apiRequest("/users"),
            apiRequest("/sites"),
            apiRequest("/vendors"),
            apiRequest("/asset-categories")
        ]);

        const users =
            results[0].status === "fulfilled"
                ? extractArray(results[0].value)
                : [];

        const sites =
            results[1].status === "fulfilled"
                ? extractArray(results[1].value)
                : [];

        const vendors =
            results[2].status === "fulfilled"
                ? extractArray(results[2].value)
                : [];

        const categories =
            results[3].status === "fulfilled"
                ? extractArray(results[3].value)
                : [];

        document.getElementById(
            "totalUsers"
        ).textContent = users.length;

        document.getElementById(
            "totalSites"
        ).textContent = sites.length;

        document.getElementById(
            "totalVendors"
        ).textContent = vendors.length;

        document.getElementById(
            "totalCategories"
        ).textContent =
            categories.length;

        /*
         * Assets and maintenance APIs are not yet
         * registered in the supplied app.js.
         */
        document.getElementById(
            "totalAssets"
        ).textContent = "—";

        document.getElementById(
            "openRequests"
        ).textContent = "—";

        await loadSystemStatus();
    } catch (error) {
        dashboardMessage.textContent =
            error.message;
    }
}

async function loadSystemStatus() {
    const statusElement =
        document.getElementById(
            "systemStatus"
        );

    try {
        const response = await fetch(
            "/api/v1/health"
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "System health check failed."
            );
        }

        statusElement.className =
            "status-message success-status";

        statusElement.innerHTML = `
            <strong>${data.status}</strong>
            <span>
                Database: ${data.database}
            </span>
            <span>
                Version: ${data.version}
            </span>
        `;
    } catch (error) {
        statusElement.className =
            "status-message error-status";

        statusElement.textContent =
            error.message;
    }
}

refreshButton.addEventListener(
    "click",
    loadDashboard
);

loadDashboard();