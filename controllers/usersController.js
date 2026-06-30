const usersService = require("../services/usersService");

async function getAllUsers(req, res) {
    try {
        const users = await usersService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserById(req, res) {
    try {
        const user = await usersService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createUser(req, res) {
    try {
        const newUser = await usersService.createUser(req.body);

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const existingUser = await usersService.getUserById(req.params.id);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await usersService.updateUser(req.params.id, req.body);

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const existingUser = await usersService.getUserById(req.params.id);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await usersService.deleteUser(req.params.id);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};