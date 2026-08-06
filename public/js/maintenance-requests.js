requireAuthentication();
renderLayout("maintenance");

const requestFormPanel =
    document.getElementById("requestFormPanel");

const requestForm =
    document.getElementById("requestForm");

const requestFormTitle =
    document.getElementById("requestFormTitle");

const requestIdInput =
    document.getElementById("requestId");

const titleInput =
    document.getElementById("title");

const requestTypeInput =
    document.getElementById("requestType");

const priorityInput =
    document.getElementById("priority");

const statusInput =
    document.getElementById("status");

const siteIdInput =
    document.getElementById("siteId");

const assetIdInput =
    document.getElementById("assetId");

const raisedByInput =
    document.getElementById("raisedBy");

const assignedToInput =
    document.getElementById("assignedTo");

const vendorIdInput =
    document.getElementById("vendorId");

const targetDateInput =
    document.getElementById("targetDate");

const descriptionInput =
    document.getElementById("description");

const showRequestFormButton =
    document.getElementById("showRequestFormButton");

const cancelRequestButton =
    document.getElementById("cancelRequestButton");

const refreshRequestsButton =
    document.getElementById("refreshRequestsButton");

const requestSearchInput =
    document.getElementById("requestSearch");

const requestsTableBody =
    document.getElementById("requestsTableBody");

const requestsMessage =
    document.getElementById("requestsMessage");

const requestFormMessage =
    document.getElementById("requestFormMessage");

let maintenanceRequests = [];
let sites = [];
let assets = [];
let users = [];
let vendors = [];

