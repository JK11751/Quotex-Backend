const express = require("express");
const router = express.Router();
// const { upload } = require("../utils/fileUpload");
const { registerUser, loginUser,logoutUser,getUserProfile,updateUserProfile } = require("../controllers/userCtr");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);



module.exports = router;
