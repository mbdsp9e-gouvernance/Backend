const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleDetails,
} = require("../service/article");

router.get("/", getAllArticles);
router.get("/:id", getArticleDetails);

module.exports = router;
