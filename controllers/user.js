const express = require("express");
const router = express.Router();
const {
  login,
  validate,
  activate,
  deactivate,
  signup,
  getUser,
  updateUser,
  getUsers,
} = require("../service/user");

router.get("/", getUsers);
router.post("/login", login);
router.put("/validate/:userId", validate);
router.put("/activate/:userId", activate);
router.put("/deactivate/:userId", deactivate);
router.post("/", signup);
router.get("/:id", getUser);
router.put("/:id", updateUser);

module.exports = router;
