
const {ProductosDefectuosos} = require('../db')





const createProductd = async (req, res, next) => {
  try {
    const { barcode, name, cantidadDevuelta, fechaDevolucion, invoiceNumber } =
      req.body;

    let existingProduct = await ProductosDefectuosos.findOne({
      where: { barcode: barcode },
    });

    if (!existingProduct) {
      // Crear el producto en la tabla de productos
      existingProduct = await ProductosDefectuosos.create({
        name: name,
        invoiceNumber,
        barcode,
        cantidadDevuelta,
        quantity,
        fechaDevolucion
      });
    } else {
      // Incrementar la cantidad del producto en la tabla de productos
      return res
        .status(409)
        .json({ messague: "Ya existe un producto con ese codigo " });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


const updateProductDefectuoso = async(req, res, next)=> {

    try{
  
      const id = req.params.id
  
  
      const product = await ProductosDefectuosos.findByPk(id);
      if(!product){
  
        return res.status(404),json({message:"No se encontro producto"})
      }
  
      else
    product.update(req.body);
    res.status(201).json({message:"Producto editado con exito "})
  
  
  
  
    }catch(err){
  
      res.status(500).json(err)
      next(err);
    }
  
  }


  const getProducts = async (req, res, next) => {
    try {
      const products = await ProductosDefectuosos.findAll();
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No hay productos que mostrar" });
      }
  
     
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocurrió un error al obtener los productos" });
    }
  };
  
  const deleteProductP = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const product = await ProductosDefectuosos.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "No se encontró el producto" });
      }
  
      // // Buscar el inventario del producto
      // const inventory = await Inventory.findOne({ where: { productId: id } });
      // if (!inventory) {
      //   return res.status(404).json({ message: "No se encontró el inventario del producto" });
      // }
  
      // Eliminar el producto de la tabla Product
      await product.destroy();
  
      // Eliminar el inventario del producto
      // await inventory.destroy();
  
      res.status(200).json({ message: "Producto y su inventario eliminados correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocurrió un error al eliminar el producto" });
    }
  };
  

  const deleteMultipleProductsDefec = async (req, res, next) => {
    try {
      const { ids } = req.body;
  
      // Verificar que se proporcionaron los IDs de los productos
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "IDs de productos no proporcionados correctamente" });
      }
  
      // Buscar los productos por sus IDs
      const products = await ProductosDefectuosos.findAll({ where: { id: ids } });
  
      // Verificar si todos los productos existen
      if (products.length !== ids.length) {
        return res.status(404).json({ message: "No se encontraron todos los productos" });
      }
  
      // Obtener los IDs de los productos encontrados
      const foundProductIds = products.map((product) => product.id);
  
      // Buscar y eliminar los registros correspondientes en el inventario
      await ProductosDefectuosos.destroy({ where: { productId: foundProductIds } });
  
      // Eliminar los productos
      await ProductosDefectuosos.destroy({ where: { id: foundProductIds } });
  
      res.status(200).json({ message: "Productos y sus inventarios eliminados correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocurrió un error al eliminar los productos" });
    }
  };

  const serachProductByQuery= async (req, res, next) => {
    console.log("Buscando Productos...");
    const { q } = req.query;
  
    try {
      const product = await ProductosDefectuosos.findAll({
        where: {
          [Op.or]: [
            {
              barcode: {
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
      console.log("Consulta SQL generada:", product.toString()); // Nueva línea de código
      console.log("Aqui el log", product);
      console.log("q:", product.toString()); // Verificar la consulta
      if (product.length === 0) {
        console.log("No se encontraron Productos.");
        return res.status(404).json({ message: "No se Encontro Producto" });
      }
      res.status(200).json(product);
    console.log(product);
  
    }catch(err){

      res.status(500).json(err)
      next(err)
    }
  }



  module.exports={

getProducts,
updateProductDefectuoso,
createProductd,
deleteMultipleProductsDefec,
deleteProductP,
serachProductByQuery



  }
 