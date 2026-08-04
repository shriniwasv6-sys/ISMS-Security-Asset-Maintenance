function renderLayout(activePage) {
    const user = getLoggedInUser();

    const userName =
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.email ||
        "ISMS User";

    const sidebar =
        document.getElementById("sidebar");

    const topbar =
        document.getElementById("topbar");

    if (sidebar) {
        sidebar.innerHTML = `
            <div class="brand">
                <div class="brand-logo">ISMS</div>

                <div>
                    <strong>Security Asset</strong>
                    <small>Maintenance System</small>
                </div>
            </div>

            <nav class="navigation">
                ${createMenuLink(
                    "dashboard",
                    "/dashboard.html",
                    "Dashboard",
                    activePage
                )}

                ${createMenuLink(
                    "users",
                    "/users.html",
                    "Users",
                    activePage
                )}

                ${createMenuLink(
                    "sites",
                    "/sites.html",
                    "Sites",
                    activePage
                )}

                ${createMenuLink(
                    "vendors",
                    "/vendors.html",
                    "Vendors",
                    activePage
                )}

                ${createMenuLink(
                    "categories",
                    "/asset-categories.html",
                    "Asset Categories",
                    activePage
                )}

                ${createMenuLink(
                    "assets",
                    "/assets.html",
                    "Assets",
                    activePage
                )}

                ${createMenuLink(
                    "maintenance",
                    "/maintenance-requests.html",
                    "Maintenance Requests",
                    activePage
                )}

                ${createMenuLink(
                    "reports",
                    "/reports.html",
                    "Reports",
                    activePage
                )}

                ${createMenuLink(
                    "settings",
                    "/settings.html",
                    "Settings",
                    activePage
                )}
            </nav>

            <button
                class="sidebar-logout"
                type="button"
                onclick="logout()"
            >
                Logout
            </button>
        `;
    }

    if (topbar) {
        topbar.innerHTML = `
            <button
                id="menuToggle"
                class="menu-toggle"
                type="button"
                aria-label="Toggle navigation"
            >
                ☰
            </button>

            <div class="topbar-title">
                Integrated Security Management System
            </div>

            <div class="user-profile">
                <div class="user-avatar">
                    ${getInitials(userName)}
                </div>

                <div>
                    <strong>${escapeHtml(userName)}</strong>
                    <small>Logged in</small>
                </div>
            </div>
        `;
    }

    const menuToggle =
        document.getElementById("menuToggle");

    if (menuToggle) {
        menuToggle.addEventListener(
            "click",
            () => {
                document.body.classList.toggle(
                    "sidebar-collapsed"
                );
            }
        );
    }
}

function createMenuLink(
    pageName,
    href,
    label,
    activePage
) {
    const activeClass =
        pageName === activePage
            ? "active"
            : "";

    return `
        <a
            class="nav-link ${activeClass}"
            href="${href}"
        >
            ${label}
        </a>
    `;
}

function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) =>
            part[0].toUpperCase()
        )
        .join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}