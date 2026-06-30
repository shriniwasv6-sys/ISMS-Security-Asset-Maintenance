const vendorsService = require("../services/vendorsService");

async function getAllVendors(req, res) {
    try {
        const vendors = await vendorsService.getAllVendors();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getVendorById(req, res) {
    try {
        const vendor = await vendorsService.getVendorById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createVendor(req, res) {
    try {
        const vendor = await vendorsService.createVendor(req.body);

        res.status(201).json({
            message: "Vendor created successfully",
            vendor
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateVendor(req, res) {
    try {
        const existingVendor = await vendorsService.getVendorById(req.params.id);

        if (!existingVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const vendor = await vendorsService.updateVendor(req.params.id, req.body);

        res.json({
            message: "Vendor updated successfully",
            vendor
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteVendor(req, res) {
    try {
        const existingVendor = await vendorsService.getVendorById(req.params.id);

        if (!existingVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        await vendorsService.deleteVendor(req.params.id);

        res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
};