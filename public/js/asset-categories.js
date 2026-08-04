requireAuthentication();
renderLayout("categories");

const categoryFormPanel =
    document.getElementById("categoryFormPanel");

const categoryForm =
    document.getElementById("categoryForm");

const categoryFormTitle =
    document.getElementById("categoryFormTitle");

const categoryIdInput =
    document.getElementById("categoryId");

const categoryNameInput =
    document.getElementById("categoryName");

const descriptionInput =
    document.getElementById("description");

const showCategoryFormButton =
    document.getElementById(
        "showCategoryFormButton"
    );

const cancelCategoryButton =
    document.getElementById(
        "cancelCategoryButton"
    );

const refreshCategoriesButton =
    document.getElementById(
        "refreshCategoriesButton"
    );

const categorySearchInput =
    document.getElementById(
        "categorySearch"
    );

const categoriesTableBody =
    document.getElementById(
        "categoriesTableBody"
    );

const categoriesMessage =
    document.getElementById(
        "categoriesMessage"
    );

const categoryFormMessage =
    document.getElementById(
        "categoryFormMessage"
    );

let categories = [];

function extractCategories(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.categories)) {
        return data.categories;
    }

    if (Array.isArray(data?.assetCategories)) {
        return data.assetCategories;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function getCategoryId(category) {
    return (
        category.CategoryId ??
        category.categoryId ??
        category.category_id ??
        category.id
    );
}

function getCategoryName(category) {
    return (
        category.CategoryName ??
        category.categoryName ??
        category.category_name ??
        category.name ??
        ""
    );
}

function getDescription(category) {
    return (
        category.Description ??
        category.description ??
        ""
    );
}

function getCreatedAt(category) {
    return (
        category.CreatedAt ??
        category.createdAt ??
        category.created_at ??
        ""
    );
}

async function loadCategories() {
    categoriesMessage.textContent = "";

    categoriesTableBody.innerHTML = `
        <tr>
            <td colspan="5">
                Loading categories...
            </td>
        </tr>
    `;

    try {
        const data = await apiRequest(
            "/asset-categories"
        );

        categories = extractCategories(data);

        renderCategories(categories);
    } catch (error) {
        categories = [];

        categoriesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load categories.
                </td>
            </tr>
        `;

        showMessage(
            categoriesMessage,
            error.message,
            "error"
        );
    }
}

function renderCategories(categoryList) {
    categoriesTableBody.innerHTML = "";

    if (categoryList.length === 0) {
        categoriesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No categories found.
                </td>
            </tr>
        `;

        return;
    }

    categoryList.forEach((category) => {
        const categoryId =
            getCategoryId(category);

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(categoryId)}
            </td>

            <td>
                ${escapeHtml(
                    getCategoryName(category)
                )}
            </td>

            <td>
                ${escapeHtml(
                    getDescription(category)
                )}
            </td>

            <td>
                ${formatDate(
                    getCreatedAt(category)
                )}
            </td>

            <td class="action-cell">
                <button
                    class="small-button edit-button"
                    type="button"
                    data-action="edit"
                    data-category-id="${categoryId}"
                >
                    Edit
                </button>

                <button
                    class="small-button delete-button"
                    type="button"
                    data-action="delete"
                    data-category-id="${categoryId}"
                >
                    Delete
                </button>
            </td>
        `;

        categoriesTableBody.appendChild(row);
    });
}

function openCreateCategoryForm() {
    resetCategoryForm();

    categoryFormTitle.textContent =
        "Add Category";

    categoryFormPanel.classList.remove(
        "hidden"
    );

    categoryNameInput.focus();
}

function openEditCategoryForm(categoryId) {
    const category = categories.find(
        (item) =>
            String(getCategoryId(item)) ===
            String(categoryId)
    );

    if (!category) {
        showMessage(
            categoriesMessage,
            "Category record was not found.",
            "error"
        );

        return;
    }

    resetCategoryForm();

    categoryFormTitle.textContent =
        "Edit Category";

    categoryIdInput.value =
        getCategoryId(category);

    categoryNameInput.value =
        getCategoryName(category);

    descriptionInput.value =
        getDescription(category);

    categoryFormPanel.classList.remove(
        "hidden"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

categoryForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        categoryFormMessage.textContent = "";

        const categoryId =
            categoryIdInput.value.trim();

        const categoryData = {
            categoryName:
                categoryNameInput.value.trim(),

            description:
                descriptionInput.value.trim()
        };

        try {
            if (categoryId) {
                await apiRequest(
                    `/asset-categories/${categoryId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            categoryData
                        )
                    }
                );

                showMessage(
                    categoriesMessage,
                    "Category updated successfully.",
                    "success"
                );
            } else {
                await apiRequest(
                    "/asset-categories",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            categoryData
                        )
                    }
                );

                showMessage(
                    categoriesMessage,
                    "Category created successfully.",
                    "success"
                );
            }

            closeCategoryForm();
            await loadCategories();
        } catch (error) {
            showMessage(
                categoryFormMessage,
                error.message,
                "error"
            );
        }
    }
);

categoriesTableBody.addEventListener(
    "click",
    async (event) => {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const categoryId =
            button.dataset.categoryId;

        const action =
            button.dataset.action;

        if (action === "edit") {
            openEditCategoryForm(categoryId);
        }

        if (action === "delete") {
            await deleteCategory(categoryId);
        }
    }
);

async function deleteCategory(categoryId) {
    const category = categories.find(
        (item) =>
            String(getCategoryId(item)) ===
            String(categoryId)
    );

    const categoryName =
        category
            ? getCategoryName(category)
            : `ID ${categoryId}`;

    const confirmed =
        window.confirm(
            `Delete category "${categoryName}"?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(
            `/asset-categories/${categoryId}`,
            {
                method: "DELETE"
            }
        );

        showMessage(
            categoriesMessage,
            "Category deleted successfully.",
            "success"
        );

        await loadCategories();
    } catch (error) {
        showMessage(
            categoriesMessage,
            error.message,
            "error"
        );
    }
}

categorySearchInput.addEventListener(
    "input",
    () => {
        const searchTerm =
            categorySearchInput.value
                .trim()
                .toLowerCase();

        if (!searchTerm) {
            renderCategories(categories);
            return;
        }

        const filteredCategories =
            categories.filter((category) => {
                const values = [
                    getCategoryId(category),
                    getCategoryName(category),
                    getDescription(category)
                ];

                return values.some(
                    (value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchTerm)
                );
            });

        renderCategories(filteredCategories);
    }
);

function closeCategoryForm() {
    resetCategoryForm();

    categoryFormPanel.classList.add(
        "hidden"
    );
}

function resetCategoryForm() {
    categoryForm.reset();

    categoryIdInput.value = "";

    categoryFormMessage.textContent = "";
    categoryFormMessage.className =
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

showCategoryFormButton.addEventListener(
    "click",
    openCreateCategoryForm
);

cancelCategoryButton.addEventListener(
    "click",
    closeCategoryForm
);

refreshCategoriesButton.addEventListener(
    "click",
    loadCategories
);

loadCategories();