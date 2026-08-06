const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const usersController = require("../controllers/usersController");


router.get("/", usersController.getAllUsers);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 */

router.get("/", authenticate, authorize("Admin"), usersController.getAllUsers);
router.get("/:id", authenticate, authorize("Admin"), usersController.getUserById);
router.post("/", authenticate, authorize("Admin"), usersController.createUser);
router.put("/:id", authenticate, authorize("Admin"), usersController.updateUser);
router.delete("/:id", authenticate, authorize("Admin"), usersController.deleteUser);

module.exports = router;