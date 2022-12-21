const { User } = require("../db");
const bcrypt = require("bcryptjs");

/**
 * It creates a new user with a hashed password.
 * @param req - the request object
 * @param res - the response object
 * @param next - a function that will be called when the middleware is done.
 */

const createUser = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      //   role:req.body.role,
      password: hash,
    });

    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
};

/**
 * It's a function that gets all the users from the database and sends them to the client.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to move on to the next middleware.
 */
const getAllUser = async (req, res, next) => {
  try {
    console.log("Estamos en user");
    const users = await User.findAll();

    return users
      ? res.status(200).send({ users })
      : res.status(404).send({ message: "No Found Data" });
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * It's an async function that takes in a request, response, and next function as parameters. It then
 * tries to find a user by their id and if it finds one, it sends a 200 status code with the user and a
 * message. If it doesn't find one, it sends a 404 status code with a message. If there's an error, it
 * sends a 500 status code with the error and a message.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to move on to the next middleware.
 * @returns The user object or an error message.
 */

const getUser = async (req, res, next) => {
  try {
    let { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
    });
    return user
      ? res.status(200).send({ user, message: "Usuario encontrado" })
      : res.status(404).send({ message: "Usuario no Encontrado" });
  } catch (err) {
    res.status(500).send(err, "Algo salio mal ");
  }
};

/**
 * It finds a user by their primary key and sends the user back to the client.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */

const putUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.update(req.body);
      res.status(201).send({ user, message: "usuario Actualizado" });
    } else res.status(400).send({ message: "Usuario no Encontrado" });
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * It finds a user by id, and if it finds one, it deletes it.
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to move on to the next middleware.
 */
const deleteUser = async (req, res, next) => {
  try {
    let { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (user) {
      await user.destroy();
      res.status(200).send({ message: "Usuario Borrado" });
    } else {
      res.status(400).send({ message: "usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};




const searchUser = async (req, res, next) => {
  try {
    let { email} = req.query;

    const datEmail = await User.findOne({
      where: { email},
    });
    if (datEmail) {
      res.status(200).send({ datEmail, message: "Email encontrado" });
    } else {
      res.status(404).send({ message: "Email no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ err, message: "Error en busqueda" });
  }
};

module.exports = {
  getAllUser,
  createUser,
  getUser,
  putUser,
  deleteUser,
  searchUser,
};
