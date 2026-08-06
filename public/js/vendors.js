requireAuthentication();
renderLayout("vendors");

const vendorFormPanel =
    document.getElementById("vendorFormPanel");

const vendorForm =
    document.getElementById("vendorForm");

const vendorFormTitle =
    document.getElementById("vendorFormTitle");

const vendorIdInput =
    document.getElementById("vendorId");

const vendorNameInput =
    document.getElementById("vendorName");

const contactPersonInput =
    document.getElementById("contactPerson");

const emailInput =
    document.getElementById("email");

const phoneNumberInput =
    document.getElementById("phoneNumber");

const showVendorFormButton =
    document.getElementById("showVendorFormButton");

const cancelVendorButton =
    document.getElementById("cancelVendorButton");

const refreshVendorsButton =
    document.getElementById("refreshVendorsButton");

const vendorSearchInput =
    document.getElementById("vendorSearch");

const vendorsTableBody =
    document.getElementById("vendorsTableBody");

const vendorsMessage =
    document.getElementById("vendorsMessage");

const vendorFormMessage =
    document.getElementById("vendorFormMessage");

let vendors = [];

function extractVendors(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.vendors)) {
        return data.vendors;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function getVendorId(vendor) {
    return (
        vendor.VendorId ??
        vendor.vendorId ??
        vendor.vendor_id ??
        vendor.id ??
        ""
    );
}

function getVendorName(vendor) {
    return (
        vendor.VendorName ??
        vendor.vendorName ??
        vendor.vendor_name ??
        vendor.name ??
        ""
    );
}

function getContactPerson(vendor) {
    return (
        vendor.ContactPerson ??
        vendor.contactPerson ??
        vendor.contact_person ??
        ""
    );
}

function getEmail(vendor) {
    return (
        vendor.Email ??
        vendor.email ??
        ""
    );
}

function getPhoneNumber(vendor) {
    return (
        vendor.Phone ??
        vendor.phone ??
        vendor.PhoneNumber ??
        vendor.phoneNumber ??
        ""
    );
}

function getCreatedAt(vendor) {
    return (
        vendor.CreatedAt ??
        vendor.createdAt ??
        vendor.created_at ??
        ""
    );
}

async function loadVendors() {
    vendorsMessage.textContent = "";

    vendorsTableBody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading vendors...
            </td>
        </tr>
    `;

    try {
        const data =
            await apiRequest("/vendors");

        vendors =
            extractVendors(data);

        renderVendors(vendors);
    } catch (error) {
        vendors = [];

        vendorsTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load vendors.
                </td>
            </tr>
        `;

        showMessage(
            vendorsMessage,
            error.message,
            "error"
        );
    }
}

function renderVendors(vendorList) {
    vendorsTableBody.innerHTML = "";

    if (vendorList.length === 0) {
        vendorsTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No vendors found.
                </td>
            </tr>
        `;

        return;
    }

    vendorList.forEach((vendor) => {
        const vendorId =
            getVendorId(vendor);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(vendorId)}
            </td>

            <td>
                ${escapeHtml(
                    getVendorName(vendor)
                )}
            </td>

            <td>
                ${escapeHtml(
                    getContactPerson(vendor)
                )}
            </td>

            <td>
                ${escapeHtml(
                    getEmail(vendor)
                )}
            </td>

            <td>
                ${escapeHtml(
                    getPhoneNumber(vendor)
                )}
            </td>

            <td>
                ${formatDate(
                    getCreatedAt(vendor)
                )}
            </td>

            <td class="action-cell">
                <button
                    class="small-button edit-button"
                    type="button"
                    data-action="edit"
                    data-vendor-id="${escapeHtml(vendorId)}"
                >
                    Edit
                </button>

                <button
                    class="small-button delete-button"
                    type="button"
                    data-action="delete"
                    data-vendor-id="${escapeHtml(vendorId)}"
                >
                    Delete
                </button>
            </td>
        `;

        vendorsTableBody.appendChild(row);
    });
}

function openCreateVendorForm() {
    resetVendorForm();

    vendorFormTitle.textContent =
        "Add Vendor";

    vendorFormPanel.classList.remove(
        "hidden"
    );

    vendorNameInput.focus();
}

