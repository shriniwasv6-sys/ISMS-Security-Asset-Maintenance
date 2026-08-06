requireAuthentication();
renderLayout("assets");

const assetFormPanel =
    document.getElementById("assetFormPanel");

const assetForm =
    document.getElementById("assetForm");

const assetFormTitle =
    document.getElementById("assetFormTitle");

const assetIdInput =
    document.getElementById("assetId");

const assetNameInput =
    document.getElementById("assetName");

const assetTagInput =
    document.getElementById("assetTag");

const categoryIdInput =
    document.getElementById("categoryId");

const siteIdInput =
    document.getElementById("siteId");

const vendorIdInput =
    document.getElementById("vendorId");

const installationDateInput =
    document.getElementById("installationDate");

const warrantyExpiryInput =
    document.getElementById("warrantyExpiry");

const statusInput =
    document.getElementById("status");

const showAssetFormButton =
    document.getElementById("showAssetFormButton");

const cancelAssetButton =
    document.getElementById("cancelAssetButton");

const refreshAssetsButton =
    document.getElementById("refreshAssetsButton");

const assetSearchInput =
    document.getElementById("assetSearch");

const assetsTableBody =
    document.getElementById("assetsTableBody");

const assetsMessage =
    document.getElementById("assetsMessage");

const assetFormMessage =
    document.getElementById("assetFormMessage");

let assets = [];
let categories = [];
let sites = [];
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

function getAssetId(asset) {
    return asset.AssetId ?? asset.assetId ?? asset.id ?? "";
}

function getAssetName(asset) {
    return asset.AssetName ?? asset.assetName ?? "";
}

function getAssetTag(asset) {
    return asset.AssetTag ?? asset.assetTag ?? "";
}

function getCategoryId(asset) {
    return asset.CategoryId ?? asset.categoryId ?? "";
}

function getCategoryName(asset) {
    return asset.CategoryName ?? asset.categoryName ?? "";
}

function getSiteId(asset) {
    return asset.SiteId ?? asset.siteId ?? "";
}

function getSiteName(asset) {
    return asset.SiteName ?? asset.siteName ?? "";
}

function getVendorId(asset) {
    return asset.VendorId ?? asset.vendorId ?? "";
}

function getVendorName(asset) {
    return asset.VendorName ?? asset.vendorName ?? "";
}

function getInstallationDate(asset) {
    return (
        asset.InstallationDate ??
        asset.installationDate ??
        ""
    );
}

function getWarrantyExpiry(asset) {
    return (
        asset.WarrantyExpiry ??
        asset.warrantyExpiry ??
        ""
    );
}

function getStatus(asset) {
    return asset.Status ?? asset.status ?? "";
}

