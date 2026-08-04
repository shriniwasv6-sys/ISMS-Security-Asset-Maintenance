requireAuthentication();
renderLayout("sites");

const siteFormPanel =
    document.getElementById("siteFormPanel");

const siteForm =
    document.getElementById("siteForm");

const siteFormTitle =
    document.getElementById("siteFormTitle");

const siteIdInput =
    document.getElementById("siteId");

const siteNameInput =
    document.getElementById("siteName");

const addressInput =
    document.getElementById("address");

const contactPersonInput =
    document.getElementById("contactPerson");

const contactNumberInput =
    document.getElementById("contactNumber");

const showSiteFormButton =
    document.getElementById("showSiteFormButton");

const cancelSiteButton =
    document.getElementById("cancelSiteButton");

const refreshSitesButton =
    document.getElementById("refreshSitesButton");

const siteSearchInput =
    document.getElementById("siteSearch");

const sitesTableBody =
    document.getElementById("sitesTableBody");

const sitesMessage =
    document.getElementById("sitesMessage");

const siteFormMessage =
    document.getElementById("siteFormMessage");

let sites = [];

function extractSites(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.sites)) {
        return data.sites;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function getSiteId(site) {
    return (
        site.SiteId ??
        site.siteId ??
        site.site_id ??
        site.id
    );
}

function getSiteName(site) {
    return (
        site.SiteName ??
        site.siteName ??
        site.site_name ??
        site.name ??
        ""
    );
}

function getAddress(site) {
    return (
        site.Address ??
        site.address ??
        site.Location ??
        site.location ??
        ""
    );
}

function getContactPerson(site) {
    return (
        site.ContactPerson ??
        site.contactPerson ??
        site.contact_person ??
        ""
    );
}

function getContactNumber(site) {
    return (
        site.ContactNumber ??
        site.contactNumber ??
        site.contact_number ??
        site.phone ??
        ""
    );
}

function getCreatedAt(site) {
    return (
        site.CreatedAt ??
        site.createdAt ??
        site.created_at ??
        ""
    );
}

async function loadSites() {
    sitesMessage.textContent = "";

    sitesTableBody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading sites...
            </td>
        </tr>
    `;

    try {
        const data = await apiRequest("/sites");

        sites = extractSites(data);

        renderSites(sites);
    } catch (error) {
        sites = [];

        sitesTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load sites.
                </td>
            </tr>
        `;

        showMessage(
            sitesMessage,
            error.message,
            "error"
        );
    }
}

function renderSites(siteList) {
    sitesTableBody.innerHTML = "";

    if (siteList.length === 0) {
        sitesTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No sites found.
                </td>
            </tr>
        `;

        return;
    }

    siteList.forEach((site) => {
        const siteId = getSiteId(site);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(siteId)}</td>
            <td>${escapeHtml(getSiteName(site))}</td>
            <td>${escapeHtml(getAddress(site))}</td>
            <td>${escapeHtml(getContactPerson(site))}</td>
            <td>${escapeHtml(getContactNumber(site))}</td>
            <td>${formatDate(getCreatedAt(site))}</td>

            <td class="action-cell">
                <button
                    class="small-button edit-button"
                    type="button"
                    data-action="edit"
                    data-site-id="${siteId}"
                >
                    Edit
                </button>

                <button
                    class="small-button delete-button"
                    type="button"
                    data-action="delete"
                    data-site-id="${siteId}"
                >
                    Delete
                </button>
            </td>
        `;

        sitesTableBody.appendChild(row);
    });
}

function openCreateSiteForm() {
    resetSiteForm();

    siteFormTitle.textContent =
        "Add Site";

    siteFormPanel.classList.remove(
        "hidden"
    );

    siteNameInput.focus();
}

function openEditSiteForm(siteId) {
    const site = sites.find(
        (item) =>
            String(getSiteId(item)) ===
            String(siteId)
    );

    if (!site) {
        showMessage(
            sitesMessage,
            "Site record was not found.",
            "error"
        );

        return;
    }

    resetSiteForm();

    siteFormTitle.textContent =
        "Edit Site";

    siteIdInput.value =
        getSiteId(site);

    siteNameInput.value =
        getSiteName(site);

    addressInput.value =
        getAddress(site);

    contactPersonInput.value =
        getContactPerson(site);

    contactNumberInput.value =
        getContactNumber(site);

    siteFormPanel.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

siteForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        siteFormMessage.textContent = "";

        const siteId =
            siteIdInput.value.trim();

        const siteData = {
            siteName:
                siteNameInput.value.trim(),

            address:
                addressInput.value.trim(),

            contactPerson:
                contactPersonInput.value.trim(),

            contactNumber:
                contactNumberInput.value.trim()
        };

        try {
            if (siteId) {
                await apiRequest(
                    `/sites/${siteId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            siteData
                        )
                    }
                );

                showMessage(
                    sitesMessage,
                    "Site updated successfully.",
                    "success"
                );
            } else {
                await apiRequest(
                    "/sites",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            siteData
                        )
                    }
                );

                showMessage(
                    sitesMessage,
                    "Site created successfully.",
                    "success"
                );
            }

            closeSiteForm();
            await loadSites();
        } catch (error) {
            showMessage(
                siteFormMessage,
                error.message,
                "error"
            );
        }
    }
);

sitesTableBody.addEventListener(
    "click",
    async (event) => {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const siteId =
            button.dataset.siteId;

        const action =
            button.dataset.action;

        if (action === "edit") {
            openEditSiteForm(siteId);
        }

        if (action === "delete") {
            await deleteSite(siteId);
        }
    }
);

async function deleteSite(siteId) {
    const site = sites.find(
        (item) =>
            String(getSiteId(item)) ===
            String(siteId)
    );

    const siteName =
        site
            ? getSiteName(site)
            : `ID ${siteId}`;

    const confirmed =
        window.confirm(
            `Delete site "${siteName}"?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(
            `/sites/${siteId}`,
            {
                method: "DELETE"
            }
        );

        showMessage(
            sitesMessage,
            "Site deleted successfully.",
            "success"
        );

        await loadSites();
    } catch (error) {
        showMessage(
            sitesMessage,
            error.message,
            "error"
        );
    }
}

siteSearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            siteSearchInput.value
                .trim()
                .toLowerCase();

        if (!searchTerm) {
            renderSites(sites);
            return;
        }

        const filteredSites =
            sites.filter((site) => {
                const values = [
                    getSiteId(site),
                    getSiteName(site),
                    getAddress(site),
                    getContactPerson(site),
                    getContactNumber(site)
                ];

                return values.some(
                    (value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchTerm)
                );
            });

        renderSites(filteredSites);
    }
);

function closeSiteForm() {
    resetSiteForm();

    siteFormPanel.classList.add(
        "hidden"
    );
}

function resetSiteForm() {
    siteForm.reset();

    siteIdInput.value = "";

    siteFormMessage.textContent = "";
    siteFormMessage.className =
        "page-message";
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
    }

    return date.toLocaleString();
}

function showMessage(
    element,
    message,
    type
) {
    element.textContent = message;

    element.className =
        `page-message ${type}-message`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

showSiteFormButton.addEventListener(
    "click",
    openCreateSiteForm
);

cancelSiteButton.addEventListener(
    "click",
    closeSiteForm
);

refreshSitesButton.addEventListener(
    "click",
    loadSites
);

loadSites();