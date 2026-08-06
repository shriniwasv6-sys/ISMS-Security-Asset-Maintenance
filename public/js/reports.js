requireAuthentication();
renderLayout("reports");

const totalUsersElement =
    document.getElementById("totalUsers");

const totalSitesElement =
    document.getElementById("totalSites");

const totalVendorsElement =
    document.getElementById("totalVendors");

const totalCategoriesElement =
    document.getElementById("totalCategories");

const totalAssetsElement =
    document.getElementById("totalAssets");

const totalRequestsElement =
    document.getElementById("totalRequests");

const openRequestsElement =
    document.getElementById("openRequests");

const inProgressRequestsElement =
    document.getElementById("inProgressRequests");

const criticalRequestsElement =
    document.getElementById("criticalRequests");

const completedRequestsElement =
    document.getElementById("completedRequests");

const assetStatusReport =
    document.getElementById("assetStatusReport");

const requestPriorityReport =
    document.getElementById("requestPriorityReport");

const reportRequestsTableBody =
    document.getElementById(
        "reportRequestsTableBody"
    );

const reportSearchInput =
    document.getElementById("reportSearch");

const refreshReportButton =
    document.getElementById(
        "refreshReportButton"
    );

const exportCsvButton =
    document.getElementById("exportCsvButton");

const printReportButton =
    document.getElementById("printReportButton");

const reportStatusPanel =
    document.getElementById("reportStatusPanel");

const reportsMessage =
    document.getElementById("reportsMessage");

let reportData = {
    users: [],
    sites: [],
    vendors: [],
    categories: [],
    assets: [],
    requests: []
};

