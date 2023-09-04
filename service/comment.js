const getConnection = require("../database/connection");
const oracledb = require("oracledb");

const getCommentaire = async (req, res) => {
  try {
    const connection = await getConnection();
    const article_id = req.query.article_id;
    const result = await connection.execute(
      `SELECT c.*, concat(concat(u.nom, ' '), u.prenom) utilisateur FROM commentaire c join utilisateur u on c.utilisateur_id=u.id where article_id=${article_id}`,
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

const getCountCommentaire = async (req, res) => {
  try {
    const connection = await getConnection();
    const article_id = req.query.article_id;
    const result = await connection.execute(
      `SELECT count(*) count FROM commentaire c where article_id=${article_id}`,
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

const insertComment = async (req, res) => {
  try {
    const { contenu, utilisateur_id, article_id } = req.body;
    const connection = await getConnection();
    const insertQuery = `INSERT INTO commentaire (contenu, utilisateur_id, article_id) VALUES (:contenu, :utilisateur_id, :article_id)`;
    const bindParams = {
      contenu,
      utilisateur_id,
      article_id,
    };

    const result = await connection.execute(insertQuery, bindParams, {
      autoCommit: true,
    });

    await connection.close();

    res.json({ message: "Row inserted successfully", inserted: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  getCommentaire,
  insertComment,
  getCountCommentaire
};
