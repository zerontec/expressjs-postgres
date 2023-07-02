const { Seller, InvoiceFactura } = require("../db");
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

    res.status(201).json({seller});
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



// Controlador para obtener las estadísticas de ventas de un vendedor
const getSalesStats = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    // Obtener la fecha actual
    const currentDate = new Date();

    // Obtener la fecha de inicio y fin del día actual
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

    // Obtener la fecha de inicio y fin de la semana actual
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);

    // Obtener la fecha de inicio y fin del mes actual
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Consultar las ventas del vendedor para el día actual
    const daySales = await InvoiceFactura.sum('amount', {
      where: {
        sellerId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }
    });

    // Consultar las ventas del vendedor para la semana actual
    const weekSales = await InvoiceFactura.sum('amount', {
     
      where: {
        sellerId:sellerId,
        date: {
          $gte: startOfWeek,
          $lt: endOfWeek
        }
      }
    });

    // Consultar las ventas del vendedor para el mes actual
    const monthSales = await InvoiceFactura.sum('amount', {
      where: {
        sellerId:sellerId,
       sellerId,
        date: {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
      }
    });

    res.json({
      daySales: daySales || 0,
      weekSales: weekSales || 0,
      monthSales: monthSales || 0
    });
  } catch (error) {
    next(error);
  }
};


const getProductsBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    // Verificar si el vendedor existe
    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Vendedor no encontrado' });
    }

    // Obtener los productos vendidos por el vendedor
    const products = await InvoiceFactura.findAll({
      where: {
       sellerId,
      },
      attributes: ['productoFactura'],
      include: [{ model: Seller }],
    });

    // Crear una lista de los productos vendidos
    const productList = [];
    products.forEach((invoice) => {
      const { productoFactura } = invoice;
      productoFactura.forEach((product) => {
        productList.push(product);
      });
    });

    res.status(200).json({ seller, products: productList });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos del vendedor', error });
  next(error)
  }
};





module.exports = {
  createSeller,
  findAll,
  findOne,
  editSeller,
  deleteSeller,
  searchSellerByCode,
  getProductsBySeller,
  getSalesStats
};