function openEditVendorForm(vendorId) {
    const vendor = vendors.find(
        (item) =>
            String(getVendorId(item)) ===
            String(vendorId)
    );

    if (!vendor) {
        showMessage(
            vendorsMessage,
            "Vendor record was not found.",
            "error"
        );

        return;
    }

    resetVendorForm();

    vendorFormTitle.textContent =
        "Edit Vendor";

    vendorIdInput.value =
        getVendorId(vendor);

    vendorNameInput.value =
        getVendorName(vendor);

    contactPersonInput.value =
        getContactPerson(vendor);

    emailInput.value =
        getEmail(vendor);

    phoneNumberInput.value =
        getPhoneNumber(vendor);

    vendorFormPanel.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

vendorForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        vendorFormMessage.textContent = "";

        const vendorId =
            vendorIdInput.value.trim();

        const vendorData = {
            vendorName:
                vendorNameInput.value.trim(),

            contactPerson:
                contactPersonInput.value.trim(),

            email:
                emailInput.value.trim(),

            phone:
                phoneNumberInput.value.trim()
        };

        if (!vendorData.vendorName) {
            showMessage(
                vendorFormMessage,
                "Vendor name is required.",
                "error"
            );

            return;
        }

        try {
            if (vendorId) {
                await apiRequest(
                    `/vendors/${vendorId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            vendorData
                        )
                    }
                );

                showMessage(
                    vendorsMessage,
                    "Vendor updated successfully.",
                    "success"
                );
            } else {
                await apiRequest(
                    "/vendors",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            vendorData
                        )
                    }
                );

                showMessage(
                    vendorsMessage,
                    "Vendor created successfully.",
                    "success"
                );
            }

            closeVendorForm();
            await loadVendors();
        } catch (error) {
            showMessage(
                vendorFormMessage,
                error.message,
                "error"
            );
        }
    }
);

vendorsTableBody.addEventListener(
    "click",
    async (event) => {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const vendorId =
            button.dataset.vendorId;

        const action =
            button.dataset.action;

        if (action === "edit") {
            openEditVendorForm(vendorId);
        }

        if (action === "delete") {
            await deleteVendor(vendorId);
        }
    }
);

async function deleteVendor(vendorId) {
    const vendor = vendors.find(
        (item) =>
            String(getVendorId(item)) ===
            String(vendorId)
    );

    const vendorName =
        vendor
            ? getVendorName(vendor)
            : `ID ${vendorId}`;

    const confirmed =
        window.confirm(
            `Delete vendor "${vendorName}"?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(
            `/vendors/${vendorId}`,
            {
                method: "DELETE"
            }
        );

        showMessage(
            vendorsMessage,
            "Vendor deleted successfully.",
            "success"
        );

        await loadVendors();
    } catch (error) {
        showMessage(
            vendorsMessage,
            error.message,
            "error"
        );
    }
}

vendorSearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            vendorSearchInput.value
                .trim()
                .toLowerCase();

        if (!searchTerm) {
            renderVendors(vendors);
            return;
        }

        const filteredVendors =
            vendors.filter((vendor) => {
                const values = [
                    getVendorId(vendor),
                    getVendorName(vendor),
                    getContactPerson(vendor),
                    getEmail(vendor),
                    getPhoneNumber(vendor),
                    getCreatedAt(vendor)
                ];

                return values.some(
                    (value) =>
                        String(value ?? "")
                            .toLowerCase()
                            .includes(searchTerm)
                );
            });

        renderVendors(filteredVendors);
    }
);

function closeVendorForm() {
    resetVendorForm();

    vendorFormPanel.classList.add(
        "hidden"
    );
}

function resetVendorForm() {
    vendorForm.reset();

    vendorIdInput.value = "";

    vendorFormMessage.textContent = "";
    vendorFormMessage.className =
        "page-message";
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

showVendorFormButton.addEventListener(
    "click",
    openCreateVendorForm
);

cancelVendorButton.addEventListener(
    "click",
    closeVendorForm
);

refreshVendorsButton.addEventListener(
    "click",
    loadVendors
);

loadVendors();