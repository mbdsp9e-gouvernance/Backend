const express = require("express");
const { createSoumission, getAll, getOne, soumissionNumber } = require("../service/soumission");
const router = express.Router();

router.post('/', createSoumission);
router.get('/', getAll);
router.get('/count', soumissionNumber);
router.get('/:id', getOne);

module.exports = router;