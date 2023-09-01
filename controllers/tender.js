const express = require("express");
const { getAll, getOne, tenderNumber } = require("../service/tender");
const router = express.Router();

router.get('/', getAll);
router.get('/count', tenderNumber);
router.get('/:id', getOne);

module.exports = router;