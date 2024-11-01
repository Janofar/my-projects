const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, checkPermission } = require("../middlewares/authMiddleware");
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, userIdSchema, updateUserSchema, deleteUserSchema } = require('../validations/userValidations');
const { FETCH_USER, CREATE_USER, EDIT_USER, DELETE_USER } = require('../validations/permissions')

router.post('/login', validate(loginSchema), userController.login);

router.use(authenticateToken);

router.post('/register', validate(registerSchema), checkPermission(CREATE_USER), userController.register);
router.post("/logout", userController.logout);
router.get("/dashboard", userController.dashboard);
router.get('/', checkPermission(FETCH_USER), userController.getAllUsers);
router.get('/:id', validate(userIdSchema, 'params'), checkPermission(FETCH_USER), userController.getUserById);
router.put('/:id', validate(userIdSchema, 'params'), checkPermission(EDIT_USER), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', validate(deleteUserSchema, 'params'), checkPermission(DELETE_USER), userController.deleteUser);

module.exports = router;
