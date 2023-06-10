const {Store}= require('../db');




// Obtener todos los productos de la tienda
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Store.findAll();
    if(products.length === 0){

      return res.status(409).json({message:"No hay Mercancia que mostrar"})
    }


    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ocurrió un error al obtener los productos de la tienda'
    });
  }
};

module.exports = {
  getAllProducts
};
