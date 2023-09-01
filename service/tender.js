const Tender = require("../models/Tender");
const url = require("url");

getAll = async (req, res) => {
  try {
    let query = url.parse(req.url, true).query;
    const page = query.page || 1;
    const pageNumber = query.pageNumber;
    const criteria = {};
    const sort = {};
    if(query.tenderStatus) criteria.tenderStatus = query.tenderStatus;
    if(query.title) criteria.title = query.title;
    if (query.sort) {
      let tmp = query.sort.split(',');
      tmp.forEach(t=> {
        if(t[0]==="-") sort["".substring(1)] = -1;
        else sort[t] = 1;
      })
    }
    // pagination
    const limit = pageNumber || 10;
    const offset = (page - 1) * limit;
    const count = await Tender.count(criteria);
    let totalPage = Math.floor(Number(count) / limit);
    if (Number(count) % limit != 0) {
      totalPage = totalPage + 1;
    }
    const pagination = {
      page,
      pageNumber: limit,
      totalPages: totalPage,
    };
    const tenders = await Tender.find(criteria)
    .sort(sort)
    .skip(offset)
    .limit(limit);
    res.status(200).json({tenders, pagination});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const tender = await Tender.findById(id);
    res.status(200).json({tender});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


tenderNumber = async (req, res) => {
	try {
		let query = url.parse(req.url, true).query;
		const criteria = {};
		const emissionDateCriteria = {};
		if(query.date1) emissionDateCriteria["$gte"] = query.date1;
		if(query.date2) emissionDateCriteria["$lte"] = query.date2;
		if(Object.keys(emissionDateCriteria).length>0) criteria.dateEmission = emissionDateCriteria;
    const count = await Tender.count(criteria);
    res.status(200).json({ count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getAll,
  getOne,
  tenderNumber
};
