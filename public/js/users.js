/*
 * Protect the Users page and create the shared layout.
 */
requireAuthentication();
renderLayout("users");

/*
 * Page elements.
 */
const userFormPanel =
    document.getElementById("userFormPanel");

const userForm =
    document.getElementById("userForm");

const userFormTitle =
    document.getElementById("userFormTitle");

const userIdInput =
    document.getElementById("userId");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const phoneNumberInput =
    document.getElementById("phoneNumber");

const roleIdInput =
    document.getElementById("roleId");

const passwordInput =
    document.getElementById("password");

const showUserFormButton =
    document.getElementById("showUserFormButton");

const cancelUserButton =
    document.getElementById("cancelUserButton");

const refreshUsersButton =
    document.getElementById("refreshUsersButton");

const usersTableBody =
    document.getElementById("usersTableBody");

const userSearchInput =
    document.getElementById("userSearch");

const usersMessage =
    document.getElementById("usersMessage");

const formMessage =
    document.getElementById("formMessage");

let users = [];

/**
 * Extract the user array from possible backend
 * response structures.
 */
function extractUsers(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.users)) {
        return data.users;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

/**
 * Support different database column naming styles.
 */
function getUserId(user) {
    return (
        user.UserId ??
        user.userId ??
        user.user_id ??
        user.id
    );
}

function getFullName(user) {
    return (
        user.FullName ??
        user.fullName ??
        user.full_name ??
        user.name ??
        ""
    );
}

function getEmail(user) {
    return (
        user.Email ??
        user.email ??
        ""
    );
}

function getPhoneNumber(user) {
    return (
        user.PhoneNumber ??
        user.phoneNumber ??
        user.phone_number ??
        user.phone ??
        ""
    );
}

function getRoleId(user) {
    return (
        user.RoleId ??
        user.roleId ??
        user.role_id ??
        ""
    );
}

function getCreatedAt(user) {
    return (
        user.CreatedAt ??
        user.createdAt ??
        user.created_at ??
        ""
    );
}

/**
 * Load all users from the backend.
 */
async function loadUsers() {
    usersMessage.textContent = "";

    usersTableBody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading users...
            </td>
        </tr>
    `;

    try {
        const data = await apiRequest("/users");

        users = extractUsers(data);

        renderUsers(users);
    } catch (error) {
        users = [];

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load users.
                </td>
            </tr>
        `;

        showPageMessage(
            usersMessage,
            error.message,
            "error"
        );
    }
}

/**
 * Display user records in the table.
 */
function renderUsers(userList) {
    usersTableBody.innerHTML = "";

    if (userList.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }

    userList.forEach((user) => {
        const userId = getUserId(user);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(userId)}
            </td>

            <td>
                ${escapeHtml(getFullName(user))}
            </td>

            <td>
                ${escapeHtml(getEmail(user))}
            </td>

            <td>
                ${escapeHtml(getPhoneNumber(user))}
            </td>

            <td>
                ${escapeHtml(getRoleId(user))}
            </td>

            <td>
                ${formatDate(getCreatedAt(user))}
            </td>

            <td class="action-cell">
                <button
                    class="small-button edit-button"
                    type="button"
                    data-action="edit"
                    data-user-id="${userId}"
                >
                    Edit
                </button>

                <button
                    class="small-button delete-button"
                    type="button"
                    data-action="delete"
                    data-user-id="${userId}"
                >
                    Delete
                </button>
            </td>
        `;

        usersTableBody.appendChild(row);
    });
}

/**
 * Open the form in create mode.
 */
function openCreateUserForm() {
    resetUserForm();

    userFormTitle.textContent =
        "Add User";

    passwordInput.required = true;

    userFormPanel.classList.remove(
        "hidden"
    );

    fullNameInput.focus();
}

/**
 * Open the form in edit mode.
 */
function openEditUserForm(userId) {
    const user = users.find(
        (item) =>
            String(getUserId(item)) ===
            String(userId)
    );

    if (!user) {
        showPageMessage(
            usersMessage,
            "User record was not found.",
            "error"
        );

        return;
    }

    resetUserForm();

    userFormTitle.textContent =
        "Edit User";

    userIdInput.value =
        getUserId(user);

    fullNameInput.value =
        getFullName(user);

    emailInput.value =
        getEmail(user);

    phoneNumberInput.value =
        getPhoneNumber(user);

    roleIdInput.value =
        getRoleId(user);

    passwordInput.required = false;
    passwordInput.value = "";

    userFormPanel.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/**
 * Create or update a user.
 */
userForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        formMessage.textContent = "";

        const userId =
            userIdInput.value.trim();

        const userData = {
            fullName:
                fullNameInput.value.trim(),

            email:
                emailInput.value.trim(),

            phoneNumber:
                phoneNumberInput.value.trim(),

            roleId:
                Number(roleIdInput.value)
        };

        /*
         * Send the password only when it has
         * been entered.
         */
        if (passwordInput.value) {
            userData.password =
                passwordInput.value;
        }

        if (!userId && !userData.password) {
            showPageMessage(
                formMessage,
                "Password is required when creating a user.",
                "error"
            );

            return;
        }

        try {
            if (userId) {
                await apiRequest(
                    `/users/${userId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            userData
                        )
                    }
                );

                showPageMessage(
                    usersMessage,
                    "User updated successfully.",
                    "success"
                );
            } else {
                await apiRequest(
                    "/users",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            userData
                        )
                    }
                );

                showPageMessage(
                    usersMessage,
                    "User created successfully.",
                    "success"
                );
            }

            closeUserForm();
            await loadUsers();
        } catch (error) {
            showPageMessage(
                formMessage,
                error.message,
                "error"
            );
        }
    }
);

