const getConnection = require("../database/connection");
const bcrypt = require("bcrypt");
const oracledb = require("oracledb");

const getUsers = async (req, res) => {
  try {
    const connection = await getConnection();
    let wheres = [];
    if(req.query.nom) wheres.push(`NOM = '${req.query.nom}'`);
    if(req.query.active) wheres.push(`ACTIVE = '${req.query.active}'`);
    if(req.query.valide) wheres.push(`VALIDE = '${req.query.valide}'`);
    wheres = wheres.join(' AND ');
    if(wheres!=='') wheres = ` WHERE ${wheres}`;
    const result = await connection.execute(
      `SELECT * FROM utilisateur ${wheres}`,
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

async function getUserByEmail(email) {
  let connection;
  try {
    connection = await getConnection();
    const query = "SELECT * FROM utilisateur WHERE email = :email";
    const result = await connection.execute(query, [email], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows[0];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user || (user && user.VALIDE == 0) || (user && user.ACTIVE == 0)) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

    if (passwordMatch) {
      delete user.PASSWORD;
      res.json({ user });
    } else {
      res.status(401).json({ message: "Mot de passe incorrect" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};


const getUser = async (req, res) => {
  try {
    const connection = await getConnection();
    const user_id = req.params.id;
    const result = await connection.execute(
      `SELECT * FROM utilisateur where id=${user_id}`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

async function validateUser(userId) {
  let connection;
  try {
    connection = await getConnection();

    const updateQuery = `
        UPDATE utilisateur
        SET valide=1
        WHERE id = :userId
      `;

    const bindParams = {
      userId,
    };

    const result = await connection.execute(updateQuery, bindParams, {
      autoCommit: true,
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const validate = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await validateUser(userId);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

async function activateUser(userId) {
  let connection;
  try {
    connection = await getConnection();

    const updateQuery = `
        UPDATE utilisateur
        SET active=1
        WHERE id = :userId
      `;

    const bindParams = {
      userId,
    };

    const result = await connection.execute(updateQuery, bindParams, {
      autoCommit: true,
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const activate = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await activateUser(userId);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

async function deactivateUser(userId) {
  let connection;
  try {
    connection = await getConnection();

    const updateQuery = `
        UPDATE utilisateur
        SET active=0
        WHERE id = :userId
      `;

    const bindParams = {
      userId,
    };

    const result = await connection.execute(updateQuery, bindParams, {
      autoCommit: true,
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const deactivate = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await deactivateUser(userId);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

async function insertUser(nom, prenom, email, password, role, type) {
  let connection;
  try {
    connection = await getConnection();
    const query =
      "INSERT INTO utilisateur (id,nom,prenom,email,password,role,type) VALUES (utilisateur_sequence.NEXTVAL, :nom, :prenom, :email, :password, :role, :type)";
    const bindParams = {
      nom,
      prenom,
      email,
      password,
      role,
      type,
    };
    const result = await connection.execute(query, bindParams, {
      autoCommit: true,
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const signup = async (req, res) => {
  try {
    const { nom, prenom, email, password, confirmPassword, role, type } =
      req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Veuillez confirmer le mot de passe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await insertUser(nom, prenom, email, hashedPassword, role, type);

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

async function updateUserDb(id, newData) {
  let connection;
  try {
    connection = await getConnection();

    const updateQuery = `
        UPDATE utilisateur
        SET nom = :nom, prenom = :prenom, email = :email
        WHERE id = :id
      `;

    const bindParams = {
      id,
      nom: newData.nom,
      prenom: newData.prenom,
      email: newData.email,
    };

    const result = await connection.execute(updateQuery, bindParams, {
      autoCommit: true,
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    // if (
    //   newData.password !== "" &&
    //   newData.password !== newData.confirmPassword
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "Veuillez confirmer le mot de passe" });
    // }

    const result = await updateUserDb(id, newData);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  login,
  validate,
  activate,
  deactivate,
  updateUser,
  signup,
  getUser,
  getUsers
};
