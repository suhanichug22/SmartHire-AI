const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// ==========================================
// GET CANDIDATE PROFILE
// GET /api/users/profile/:id
// ==========================================

router.get(
  "/profile/:id",
  getProfile
);

// ==========================================
// UPDATE CANDIDATE PROFILE
// PUT /api/users/profile/:id
// ==========================================

router.put(
  "/profile/:id",
  updateProfile
);

module.exports = router;