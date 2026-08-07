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

/*
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

    if (Array.isArray(data?.assetCategories)) {
        return data.assetCategories;
    }

    if (Array.isArray(data?.assets)) {
        return data.assets;
    }

    if (Array.isArray(data?.requests)) {
        return data.requests;
    }

    if (Array.isArray(data?.maintenanceRequests)) {
        return data.maintenanceRequests;
    }

    return [];
}

async function loadDashboard() {
    dashboardMessage.textContent = "";

    try {
        /*
         * Load all dashboard data.
         * Promise.allSettled allows other cards
         * to continue loading if one API fails.
         */
        const results =
            await Promise.allSettled([
                apiRequest("/users"),
                apiRequest("/sites"),
                apiRequest("/vendors"),
                apiRequest(
                    "/asset-categories"
                ),
                apiRequest("/assets"),
                apiRequest(
                    "/maintenance-requests"
                )
            ]);

        const users =
            results[0].status ===
            "fulfilled"
                ? extractArray(
                    results[0].value
                )
                : [];

        const sites =
            results[1].status ===
            "fulfilled"
                ? extractArray(
                    results[1].value
                )
                : [];

        const vendors =
            results[2].status ===
            "fulfilled"
                ? extractArray(
                    results[2].value
                )
                : [];

        const categories =
            results[3].status ===
            "fulfilled"
                ? extractArray(
                    results[3].value
                )
                : [];

        const assets =
            results[4].status ===
            "fulfilled"
                ? extractArray(
                    results[4].value
                )
                : [];

        const requests =
            results[5].status ===
            "fulfilled"
                ? extractArray(
                    results[5].value
                )
                : [];

        document.getElementById(
            "totalUsers"
        ).textContent =
            users.length;

        document.getElementById(
            "totalSites"
        ).textContent =
            sites.length;

        document.getElementById(
            "totalVendors"
        ).textContent =
            vendors.length;

        document.getElementById(
            "totalCategories"
        ).textContent =
            categories.length;

        document.getElementById(
            "totalAssets"
        ).textContent =
            assets.length;

        /*
         * Count only requests whose status
         * is Open.
         */
        const openRequests =
            requests.filter(
                (request) => {
                    const status =
                        request.Status ??
                        request.status ??
                        "";

                    return (
                        String(status)
                            .trim()
                            .toLowerCase() ===
                        "open"
                    );
                }
            );

        document.getElementById(
            "openRequests"
        ).textContent =
            openRequests.length;

        /*
         * If any API failed, show a small
         * warning while keeping available data.
         */
        const failedResults =
            results.filter(
                (result) =>
                    result.status ===
                    "rejected"
            );

        if (
            failedResults.length > 0
        ) {
            dashboardMessage.textContent =
                `${failedResults.length} dashboard data source(s) could not be loaded.`;
        }

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
        const response =
            await fetch(
                "/api/v1/health"
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "System health check failed."
            );
        }

        statusElement.className =
            "status-message success-status";

        statusElement.innerHTML = `
            <strong>
                ${data.status}
            </strong>

            <span>
                Database:
                ${data.database}
            </span>

            <span>
                Version:
                ${data.version}
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