function extractArray(data, propertyNames = []) {
    if (Array.isArray(data)) {
        return data;
    }

    for (const propertyName of propertyNames) {
        if (Array.isArray(data?.[propertyName])) {
            return data[propertyName];
        }
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function getRequestId(item) {
    return (
        item.RequestId ??
        item.requestId ??
        item.id ??
        ""
    );
}

function getTicketNo(item) {
    return (
        item.TicketNo ??
        item.ticketNo ??
        ""
    );
}

function getTitle(item) {
    return (
        item.Title ??
        item.title ??
        ""
    );
}

function getDescription(item) {
    return (
        item.Description ??
        item.description ??
        ""
    );
}

function getRequestType(item) {
    return (
        item.RequestType ??
        item.requestType ??
        ""
    );
}

function getPriority(item) {
    return (
        item.Priority ??
        item.priority ??
        ""
    );
}

function getStatus(item) {
    return (
        item.Status ??
        item.status ??
        ""
    );
}

function getSiteId(item) {
    return (
        item.SiteId ??
        item.siteId ??
        ""
    );
}

function getSiteName(item) {
    return (
        item.SiteName ??
        item.siteName ??
        ""
    );
}

function getAssetId(item) {
    return (
        item.AssetId ??
        item.assetId ??
        ""
    );
}

function getAssetName(item) {
    return (
        item.AssetName ??
        item.assetName ??
        ""
    );
}

function getAssetTag(item) {
    return (
        item.AssetTag ??
        item.assetTag ??
        ""
    );
}

function getRaisedBy(item) {
    return (
        item.RaisedBy ??
        item.raisedBy ??
        ""
    );
}

function getRaisedByName(item) {
    return (
        item.RaisedByName ??
        item.raisedByName ??
        ""
    );
}

function getAssignedTo(item) {
    return (
        item.AssignedTo ??
        item.assignedTo ??
        ""
    );
}

function getAssignedToName(item) {
    return (
        item.AssignedToName ??
        item.assignedToName ??
        ""
    );
}

function getVendorId(item) {
    return (
        item.VendorId ??
        item.vendorId ??
        ""
    );
}

function getVendorName(item) {
    return (
        item.VendorName ??
        item.vendorName ??
        ""
    );
}

function getDateRaised(item) {
    return (
        item.DateRaised ??
        item.dateRaised ??
        ""
    );
}

function getTargetDate(item) {
    return (
        item.TargetDate ??
        item.targetDate ??
        ""
    );
}

async function loadPageData() {
    requestsMessage.textContent = "";
    requestFormMessage.textContent = "";

    requestsTableBody.innerHTML = `
        <tr>
            <td colspan="14">
                Loading maintenance requests...
            </td>
        </tr>
    `;

    try {
        const results = await Promise.all([
            apiRequest("/maintenance-requests"),
            apiRequest("/sites"),
            apiRequest("/assets"),
            apiRequest("/users"),
            apiRequest("/vendors")
        ]);

        maintenanceRequests = extractArray(
            results[0],
            ["maintenanceRequests", "requests"]
        );

        sites = extractArray(
            results[1],
            ["sites"]
        );

        assets = extractArray(
            results[2],
            ["assets"]
        );

        users = extractArray(
            results[3],
            ["users"]
        );

        vendors = extractArray(
            results[4],
            ["vendors"]
        );

        populateDropdowns();
        renderRequests(maintenanceRequests);
    } catch (error) {
        requestsTableBody.innerHTML = `
            <tr>
                <td colspan="14">
                    Unable to load maintenance requests.
                </td>
            </tr>
        `;

        showMessage(
            requestsMessage,
            error.message,
            "error"
        );
    }
}

function populateDropdowns() {
    populateSites();
    populateAssets();
    populateUsers();
    populateVendors();
}

function populateSites() {
    siteIdInput.innerHTML = `
        <option value="">
            Select site
        </option>
    `;

    sites.forEach((site) => {
        const id =
            site.SiteId ??
            site.siteId ??
            site.id;

        const name =
            site.SiteName ??
            site.siteName ??
            site.name;

        siteIdInput.insertAdjacentHTML(
            "beforeend",
            `
                <option value="${escapeHtml(id)}">
                    ${escapeHtml(name)}
                </option>
            `
        );
    });
}

function populateAssets(selectedSiteId = "") {
    assetIdInput.innerHTML = `
        <option value="">
            Select asset
        </option>
    `;

    const availableAssets = selectedSiteId
        ? assets.filter((asset) =>
            String(
                asset.SiteId ??
                asset.siteId
            ) === String(selectedSiteId)
        )
        : assets;

    availableAssets.forEach((asset) => {
        const id =
            asset.AssetId ??
            asset.assetId ??
            asset.id;

        const name =
            asset.AssetName ??
            asset.assetName ??
            "";

        const tag =
            asset.AssetTag ??
            asset.assetTag ??
            "";

        assetIdInput.insertAdjacentHTML(
            "beforeend",
            `
                <option value="${escapeHtml(id)}">
                    ${escapeHtml(name)}
                    ${tag ? ` (${escapeHtml(tag)})` : ""}
                </option>
            `
        );
    });
}

function populateUsers() {
    raisedByInput.innerHTML = `
        <option value="">
            Select user
        </option>
    `;

    assignedToInput.innerHTML = `
        <option value="">
            Not assigned
        </option>
    `;

    users.forEach((user) => {
        const id =
            user.UserId ??
            user.userId ??
            user.id;

        const name =
            user.FullName ??
            user.fullName ??
            user.name;

        const option = `
            <option value="${escapeHtml(id)}">
                ${escapeHtml(name)}
            </option>
        `;

        raisedByInput.insertAdjacentHTML(
            "beforeend",
            option
        );

        assignedToInput.insertAdjacentHTML(
            "beforeend",
            option
        );
    });
}

function populateVendors() {
    vendorIdInput.innerHTML = `
        <option value="">
            No vendor
        </option>
    `;

    vendors.forEach((vendor) => {
        const id =
            vendor.VendorId ??
            vendor.vendorId ??
            vendor.id;

        const name =
            vendor.VendorName ??
            vendor.vendorName ??
            vendor.name;

        vendorIdInput.insertAdjacentHTML(
            "beforeend",
            `
                <option value="${escapeHtml(id)}">
                    ${escapeHtml(name)}
                </option>
            `
        );
    });
}

function renderRequests(requestList) {
    requestsTableBody.innerHTML = "";

    if (requestList.length === 0) {
        requestsTableBody.innerHTML = `
            <tr>
                <td colspan="14">
                    No maintenance requests found.
                </td>
            </tr>
        `;

        return;
    }

    requestList.forEach((item) => {
        const requestId = getRequestId(item);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(requestId)}
            </td>

            <td>
                ${escapeHtml(getTicketNo(item))}
            </td>

<td>
    <strong>
        ${escapeHtml(getTitle(item))}
    </strong>

    ${getDescription(item)
                ? `
                <div class="request-description">
                    ${escapeHtml(
                    getDescription(item)
                )}
                </div>
            `
                : ""
            }
</td>

            <td>
                ${escapeHtml(getRequestType(item))}
            </td>

            <td>
                <span class="${getPriorityClass(
                getPriority(item)
            )}">
                    ${escapeHtml(getPriority(item))}
                </span>
            </td>

            <td>
                <span class="${getRequestStatusClass(
                getStatus(item)
            )}">
                    ${escapeHtml(getStatus(item))}
                </span>
            </td>

            <td>
                ${escapeHtml(getSiteName(item))}
            </td>

            <td>
                ${escapeHtml(getAssetName(item))}
                ${getAssetTag(item)
                ? `<br><small>${escapeHtml(
                    getAssetTag(item)
                )}</small>`
                : ""
            }
            </td>

            <td>
                ${escapeHtml(getRaisedByName(item))}
            </td>

            <td>
                ${escapeHtml(
                getAssignedToName(item)
            ) || "Not assigned"
            }
            </td>

            <td>
                ${escapeHtml(
                getVendorName(item)
            ) || "—"
            }
            </td>

            <td>
                ${formatDateTime(
                getDateRaised(item)
            )}
            </td>

            <td>
                ${formatDateOnly(
                getTargetDate(item)
            )}
            </td>

            <td class="action-cell">
                <button
                    class="small-button edit-button"
                    type="button"
                    data-action="edit"
                    data-request-id="${escapeHtml(requestId)}"
                >
                    Edit
                </button>

                <button
                    class="small-button delete-button"
                    type="button"
                    data-action="delete"
                    data-request-id="${escapeHtml(requestId)}"
                >
                    Delete
                </button>
            </td>
        `;

        requestsTableBody.appendChild(row);
    });
}

function openCreateRequestForm() {
    resetRequestForm();

    requestFormTitle.textContent =
        "Add Maintenance Request";

    setDefaultRaisedBy();

    requestFormPanel.classList.remove(
        "hidden"
    );

    titleInput.focus();
}

function setDefaultRaisedBy() {
    const loggedInUser =
        getLoggedInUser();

    const loggedInUserId =
        loggedInUser?.UserId ??
        loggedInUser?.userId ??
        loggedInUser?.id;

    if (loggedInUserId) {
        raisedByInput.value =
            String(loggedInUserId);
    }
}

function openEditRequestForm(requestId) {
    const item = maintenanceRequests.find(
        (requestItem) =>
            String(getRequestId(requestItem)) ===
            String(requestId)
    );

    if (!item) {
        showMessage(
            requestsMessage,
            "Maintenance request was not found.",
            "error"
        );

        return;
    }

    resetRequestForm();

    requestFormTitle.textContent =
        "Edit Maintenance Request";

    requestIdInput.value =
        getRequestId(item);

    titleInput.value =
        getTitle(item);

    descriptionInput.value =
        getDescription(item);

    requestTypeInput.value =
        getRequestType(item);

    priorityInput.value =
        getPriority(item);

    statusInput.value =
        getStatus(item);

    siteIdInput.value =
        getSiteId(item);

    populateAssets(getSiteId(item));

    assetIdInput.value =
        getAssetId(item);

    raisedByInput.value =
        getRaisedBy(item);

    assignedToInput.value =
        getAssignedTo(item) || "";

    vendorIdInput.value =
        getVendorId(item) || "";

    targetDateInput.value =
        toDateInputValue(
            getTargetDate(item)
        );

    requestFormPanel.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

siteIdInput.addEventListener(
    "change",
    () => {
        populateAssets(siteIdInput.value);
    }
);

requestForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        requestFormMessage.textContent = "";

        const requestId =
            requestIdInput.value.trim();

        const requestData = {
            title:
                titleInput.value.trim(),

            description:
                descriptionInput.value.trim(),

            requestType:
                requestTypeInput.value,

            priority:
                priorityInput.value,

            status:
                statusInput.value,

            siteId:
                Number(siteIdInput.value),

            assetId:
                Number(assetIdInput.value),

            raisedBy:
                Number(raisedByInput.value),

            assignedTo:
                assignedToInput.value
                    ? Number(
                        assignedToInput.value
                    )
                    : null,

            vendorId:
                vendorIdInput.value
                    ? Number(
                        vendorIdInput.value
                    )
                    : null,

            targetDate:
                targetDateInput.value ||
                null
        };

        if (!requestData.title) {
            showMessage(
                requestFormMessage,
                "Title is required.",
                "error"
            );

            return;
        }

        if (!requestData.requestType) {
            showMessage(
                requestFormMessage,
                "Request type is required.",
                "error"
            );

            return;
        }

        if (!requestData.priority) {
            showMessage(
                requestFormMessage,
                "Priority is required.",
                "error"
            );

            return;
        }

        if (
            !Number.isInteger(requestData.siteId) ||
            requestData.siteId <= 0
        ) {
            showMessage(
                requestFormMessage,
                "Please select a valid site.",
                "error"
            );

            return;
        }

        if (
            !Number.isInteger(requestData.assetId) ||
            requestData.assetId <= 0
        ) {
            showMessage(
                requestFormMessage,
                "Please select a valid asset.",
                "error"
            );

            return;
        }

        if (
            !Number.isInteger(requestData.raisedBy) ||
            requestData.raisedBy <= 0
        ) {
            showMessage(
                requestFormMessage,
                "Please select the user who raised the request.",
                "error"
            );

            return;
        }

        try {
            if (requestId) {
                await apiRequest(
                    `/maintenance-requests/${requestId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            requestData
                        )
                    }
                );

                showMessage(
                    requestsMessage,
                    "Maintenance request updated successfully.",
                    "success"
                );
            } else {
                await apiRequest(
                    "/maintenance-requests",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            requestData
                        )
                    }
                );

                showMessage(
                    requestsMessage,
                    "Maintenance request created successfully.",
                    "success"
                );
            }

            closeRequestForm();
            await loadPageData();
        } catch (error) {
            showMessage(
                requestFormMessage,
                error.message,
                "error"
            );
        }
    }
);

