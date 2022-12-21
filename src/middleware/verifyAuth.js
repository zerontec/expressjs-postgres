const {User, ROLES} = require ('../db');


const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Usuario en uso :(!",
        });
        return;
      }
  
      // Email
      User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user) => {
        if (user) {
          res.status(400).send({
            message: "Este Email esta en uso ",
          });
          return;
        }
  
        next();
      });
    });
  };

 const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Role no existe = " + req.body.roles[i],
          });
          return;
        }
      }
    }
  
    next();
  };

 module.exports ={

    checkDuplicateUsernameOrEmail,
    checkRolesExisted

 }