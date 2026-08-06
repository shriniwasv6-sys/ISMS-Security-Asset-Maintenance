requireAuthentication();
renderLayout("settings");

const SETTINGS_STORAGE_KEY =
    "ismsSettings";

const DEFAULT_SETTINGS = {
    systemName:
        "Integrated Security Management System",

    organisationName:
        "Security Asset Maintenance",

    supportEmail: "",

    supportPhone: "",

    timeZone:
        "Asia/Singapore",

    dateFormat:
        "DD/MM/YYYY",

    emailNotifications: true,

    criticalAlerts: true,

    warrantyAlerts: true,

    dailySummary: false
};

const generalSettingsForm =
    document.getElementById(
        "generalSettingsForm"
    );

const notificationSettingsForm =
    document.getElementById(
        "notificationSettingsForm"
    );

const systemNameInput =
    document.getElementById("systemName");

const organisationNameInput =
    document.getElementById(
        "organisationName"
    );

const supportEmailInput =
    document.getElementById(
        "supportEmail"
    );

const supportPhoneInput =
    document.getElementById(
        "supportPhone"
    );

const timeZoneInput =
    document.getElementById("timeZone");

const dateFormatInput =
    document.getElementById(
        "dateFormat"
    );

const emailNotificationsInput =
    document.getElementById(
        "emailNotifications"
    );

const criticalAlertsInput =
    document.getElementById(
        "criticalAlerts"
    );

const warrantyAlertsInput =
    document.getElementById(
        "warrantyAlerts"
    );

const dailySummaryInput =
    document.getElementById(
        "dailySummary"
    );

const resetGeneralSettingsButton =
    document.getElementById(
        "resetGeneralSettingsButton"
    );

const refreshSystemInfoButton =
    document.getElementById(
        "refreshSystemInfoButton"
    );

const generalSettingsMessage =
    document.getElementById(
        "generalSettingsMessage"
    );

const notificationSettingsMessage =
    document.getElementById(
        "notificationSettingsMessage"
    );

const systemInformationMessage =
    document.getElementById(
        "systemInformationMessage"
    );

const accountFullName =
    document.getElementById(
        "accountFullName"
    );

const accountEmail =
    document.getElementById(
        "accountEmail"
    );

const accountRole =
    document.getElementById(
        "accountRole"
    );

const accountUserId =
    document.getElementById(
        "accountUserId"
    );

const systemApplication =
    document.getElementById(
        "systemApplication"
    );

const systemVersion =
    document.getElementById(
        "systemVersion"
    );

const systemStatus =
    document.getElementById(
        "systemStatus"
    );

const databaseStatus =
    document.getElementById(
        "databaseStatus"
    );

const systemCheckedAt =
    document.getElementById(
        "systemCheckedAt"
    );

function loadSettings() {
    const storedSettings =
        localStorage.getItem(
            SETTINGS_STORAGE_KEY
        );

    if (!storedSettings) {
        return {
            ...DEFAULT_SETTINGS
        };
    }

    try {
        const parsedSettings =
            JSON.parse(storedSettings);

        return {
            ...DEFAULT_SETTINGS,
            ...parsedSettings
        };
    } catch (error) {
        console.error(
            "Unable to parse settings:",
            error
        );

        return {
            ...DEFAULT_SETTINGS
        };
    }
}

function saveSettings(settings) {
    localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
    );
}

function populateSettingsForm() {
    const settings = loadSettings();

    systemNameInput.value =
        settings.systemName;

    organisationNameInput.value =
        settings.organisationName;

    supportEmailInput.value =
        settings.supportEmail;

    supportPhoneInput.value =
        settings.supportPhone;

    timeZoneInput.value =
        settings.timeZone;

    dateFormatInput.value =
        settings.dateFormat;

    emailNotificationsInput.checked =
        Boolean(
            settings.emailNotifications
        );

    criticalAlertsInput.checked =
        Boolean(
            settings.criticalAlerts
        );

    warrantyAlertsInput.checked =
        Boolean(
            settings.warrantyAlerts
        );

    dailySummaryInput.checked =
        Boolean(
            settings.dailySummary
        );
}

generalSettingsForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const currentSettings =
            loadSettings();

        const updatedSettings = {
            ...currentSettings,

            systemName:
                systemNameInput.value
                    .trim(),

            organisationName:
                organisationNameInput.value
                    .trim(),

            supportEmail:
                supportEmailInput.value
                    .trim(),

            supportPhone:
                supportPhoneInput.value
                    .trim(),

            timeZone:
                timeZoneInput.value,

            dateFormat:
                dateFormatInput.value
        };

        if (!updatedSettings.systemName) {
            showMessage(
                generalSettingsMessage,
                "System name is required.",
                "error"
            );

            return;
        }

        saveSettings(updatedSettings);

        showMessage(
            generalSettingsMessage,
            "General settings saved successfully.",
            "success"
        );
    }
);

notificationSettingsForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const currentSettings =
            loadSettings();

        const updatedSettings = {
            ...currentSettings,

            emailNotifications:
                emailNotificationsInput.checked,

            criticalAlerts:
                criticalAlertsInput.checked,

            warrantyAlerts:
                warrantyAlertsInput.checked,

            dailySummary:
                dailySummaryInput.checked
        };

        saveSettings(updatedSettings);

        showMessage(
            notificationSettingsMessage,
            "Notification settings saved successfully.",
            "success"
        );
    }
);

resetGeneralSettingsButton.addEventListener(
    "click",
    () => {
        const currentSettings =
            loadSettings();

        const updatedSettings = {
            ...currentSettings,

            systemName:
                DEFAULT_SETTINGS.systemName,

            organisationName:
                DEFAULT_SETTINGS
                    .organisationName,

            supportEmail:
                DEFAULT_SETTINGS
                    .supportEmail,

            supportPhone:
                DEFAULT_SETTINGS
                    .supportPhone,

            timeZone:
                DEFAULT_SETTINGS.timeZone,

            dateFormat:
                DEFAULT_SETTINGS.dateFormat
        };

        saveSettings(updatedSettings);
        populateSettingsForm();

        showMessage(
            generalSettingsMessage,
            "General settings reset successfully.",
            "success"
        );
    }
);

function populateAccountInformation() {
    const user =
        getLoggedInUser() || {};

    accountFullName.textContent =
        user.FullName ??
        user.fullName ??
        user.name ??
        "-";

    accountEmail.textContent =
        user.Email ??
        user.email ??
        "-";

    accountRole.textContent =
        user.RoleName ??
        user.roleName ??
        user.role ??
        "-";

    accountUserId.textContent =
        user.UserId ??
        user.userId ??
        user.id ??
        "-";
}

async function loadSystemInformation() {
    systemInformationMessage.textContent =
        "";

    try {
        const data =
            await apiRequest(
                "/v1/health"
            );

        systemApplication.textContent =
            data.application ??
            "Integrated Security Management System";

        systemVersion.textContent =
            data.version ?? "-";

        systemStatus.textContent =
            data.status ?? "-";

        databaseStatus.textContent =
            data.database ?? "-";

        systemCheckedAt.textContent =
            data.timestamp
                ? new Date(
                    data.timestamp
                ).toLocaleString()
                : new Date()
                    .toLocaleString();

        showMessage(
            systemInformationMessage,
            "System information updated successfully.",
            "success"
        );
    } catch (error) {
        systemApplication.textContent =
            "Integrated Security Management System";

        systemVersion.textContent = "-";
        systemStatus.textContent =
            "Unavailable";

        databaseStatus.textContent =
            "Unknown";

        systemCheckedAt.textContent =
            new Date().toLocaleString();

        showMessage(
            systemInformationMessage,
            error.message,
            "error"
        );
    }
}

refreshSystemInfoButton.addEventListener(
    "click",
    loadSystemInformation
);

function showMessage(
    element,
    message,
    type
) {
    element.textContent = message;

    element.className =
        `page-message ${type}-message`;
}

populateSettingsForm();
populateAccountInformation();
loadSystemInformation();