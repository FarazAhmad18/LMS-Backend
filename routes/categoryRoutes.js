const express = require("express");
const { auth } = require("../middlewares/auth");
const { hasRole } = require("../middlewares/hasRole");
const categoryCtrl = require("../controllers/categoryController");

const router = express.Router();
router.use(auth);
router.use(hasRole("admin"));

router.post("/", categoryCtrl.createCategory);
router.get("/", categoryCtrl.getCategories);
router.delete("/:id", categoryCtrl.deleteCategory);

module.exports = router;