function extractArray(
    data,
    propertyNames = []
) {
    if (Array.isArray(data)) {
        return data;
    }

    for (const propertyName of propertyNames) {
        if (
            Array.isArray(
                data?.[propertyName]
            )
        ) {
            return data[propertyName];
        }
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

async function loadReportData() {
    clearMessage();

    reportStatusPanel.className =
        "status-message";

    reportStatusPanel.textContent =
        "Loading report information...";

    reportRequestsTableBody.innerHTML = `
        <tr>
            <td colspan="9">
                Loading report...
            </td>
        </tr>
    `;

    try {
        const results = await Promise.all([
            apiRequest("/users"),
            apiRequest("/sites"),
            apiRequest("/vendors"),
            apiRequest("/asset-categories"),
            apiRequest("/assets"),
            apiRequest("/maintenance-requests")
        ]);

        reportData.users = extractArray(
            results[0],
            ["users"]
        );

        reportData.sites = extractArray(
            results[1],
            ["sites"]
        );

        reportData.vendors = extractArray(
            results[2],
            ["vendors"]
        );

        reportData.categories = extractArray(
            results[3],
            [
                "categories",
                "assetCategories"
            ]
        );

        reportData.assets = extractArray(
            results[4],
            ["assets"]
        );

        reportData.requests = extractArray(
            results[5],
            [
                "requests",
                "maintenanceRequests"
            ]
        );

        renderSummaryCards();
        renderAssetStatusReport();
        renderPriorityReport();
        renderRequestTable(
            getLatestRequests(
                reportData.requests
            )
        );

        reportStatusPanel.className =
            "status-message success-status";

        reportStatusPanel.textContent =
            `Report updated: ${new Date()
                .toLocaleString()}`;
    } catch (error) {
        reportStatusPanel.className =
            "status-message error-status";

        reportStatusPanel.textContent =
            "Unable to load report information.";

        reportRequestsTableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    Unable to load report.
                </td>
            </tr>
        `;

        showMessage(
            error.message,
            "error"
        );
    }
}

function renderSummaryCards() {
    const requests =
        reportData.requests;

    const openCount =
        requests.filter(
            (request) =>
                normalizeValue(
                    getRequestStatus(request)
                ) === "open"
        ).length;

    const inProgressCount =
        requests.filter(
            (request) => {
                const status =
                    normalizeValue(
                        getRequestStatus(
                            request
                        )
                    );

                return (
                    status === "in progress" ||
                    status === "assigned" ||
                    status ===
                        "pending vendor"
                );
            }
        ).length;

    const criticalCount =
        requests.filter(
            (request) =>
                normalizeValue(
                    getRequestPriority(request)
                ) === "critical"
        ).length;

    const completedCount =
        requests.filter(
            (request) => {
                const status =
                    normalizeValue(
                        getRequestStatus(
                            request
                        )
                    );

                return (
                    status === "completed" ||
                    status === "closed"
                );
            }
        ).length;

    totalUsersElement.textContent =
        reportData.users.length;

    totalSitesElement.textContent =
        reportData.sites.length;

    totalVendorsElement.textContent =
        reportData.vendors.length;

    totalCategoriesElement.textContent =
        reportData.categories.length;

    totalAssetsElement.textContent =
        reportData.assets.length;

    totalRequestsElement.textContent =
        reportData.requests.length;

    openRequestsElement.textContent =
        openCount;

    inProgressRequestsElement.textContent =
        inProgressCount;

    criticalRequestsElement.textContent =
        criticalCount;

    completedRequestsElement.textContent =
        completedCount;
}

function renderAssetStatusReport() {
    const statusOrder = [
        "Active",
        "Inactive",
        "Under Maintenance",
        "Retired"
    ];

    const counts = createCountMap(
        reportData.assets,
        getAssetStatus
    );

    renderBarReport(
        assetStatusReport,
        statusOrder,
        counts,
        reportData.assets.length
    );
}

function renderPriorityReport() {
    const priorityOrder = [
        "Low",
        "Medium",
        "High",
        "Critical"
    ];

    const counts = createCountMap(
        reportData.requests,
        getRequestPriority
    );

    renderBarReport(
        requestPriorityReport,
        priorityOrder,
        counts,
        reportData.requests.length
    );
}

function createCountMap(
    items,
    valueGetter
) {
    const countMap = {};

    items.forEach((item) => {
        const value =
            valueGetter(item) ||
            "Not Specified";

        countMap[value] =
            (countMap[value] || 0) + 1;
    });

    return countMap;
}

function renderBarReport(
    container,
    preferredOrder,
    counts,
    total
) {
    container.innerHTML = "";

    const additionalLabels =
        Object.keys(counts).filter(
            (label) =>
                !preferredOrder.includes(
                    label
                )
        );

    const labels = [
        ...preferredOrder,
        ...additionalLabels
    ];

    labels.forEach((label) => {
        const count =
            counts[label] || 0;

        const percentage =
            total > 0
                ? Math.round(
                    (count / total) * 100
                )
                : 0;

        const item =
            document.createElement("div");

        item.className =
            "report-bar-item";

        item.innerHTML = `
            <div class="report-bar-heading">
                <span>
                    ${escapeHtml(label)}
                </span>

                <strong>
                    ${count}
                </strong>
            </div>

            <div class="report-bar-track">
                <div
                    class="report-bar-fill"
                    style="width: ${percentage}%"
                ></div>
            </div>

            <small>
                ${percentage}% of total
            </small>
        `;

        container.appendChild(item);
    });
}

function getLatestRequests(requests) {
    return [...requests]
        .sort((first, second) => {
            const firstDate =
                new Date(
                    getDateRaised(first) || 0
                ).getTime();

            const secondDate =
                new Date(
                    getDateRaised(second) || 0
                ).getTime();

            if (secondDate !== firstDate) {
                return secondDate - firstDate;
            }

            return (
                Number(
                    getRequestId(second)
                ) -
                Number(
                    getRequestId(first)
                )
            );
        })
        .slice(0, 10);
}

function renderRequestTable(requests) {
    reportRequestsTableBody.innerHTML = "";

    if (requests.length === 0) {
        reportRequestsTableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    No maintenance requests found.
                </td>
            </tr>
        `;

        return;
    }

    requests.forEach((request) => {
        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(
                    getTicketNo(request)
                )}
            </td>

            <td>
                <div class="request-title">
                    ${escapeHtml(
                        getRequestTitle(
                            request
                        )
                    )}
                </div>

                ${
                    getRequestDescription(
                        request
                    )
                        ? `
                            <div class="request-description">
                                ${escapeHtml(
                                    getRequestDescription(
                                        request
                                    )
                                )}
                            </div>
                        `
                        : ""
                }
            </td>

            <td>
                <span class="${getPriorityClass(
                    getRequestPriority(request)
                )}">
                    ${escapeHtml(
                        getRequestPriority(
                            request
                        )
                    )}
                </span>
            </td>

            <td>
                <span class="${getStatusClass(
                    getRequestStatus(request)
                )}">
                    ${escapeHtml(
                        getRequestStatus(
                            request
                        )
                    )}
                </span>
            </td>

            <td>
                ${escapeHtml(
                    getSiteName(request)
                )}
            </td>

            <td>
                ${escapeHtml(
                    getAssetName(request)
                )}

                ${
                    getAssetTag(request)
                        ? `
                            <br>
                            <small>
                                ${escapeHtml(
                                    getAssetTag(
                                        request
                                    )
                                )}
                            </small>
                        `
                        : ""
                }
            </td>

            <td>
                ${
                    escapeHtml(
                        getAssignedToName(
                            request
                        )
                    ) ||
                    "Not assigned"
                }
            </td>

            <td>
                ${formatDateTime(
                    getDateRaised(request)
                )}
            </td>

            <td>
                ${formatDateOnly(
                    getTargetDate(request)
                )}
            </td>
        `;

        reportRequestsTableBody
            .appendChild(row);
    });
}

reportSearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            reportSearchInput.value
                .trim()
                .toLowerCase();

        const latestRequests =
            getLatestRequests(
                reportData.requests
            );

        if (!searchTerm) {
            renderRequestTable(
                latestRequests
            );

            return;
        }

        const filteredRequests =
            latestRequests.filter(
                (request) => {
                    const values = [
                        getTicketNo(request),
                        getRequestTitle(request),
                        getRequestDescription(
                            request
                        ),
                        getRequestPriority(
                            request
                        ),
                        getRequestStatus(
                            request
                        ),
                        getSiteName(request),
                        getAssetName(request),
                        getAssetTag(request),
                        getAssignedToName(
                            request
                        ),
                        getDateRaised(request),
                        getTargetDate(request)
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

        renderRequestTable(
            filteredRequests
        );
    }
);

exportCsvButton.addEventListener(
    "click",
    exportMaintenanceRequestsToCsv
);

printReportButton.addEventListener(
    "click",
    () => {
        window.print();
    }
);

refreshReportButton.addEventListener(
    "click",
    loadReportData
);

function exportMaintenanceRequestsToCsv() {
    if (
        reportData.requests.length === 0
    ) {
        showMessage(
            "There are no maintenance requests to export.",
            "error"
        );

        return;
    }

    const headers = [
        "Request ID",
        "Ticket No",
        "Title",
        "Description",
        "Request Type",
        "Priority",
        "Status",
        "Site",
        "Asset",
        "Asset Tag",
        "Raised By",
        "Assigned To",
        "Vendor",
        "Date Raised",
        "Target Date"
    ];

    const rows =
        reportData.requests.map(
            (request) => [
                getRequestId(request),
                getTicketNo(request),
                getRequestTitle(request),
                getRequestDescription(
                    request
                ),
                getRequestType(request),
                getRequestPriority(request),
                getRequestStatus(request),
                getSiteName(request),
                getAssetName(request),
                getAssetTag(request),
                getRaisedByName(request),
                getAssignedToName(request),
                getVendorName(request),
                formatDateTime(
                    getDateRaised(request)
                ),
                formatDateOnly(
                    getTargetDate(request)
                )
            ]
        );

    const csvLines = [
        headers,
        ...rows
    ].map(
        (row) =>
            row
                .map(toCsvValue)
                .join(",")
    );

    const csvContent =
        csvLines.join("\r\n");

    const csvBlob =
        new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8"
            }
        );

    const objectUrl =
        URL.createObjectURL(csvBlob);

    const downloadLink =
        document.createElement("a");

    const dateText =
        new Date()
            .toISOString()
            .slice(0, 10);

    downloadLink.href =
        objectUrl;

    downloadLink.download =
        `ISMS_Maintenance_Report_${dateText}.csv`;

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(
        objectUrl
    );

    showMessage(
        "Maintenance report exported successfully.",
        "success"
    );
}

function toCsvValue(value) {
    const text =
        String(value ?? "");

    return `"${text.replaceAll(
        '"',
        '""'
    )}"`;
}