/**
 * Handle Edit and Delete buttons using
 * event delegation.
 */
usersTableBody.addEventListener(
    "click",
    async (event) => {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const userId =
            button.dataset.userId;

        const action =
            button.dataset.action;

        if (action === "edit") {
            openEditUserForm(userId);
        }

        if (action === "delete") {
            await deleteUser(userId);
        }
    }
);

/**
 * Delete a user after confirmation.
 */
async function deleteUser(userId) {
    const user = users.find(
        (item) =>
            String(getUserId(item)) ===
            String(userId)
    );

    const fullName =
        user
            ? getFullName(user)
            : `ID ${userId}`;

    const confirmed =
        window.confirm(
            `Delete user "${fullName}"?`
        );

    if (!confirmed) {
        return;
    }

    /*
     * Prevent accidental deletion of the
     * currently logged-in user when possible.
     */
    const loggedInUser =
        getLoggedInUser();

    const loggedInUserId =
        loggedInUser?.UserId ??
        loggedInUser?.userId ??
        loggedInUser?.user_id ??
        loggedInUser?.id;

    if (
        String(loggedInUserId) ===
        String(userId)
    ) {
        showPageMessage(
            usersMessage,
            "You cannot delete your own active account.",
            "error"
        );

        return;
    }

    try {
        await apiRequest(
            `/users/${userId}`,
            {
                method: "DELETE"
            }
        );

        showPageMessage(
            usersMessage,
            "User deleted successfully.",
            "success"
        );

        await loadUsers();
    } catch (error) {
        showPageMessage(
            usersMessage,
            error.message,
            "error"
        );
    }
}

/**
 * Search users without calling the backend again.
 */
userSearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            userSearchInput.value
                .trim()
                .toLowerCase();

        if (!searchTerm) {
            renderUsers(users);
            return;
        }

        const filteredUsers =
            users.filter((user) => {
                const values = [
                    getUserId(user),
                    getFullName(user),
                    getEmail(user),
                    getPhoneNumber(user),
                    getRoleId(user)
                ];

                return values.some(
                    (value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchTerm)
                );
            });

        renderUsers(filteredUsers);
    }
);

/**
 * Reset and hide the user form.
 */
function closeUserForm() {
    resetUserForm();

    userFormPanel.classList.add(
        "hidden"
    );
}

function resetUserForm() {
    userForm.reset();

    userIdInput.value = "";

    passwordInput.required = true;

    formMessage.textContent = "";
    formMessage.className =
        "page-message";
}

/**
 * Safely format a database date.
 */
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

/**
 * Display success or error messages.
 */
function showPageMessage(
    element,
    message,
    type
) {
    element.textContent = message;

    element.className =
        `page-message ${type}-message`;
}

/**
 * Prevent HTML injection when displaying
 * backend values.
 */
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

showUserFormButton.addEventListener(
    "click",
    openCreateUserForm
);

cancelUserButton.addEventListener(
    "click",
    closeUserForm
);

refreshUsersButton.addEventListener(
    "click",
    loadUsers
);

loadUsers();