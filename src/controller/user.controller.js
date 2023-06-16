const { User ,Role} = require("../db");
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize')

/**
 * It creates a new user with a hashed password.
 * @param req - the request object
 * @param res - the response object
 * @param next - a function that will be called when the middleware is done.
 */

const createUser = async (req, res, next) => {
  
    const { email, username, isSeller  } = req.body;
    
    let existingEmail = await User.findOne({
      where: {
        email: email
      }
    });

    if (existingEmail) {
      return res.status(409).json({ message: 'Ya existe el email en el sistema' });
    }
  
    let existingUsername = await User.findOne({
      where: {
        username: username
      }
    });

    if (existingUsername !== null) {
      return res.status(409).json({ message: 'Ya existe el usuario en el sistema' });
    }


    
  
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
  
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
     
      password: hash,
    })

    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "Usuario registrado satisfactoriamente" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([2]).then(() => {
          res.send({ message: "Usuario registrado satisfactoriamente" });
        });
      }
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
  
   
 
};

// const createUser = async (req, res, next) => {
  
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(req.body.password, salt);

//     const newUser = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       name: req.body.name,
//       role:req.body.role,
//       password: hash,
//     })

//     .then((user) => {
//       if (req.body.roles) {
//         Role.findAll({
//           where: {
//             name: {
//               [Op.or]: req.body.roles,
//             },
//           },
//         }).then((roles) => {
//           user.setRoles(roles).then(() => {
//             res.send({ message: "Usuario registrado satisfactoriamente" });
//           });
//         });
//       } else {
//         // user role = 1
//         user.setRoles([2]).then(() => {
//           res.send({ message: "Usuario registrado satisfactoriamente" });
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({ message: err.message });
//     });
  
  
// };

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
      : res.status(404).send({ message: "No se ENcontro Informacion" });
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
      ? res.status(200).send({ user, message: "User Find" })
      : res.status(404).send({ message: "User not found" });
  } catch (err) {
    res.status(500).send(err, "something went wrong");
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
      // Actualizar los datos del usuario
      await user.update(req.body);

      if (req.body.roles) {
        // Si se proporciona el campo "roles" en req.body, actualizar también los roles del usuario
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        });
        await user.setRoles(roles);
      }

      res.status(201).send({ user, message: "Usuario actualizado exitosamente" });
    } else {
      res.status(400).send({ message: "Usuario no encontrado" });
    }
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
      res.status(200).send({ message: "user has been deleted" });
    } else {
      res.status(400).send({ message: "User no Found" });
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
      res.status(200).send({ datEmail, message: "Email find" });
    } else {
      res.status(404).send({ message: "Email no Found" });
    }
  } catch (err) {
    res.status(500).send({ err, message: "Erron in search" });
  }
};


const serachUserByQuery= async (req, res, next) => {
  console.log("Buscando usuarios...");
  const { q } = req.query;

  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${q}%`,
            },
          },
        ],
      },
    });
    console.log("Consulta SQL generada:", users.toString()); // Nueva línea de código
    console.log("Aqui el log", users);
    console.log("q:", users.toString()); // Verificar la consulta
    if (users.length === 0) {
      console.log("No se encontraron usersos.");
      return res.status(404).json({ message: "No se Encontro Usuario" });
    }
    res.status(200).json(users);
  console.log(users);

  }catch(err){

    res.status(500).json(err)
    next(err)
  }
}

const deleteMultipleUsers = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Verificar que se proporcionaron los IDs de los productos
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "IDs de usuarios no proporcionados correctamente" });
    }

    // Buscar los productos por sus IDs
    const users = await User.findAll({ where: { id: ids } });

    // Verificar si todos los productos existen
    if (users.length !== ids.length) {
      return res.status(404).json({ message: "No se encontraron todos los usuarios" });
    }

    // Obtener los IDs de los productos encontrados
    const foundUserIds = users.map((user) => user.id);

  
    // Eliminar los Useros
    await User.destroy({ where: { id: foundUserIds } });

    res.status(200).json({ message: "usuarios  eliminados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al eliminar los usuarios" });
  }
};



module.exports = {
  getAllUser,
  createUser,
  getUser,
  putUser,
  deleteUser,
  searchUser,
  serachUserByQuery,
  deleteMultipleUsers
};