function getRequestId(request) {
    return (
        request.RequestId ??
        request.requestId ??
        request.id ??
        ""
    );
}

function getTicketNo(request) {
    return (
        request.TicketNo ??
        request.ticketNo ??
        ""
    );
}

function getRequestTitle(request) {
    return (
        request.Title ??
        request.title ??
        ""
    );
}

function getRequestDescription(
    request
) {
    return (
        request.Description ??
        request.description ??
        ""
    );
}

function getRequestType(request) {
    return (
        request.RequestType ??
        request.requestType ??
        ""
    );
}

function getRequestPriority(request) {
    return (
        request.Priority ??
        request.priority ??
        ""
    );
}

function getRequestStatus(request) {
    return (
        request.Status ??
        request.status ??
        ""
    );
}

function getSiteName(request) {
    return (
        request.SiteName ??
        request.siteName ??
        ""
    );
}

function getAssetName(request) {
    return (
        request.AssetName ??
        request.assetName ??
        ""
    );
}

function getAssetTag(request) {
    return (
        request.AssetTag ??
        request.assetTag ??
        ""
    );
}

function getRaisedByName(request) {
    return (
        request.RaisedByName ??
        request.raisedByName ??
        ""
    );
}

function getAssignedToName(request) {
    return (
        request.AssignedToName ??
        request.assignedToName ??
        ""
    );
}

