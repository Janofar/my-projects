const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const validate = require('../middlewares/validate');
const { roleAddSchema } = require('../validations/roleValidation');
const { authenticateToken } = require("../middlewares/authMiddleware");

router.use(authenticateToken);
router.post('/add', validate(roleAddSchema), roleController.addRole);

module.exports = router;