requestsTableBody.addEventListener(
    "click",
    async (event) => {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const requestId =
            button.dataset.requestId;

        const action =
            button.dataset.action;

        if (action === "edit") {
            openEditRequestForm(requestId);
        }

        if (action === "delete") {
            await deleteRequest(requestId);
        }
    }
);

async function deleteRequest(requestId) {
    const item = maintenanceRequests.find(
        (requestItem) =>
            String(getRequestId(requestItem)) ===
            String(requestId)
    );

    const ticket =
        item
            ? getTicketNo(item)
            : `ID ${requestId}`;

    const confirmed =
        window.confirm(
            `Delete maintenance request "${ticket}"?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(
            `/maintenance-requests/${requestId}`,
            {
                method: "DELETE"
            }
        );

        showMessage(
            requestsMessage,
            "Maintenance request deleted successfully.",
            "success"
        );

        await loadPageData();
    } catch (error) {
        showMessage(
            requestsMessage,
            error.message,
            "error"
        );
    }
}

requestSearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            requestSearchInput.value
                .trim()
                .toLowerCase();

        if (!searchTerm) {
            renderRequests(
                maintenanceRequests
            );

            return;
        }

        const filteredRequests =
            maintenanceRequests.filter(
                (item) => {
                    const values = [
                        getRequestId(item),
                        getTicketNo(item),
                        getTitle(item),
                        getDescription(item),
                        getRequestType(item),
                        getPriority(item),
                        getStatus(item),
                        getSiteName(item),
                        getAssetName(item),
                        getAssetTag(item),
                        getRaisedByName(item),
                        getAssignedToName(item),
                        getVendorName(item),
                        getDateRaised(item),
                        getTargetDate(item)
                    ];

                    return values.some(
                        (value) =>
                            String(value ?? "")
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                )
                    );
                }
            );

        renderRequests(filteredRequests);
    }
);

function closeRequestForm() {
    resetRequestForm();

    requestFormPanel.classList.add(
        "hidden"
    );
}

function resetRequestForm() {
    requestForm.reset();

    requestIdInput.value = "";
    statusInput.value = "Open";

    populateAssets();

    requestFormMessage.textContent = "";
    requestFormMessage.className =
        "page-message";
}

function toDateInputValue(value) {
    if (!value) {
        return "";
    }

    return String(value).slice(0, 10);
}

function formatDateOnly(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
    }

    return date.toLocaleDateString();
}

function formatDateTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
    }

    return date.toLocaleString();
}

function getPriorityClass(priority) {
    const value =
        String(priority)
            .trim()
            .toLowerCase();

    if (value === "critical") {
        return "status-badge critical-priority";
    }

    if (value === "high") {
        return "status-badge high-priority";
    }

    if (value === "medium") {
        return "status-badge medium-priority";
    }

    return "status-badge low-priority";
}

function getRequestStatusClass(status) {
    const value =
        String(status)
            .trim()
            .toLowerCase();

    if (
        value === "completed" ||
        value === "closed"
    ) {
        return "status-badge active-status";
    }

    if (
        value === "in progress" ||
        value === "assigned"
    ) {
        return "status-badge progress-status";
    }

    if (value === "pending vendor") {
        return "status-badge maintenance-status";
    }

    if (value === "cancelled") {
        return "status-badge retired-status";
    }

    return "status-badge open-status";
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

showRequestFormButton.addEventListener(
    "click",
    openCreateRequestForm
);

cancelRequestButton.addEventListener(
    "click",
    closeRequestForm
);

refreshRequestsButton.addEventListener(
    "click",
    loadPageData
);

loadPageData();