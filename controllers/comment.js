const express = require("express");
const router = express.Router();
const {
  insertComment,
  getCommentaire,
  getCountCommentaire,
} = require("../service/comment");

router.get("/", getCommentaire);
router.get("/count", getCountCommentaire);
router.post("/", insertComment);

module.exports = router;
