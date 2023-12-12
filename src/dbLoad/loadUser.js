const bcrypt = require("bcryptjs");
const { Role, User } = require("../db");

const defaultAdminAndRoles = async (req, res, next) => {
  try {
    const roldb = await Role.findAll();
    if (roldb.length === 0) {
      const rolAdmin = await Role.create({
        id: 1,
        name: "admin",
      });

      const rolUserTl = await Role.create({
        id: 2,
        name: "tecnico",
      });

      const rolUserGl = await Role.create({
        id: 3,
        name: "facturacion",
      });
    } else {
      res.status(200).send({ message: "Roles exist" });
    }

    const userdb = await User.findOne({
      where: {
        id: 1,
      },
    });
    if ("!userdb") {
      const user = await User.create({
        name: "AdminTrack",
        username: "zeroncold",
        email: "admin@gzeroncold.com",
        password: bcrypt.hashSync("admin", 10),
      });
      await user.addRoles(1);
    } else {
      res.status(200).send({ message: "User exist" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};


module.exports={

    defaultAdminAndRoles
}