function getVendorName(request) {
    return (
        request.VendorName ??
        request.vendorName ??
        ""
    );
}

function getDateRaised(request) {
    return (
        request.DateRaised ??
        request.dateRaised ??
        ""
    );
}

function getTargetDate(request) {
    return (
        request.TargetDate ??
        request.targetDate ??
        ""
    );
}

function getAssetStatus(asset) {
    return (
        asset.Status ??
        asset.status ??
        "Not Specified"
    );
}

function normalizeValue(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function getPriorityClass(priority) {
    const value =
        normalizeValue(priority);

    if (value === "critical") {
        return (
            "status-badge " +
            "critical-priority"
        );
    }

    if (value === "high") {
        return (
            "status-badge " +
            "high-priority"
        );
    }

    if (value === "medium") {
        return (
            "status-badge " +
            "medium-priority"
        );
    }

    return (
        "status-badge " +
        "low-priority"
    );
}

function getStatusClass(status) {
    const value =
        normalizeValue(status);

    if (
        value === "completed" ||
        value === "closed"
    ) {
        return (
            "status-badge " +
            "active-status"
        );
    }

    if (
        value === "assigned" ||
        value === "in progress"
    ) {
        return (
            "status-badge " +
            "progress-status"
        );
    }

    if (
        value === "pending vendor"
    ) {
        return (
            "status-badge " +
            "maintenance-status"
        );
    }

    if (
        value === "cancelled"
    ) {
        return (
            "status-badge " +
            "retired-status"
        );
    }

    return (
        "status-badge " +
        "open-status"
    );
}

function formatDateOnly(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return escapeHtml(value);
    }

    return date.toLocaleDateString();
}

function formatDateTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return escapeHtml(value);
    }

    return date.toLocaleString();
}

function showMessage(
    message,
    type
) {
    reportsMessage.textContent =
        message;

    reportsMessage.className =
        `page-message ${type}-message`;
}

function clearMessage() {
    reportsMessage.textContent = "";
    reportsMessage.className =
        "page-message";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadReportData();