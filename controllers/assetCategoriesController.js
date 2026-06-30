const assetCategoriesService = require("../services/assetCategoriesService");

async function getAllCategories(req, res) {
    try {
        const categories = await assetCategoriesService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getCategoryById(req, res) {
    try {
        const category = await assetCategoriesService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Asset category not found" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createCategory(req, res) {
    try {
        const category = await assetCategoriesService.createCategory(req.body);

        res.status(201).json({
            message: "Asset category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateCategory(req, res) {
    try {
        const existingCategory = await assetCategoriesService.getCategoryById(req.params.id);

        if (!existingCategory) {
            return res.status(404).json({ message: "Asset category not found" });
        }

        const category = await assetCategoriesService.updateCategory(req.params.id, req.body);

        res.json({
            message: "Asset category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteCategory(req, res) {
    try {
        const existingCategory = await assetCategoriesService.getCategoryById(req.params.id);

        if (!existingCategory) {
            return res.status(404).json({ message: "Asset category not found" });
        }

        await assetCategoriesService.deleteCategory(req.params.id);

        res.json({ message: "Asset category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};