const getConnection = require("../database/connection");
const oracledb = require("oracledb");

const getAllArticles = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute("SELECT * FROM article", [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    await connection.close();
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getArticleDetails = async (req, res) => {
  try {
    const connection = await getConnection();
    const article_id = req.params.id;
    const result = await connection.execute(
      `SELECT * FROM article where id=${article_id}`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  getAllArticles,
  getArticleDetails,
};