async function loadPageData() {
    assetFormMessage.textContent = "";
    assetsMessage.textContent = "";

    try {
        const results = await Promise.all([
            apiRequest("/assets"),
            apiRequest("/asset-categories"),
            apiRequest("/sites"),
            apiRequest("/vendors")
        ]);

        assets = extractArray(
            results[0],
            ["assets"]
        );

        categories = extractArray(
            results[1],
            ["categories", "assetCategories"]
        );

        sites = extractArray(
            results[2],
            ["sites"]
        );

        vendors = extractArray(
            results[3],
            ["vendors"]
        );

        populateDropdowns();
        renderAssets(assets);
    } catch (error) {
        assetsTableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    Unable to load assets.
                </td>
            </tr>
        `;

        showMessage(
            assetsMessage,
            error.message,
            "error"
        );
    }
}

function populateDropdowns() {
    categoryIdInput.innerHTML = `
        <option value="">
            Select category
        </option>
    `;

    categories.forEach((category) => {
        const id =
            category.CategoryId ??
            category.categoryId ??
            category.id;

        const name =
            category.CategoryName ??
            category.categoryName ??
            category.name;

        categoryIdInput.insertAdjacentHTML(
            "beforeend",
            `
                <option value="${escapeHtml(id)}">
                    ${escapeHtml(name)}
                </option>
            `
        );
    });

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

    vendorIdInput.innerHTML = `
        <option value="">
            Select vendor
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

function renderAssets(assetList) {
    assetsTableBody.innerHTML = "";

    if (assetList.length === 0) {
        assetsTableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    No assets found.
                </td>
            </tr>
        `;

        return;
    }

    assetList.forEach((asset) => {
        const assetId = getAssetId(asset);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(assetId)}
            </td>

            <td>
                ${escapeHtml(getAssetName(asset))}
            </td>

            <td>
                ${escapeHtml(getAssetTag(asset))}
            </td>

            <td>
                ${escapeHtml(getCategoryName(asset))}
            </td>

            <td>
                ${escapeHtml(getSiteName(asset))}
            </td>

            <td>
                ${escapeHtml(getVendorName(asset))}
            </td>

            <td>
                ${formatDateOnly(
                    getInstallationDate(asset)
                )}
            </td>

            <td>
                ${formatDateOnly(
                    getWarrantyExpiry(asset)
                )}
            </td>

            <td>
                <span class="${getStatusClass(
                    getStatus(asset)
                )}">
                    ${escapeHtml(getStatus(asset))}
                </span>
            </td>

            <td class="action-cell">
                <button
                    class="small-button edit-button"
                    type="button"
                    data-action="edit"
                    data-asset-id="${escapeHtml(assetId)}"
                >
                    Edit
                </button>

                <button
                    class="small-button delete-button"
                    type="button"
                    data-action="delete"
                    data-asset-id="${escapeHtml(assetId)}"
                >
                    Delete
                </button>
            </td>
        `;

        assetsTableBody.appendChild(row);
    });
}

function openCreateAssetForm() {
    resetAssetForm();

    assetFormTitle.textContent =
        "Add Asset";

    assetFormPanel.classList.remove(
        "hidden"
    );

    assetNameInput.focus();
}

function openEditAssetForm(assetId) {
    const asset = assets.find(
        (item) =>
            String(getAssetId(item)) ===
            String(assetId)
    );

    if (!asset) {
        showMessage(
            assetsMessage,
            "Asset record was not found.",
            "error"
        );

        return;
    }

    resetAssetForm();

    assetFormTitle.textContent =
        "Edit Asset";

    assetIdInput.value =
        getAssetId(asset);

    assetNameInput.value =
        getAssetName(asset);

    assetTagInput.value =
        getAssetTag(asset);

    categoryIdInput.value =
        getCategoryId(asset);

    siteIdInput.value =
        getSiteId(asset);

    vendorIdInput.value =
        getVendorId(asset);

    installationDateInput.value =
        toDateInputValue(
            getInstallationDate(asset)
        );

    warrantyExpiryInput.value =
        toDateInputValue(
            getWarrantyExpiry(asset)
        );

    statusInput.value =
        getStatus(asset) || "Active";

    assetFormPanel.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

assetForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        assetFormMessage.textContent = "";

        const assetId =
            assetIdInput.value.trim();

        const assetData = {
            assetName:
                assetNameInput.value.trim(),

            assetTag:
                assetTagInput.value.trim(),

            categoryId:
                Number(categoryIdInput.value),

            siteId:
                Number(siteIdInput.value),

            vendorId:
                Number(vendorIdInput.value),

            installationDate:
                installationDateInput.value ||
                null,

            warrantyExpiry:
                warrantyExpiryInput.value ||
                null,

            status:
                statusInput.value
        };

        try {
            if (assetId) {
                await apiRequest(
                    `/assets/${assetId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            assetData
                        )
                    }
                );

                showMessage(
                    assetsMessage,
                    "Asset updated successfully.",
                    "success"
                );
            } else {
                await apiRequest(
                    "/assets",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            assetData
                        )
                    }
                );

                showMessage(
                    assetsMessage,
                    "Asset created successfully.",
                    "success"
                );
            }

            closeAssetForm();
            await loadPageData();
        } catch (error) {
            showMessage(
                assetFormMessage,
                error.message,
                "error"
            );
        }
    }
);

assetsTableBody.addEventListener(
    "click",
    async (event) => {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const assetId =
            button.dataset.assetId;

        const action =
            button.dataset.action;

        if (action === "edit") {
            openEditAssetForm(assetId);
        }

        if (action === "delete") {
            await deleteAsset(assetId);
        }
    }
);

async function deleteAsset(assetId) {
    const asset = assets.find(
        (item) =>
            String(getAssetId(item)) ===
            String(assetId)
    );

    const assetName =
        asset
            ? getAssetName(asset)
            : `ID ${assetId}`;

    const confirmed =
        window.confirm(
            `Delete asset "${assetName}"?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(
            `/assets/${assetId}`,
            {
                method: "DELETE"
            }
        );

        showMessage(
            assetsMessage,
            "Asset deleted successfully.",
            "success"
        );

        await loadPageData();
    } catch (error) {
        showMessage(
            assetsMessage,
            error.message,
            "error"
        );
    }
}

assetSearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            assetSearchInput.value
                .trim()
                .toLowerCase();

        if (!searchTerm) {
            renderAssets(assets);
            return;
        }

        const filteredAssets =
            assets.filter((asset) => {
                const values = [
                    getAssetId(asset),
                    getAssetName(asset),
                    getAssetTag(asset),
                    getCategoryName(asset),
                    getSiteName(asset),
                    getVendorName(asset),
                    getInstallationDate(asset),
                    getWarrantyExpiry(asset),
                    getStatus(asset)
                ];

                return values.some(
                    (value) =>
                        String(value ?? "")
                            .toLowerCase()
                            .includes(searchTerm)
                );
            });

        renderAssets(filteredAssets);
    }
);

function closeAssetForm() {
    resetAssetForm();

    assetFormPanel.classList.add(
        "hidden"
    );
}

function resetAssetForm() {
    assetForm.reset();

    assetIdInput.value = "";
    statusInput.value = "Active";

    assetFormMessage.textContent = "";
    assetFormMessage.className =
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

function getStatusClass(status) {
    const normalized =
        String(status)
            .trim()
            .toLowerCase();

    if (normalized === "active") {
        return "status-badge active-status";
    }

    if (
        normalized ===
        "under maintenance"
    ) {
        return (
            "status-badge " +
            "maintenance-status"
        );
    }

    if (normalized === "retired") {
        return "status-badge retired-status";
    }

    return "status-badge inactive-status";
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

showAssetFormButton.addEventListener(
    "click",
    openCreateAssetForm
);

cancelAssetButton.addEventListener(
    "click",
    closeAssetForm
);

refreshAssetsButton.addEventListener(
    "click",
    loadPageData
);

loadPageData();