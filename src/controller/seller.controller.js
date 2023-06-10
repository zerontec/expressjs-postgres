const { Seller } = require("../db");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const createSeller = async (req, res, next) => {
  try {
    const { identification, codigo, name, address, telf } = req.body;

    const seller = await Seller.findOne({
      where: {
        identification,
      },
    });

    if (seller) {
      return res.status(409).json({
        message: "Ya existe un Vendedor  con ese número de identificación",
      });
    }

    const sellerByCodigo = await Seller.findOne({
      where: {
        codigo,
      },
    });

    if (sellerByCodigo) {
      return res.status(409).json({
        message: "Ya existe un vendedor con ese código",
      });
    }

    const newSeller = await Seller.create({
      codigo,
      name,
      identification,
      address,
      telf,
    });

    res.status(200).json(newSeller);
  } catch (err) {
    res.status(500).json({ message: err });
    next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    const seller = await Seller.findAll();
    if (!seller.length) {
      return res.status(404).json({ messague: "No se encontro Vendedores" });
    }

    res.status(201).json(seller);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const id = req.params.id;

    const seller = await Seller.findByPk(id);

    if (!seller) {
      return res
        .status(404)
        .json({ messague: "No se encontro vendedor con ese Id" });
    }

    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json(err);
  }
};


const editSeller = async (req, res, next) => {
  const id = req.params.id;

  const {codigo, name, identification, telf, address } = req.body;

  try {
    const seller= await Seller.findByPk(id);
    if (!seller) {
      return res.status(401).json({ message: `vendedor  con ${id} no existe` });
    } else {
      seller.update(req.body);
      res
        .status(201)
        .json({ message: `vendedor con ${id} actualizado con exito ` });
    }
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

const deleteSeller = async (req, res, next) => {
  let id = req.params.id;
  try {
    const seller = await Seller.findByPk(id);
    if (seller) {
      await seller.destroy();
      res.status(200).json({ message: "Vendedor borrado con exito" });
    } else {
      res.status(400).json({ message: "No se encontro Vendedor con ID " });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchSellerByCode = async (req, res, next) => {
  console.log("Buscando Vendedores...");
  const { q } = req.query;

  try {
    const seller = await Seller.findAll({
      where: {
        [Op.or]: [
          {
            codigo: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            identification: {
              [Op.iLike]: `%${q}%`,
            },
          },
        ],
      },
    });
    console.log("Consulta SQL generada:", seller.toString()); // Nueva línea de código
    console.log("Aqui el log", seller);
    console.log("q:", seller.toString()); // Verificar la consulta
    if (seller.length === 0) {
      console.log("No se encontraron vendedores.");
      return res.status(404).json({ message: "No se Encontro Vendedor" });
    }
    res.status(200).json(seller);
  console.log(seller);

  }catch(err){

    res.status(500),json(err)
  }
}

  





module.exports = {
  createSeller,
  findAll,
  findOne,
  editSeller,
  deleteSeller,
  searchSellerByCode
};
