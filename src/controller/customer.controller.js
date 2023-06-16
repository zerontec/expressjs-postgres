const { Customer, Invoice} = require("../db");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");


const searchCustomer = async (req, res, next) => {
    try {
      const { identification } = req.body;
  
      const customer = await Customer.findOne({
        where: {
          identification,
        },
      });
  
      if (customer) {
        // enviar la información del customer encontrado como respuesta
        res.status(200).json(customer);
      } else {
        // enviar una respuesta indicando que el cliente no fue encontrado
        res.status(404).json({ message: "Cliente no encontrado" });
      }
    } catch (err) {
      // enviar una respuesta de error si ocurre algún problema durante la búsqueda
      res.status(500).json({ message: err });
      next(err);
    }
  };

  const FindCustomertByCedula = async (req, res, next) => {
    try {
      const searchCedula = await Customer.findByPk(req.params.id);
  
      if (searchCedula) {
        return res.status(200).json({ searchCedula });
      } else {
        return res.status(404).json({ message: "Cliente no encontrado Agregar" });
      }
    } catch (err) {
      res.status(500).json({ message: err });
      next(err);
    }
  };


  //buscar por identifcacion por query

  const buscarClientePorIdentificacion = async (req, res, next) => {
    console.log("Buscando Clientes...");
    const { q } = req.query;
  
    try {
      const customer = await Customer.findAll({
        where: {
          [Op.or]: [
            {
              identification: {
                [Op.iLike]: `%${q}%`,
              },
            },
            {
              name: {
                [Op.iLike]: `%${q}%`,
              },
            },
          ],
        },
      });
      console.log("Consulta SQL generada:", customer.toString()); // Nueva línea de código
      console.log("Aqui el log", customer);
      console.log("q:", customer.toString()); // Verificar la consulta
      if (customer.length === 0) {
        console.log("No se encontraron clientes.");
        return res.status(404).json({ message: "No se Encontro Cliente Agregelo" });
      }
      res.status(200).json(customer);
    console.log(customer);
  
    }catch(err){

      res.status(500),json(err)
    }
  }
 
    


  
const FindClientByCedula = async (req, res, next) => {
    try {
      const searchCedula = await Client.findByPk(req.params.id);
  
      if (searchCedula) {
        return res.status(200).json({ searchCedula });
      } else {
        return res.status(404).json({ message: "Cliente no encontrado Agregar" });
      }
    } catch (err) {
      res.status(500).json({ message: err });
      next(err);
    }
  };
  
  const createCustomer = async (req, res, next) => {
    try {
      const { identification } = req.body;
  
      const customer = await Customer.findOne({
        where: {
          identification,
        },
      });
  
      if (customer) {
        return res
          .status(409)
          .json({
            message: "Ya existe un cliente con ese número de identificación",
          });
      }
  
      const { name, address, telf } = req.body;
  
      if (!name || !identification) {
        return res.status(400).json({ message: "Nombre e identificación requeridos" });
      }
  
      const newCustomer = await Customer.create({
        name,
        identification,
        address,
        telf,
      });
  
      res.status(200).json(newCustomer);
    } catch (err) {
      res.status(500).json({ message: err });
      next(err);
    }
  };
  



  const editCustomer = async (req, res, next) => {
    const id = req.params.id;
  
    const { name, identification, telf, address } = req.body;
  
    try {
      const customer= await Customer.findByPk(id);
      if (!customer) {
        return res.status(401).json({ message: `customere con ${id} no existe` });
      } else {
        customer.update(req.body);
        res
          .status(201)
          .json({ message: `customer con ${id} actualizado con exito ` });
      }
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  };


  const numberCustomer = async (req, res, next) => {
    try {
      const customer = await Customer.findAll({});
      if (!customer) {
        return res.status(404).json({ message: "No hay data que mostrar" });
      }
  
      const count = customer.length;
  
      res
        .status(200)
        .json({ message: "Numero de clientes en la base de datos ", count });
    } catch (err) {
      res.status(500).json({ err });
    }
  };

  

  const findAllCustomer = async (req, res, next) => {
    try {
      const customer = await Customer.findAll();
  
      if (!customer) {
        return res
          .status(404)
          .json({ message: "no hay informacion que mostrar" });
      } else {
        return res.status(200).json({customer});
      }
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  };

  const deleteCustomer = async (req, res, next) => {
    let id = req.params.id;
    try {
      const customer = await Customer.findByPk(id);
      if (customer) {
        await customer.destroy();
        res.status(200).json({ message: "Cliente borrado con exito" });
      } else {
        res.status(400).json({ message: "No se encontro cliente con ID " });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
  

  module.exports={
createCustomer,
editCustomer,
FindCustomertByCedula,
findAllCustomer,
deleteCustomer,
numberCustomer,
searchCustomer,
buscarClientePorIdentificacion


  }