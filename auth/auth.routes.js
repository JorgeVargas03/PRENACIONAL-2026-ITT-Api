const express = require("express");
const { login, me } = require("../controllers/adminAuthController");
const { requireAdminAuth } = require("./adminAuth.middleware");

const router = express.Router();

router.post("/auth/admin/login", login);
router.get("/admin/me", requireAdminAuth, me);

module.exports = router;
