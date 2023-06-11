const { Product, Inventory, Store } = require("../db");

const {Op} = require('sequelize')

// Controlador para crear un nuevo producto en el inventario
// Controlador para crear un nuevo producto
const createProduct = async (req, res, next) => {
  try {
    const { name, price, barcode, description, quantity } = req.body;

    let existingProduct = await Product.findOne({
      where: { barcode: barcode },
    });

    if (!existingProduct) {
      // Crear el producto en la tabla de productos
      existingProduct = await Product.create({
        name: name,
        price,
        barcode,
        description,
        quantity,
      });
    } else {
      // Incrementar la cantidad del producto en la tabla de productos
     return res.status(409).json({messague:'Ya existe un producto con ese codigo '})
    }

    res.status(200).json(existingProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al crear el producto" });
    next(error);
  }
};

const updateProduct = async(req, res, next)=> {

  try{

    const id = req.params.id


    const product = await Product.findByPk(id);
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

  
// Controlador para actualizar la existencia de un producto
const updateProductQuantity = async (req, res, next) => {
    try {
      const  id  = req.params.id;
      const { quantity } = req.body;
  
      // Verificar si el producto existe
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      // Obtener el inventario del producto
      const inventory = await Inventory.findOne({ where: { id: id } });
      if (!inventory) {
        return res.status(404).json({ message: "Inventario no encontrado" });
      }
  
      // Calcular la nueva cantidad en base a la cantidad actual y la cantidad proporcionada
      const newQuantity = inventory.quantity + quantity;
  
      // Actualizar la existencia del producto en el inventario
      // await Inventory.update(
      //   { quantity: newQuantity, name:name, price:price },
      //   { where: { id: id } }
      // );
  
      // Actualizar la existencia del producto en la tabla de productos
      await Product.update(
        { quantity: newQuantity },
        { where: { id } }
      );
  
      res.status(200).json({ message: "Existencia actualizada  correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocurrió un error al actualizar la existencia del producto" });
    }
  };
  
// Controlador para obtener todos los productos desde el modelo Product
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    if(products.length === 0){

        return res.status(404).json({message:"No Hay Productos que mostrar"})
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los productos" });
  }
};


const getAllQuantity =async (req, res, next) => {

  try{

    const allProductsP = await Product.findAll() 

    const totalP = allProductsP.length


   const allProductS = await Store.findAll();
   
   const totalS = allProductS.length

const totalGeneral = totalP + totalS
  
res.status(200).json(totalGeneral)

console.log(totalGeneral)

  }catch(err){

    res.status(500).json({err})
    next(err)
  }


}


const getAllQuantityProduct = async (req, res, next) => {
  try {
    let totalP = 0;
    let totalS = 0;

    // tengo que reccorrer cada producto e ir sumandolooo 
    const allProductsP = await Product.findAll();
    allProductsP.forEach((product) => {
      totalP += product.quantity;
    });

    const allProductsS = await Store.findAll();
    allProductsS.forEach((store) => {
      totalS += store.quantity;
    });

    const totalGeneral = totalP + totalS;

    res.status(200).json(totalGeneral);
    console.log(totalGeneral);
  } catch (err) {
    res.status(500).json({ error: err });
    next(err);
  }
};



const deleteProductP = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const product = await Product.findByPk(id);
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
  


  const deleteMultipleProducts = async (req, res, next) => {
    try {
      const { ids } = req.body;
  
      // Verificar que se proporcionaron los IDs de los productos
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "IDs de productos no proporcionados correctamente" });
      }
  
      // Buscar los productos por sus IDs
      const products = await Product.findAll({ where: { id: ids } });
  
      // Verificar si todos los productos existen
      if (products.length !== ids.length) {
        return res.status(404).json({ message: "No se encontraron todos los productos" });
      }
  
      // Obtener los IDs de los productos encontrados
      const foundProductIds = products.map((product) => product.id);
  
      // Buscar y eliminar los registros correspondientes en el inventario
      await Inventory.destroy({ where: { productId: foundProductIds } });
  
      // Eliminar los productos
      await Product.destroy({ where: { id: foundProductIds } });
  
      res.status(200).json({ message: "Productos y sus inventarios eliminados correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocurrió un error al eliminar los productos" });
    }
  };
  

  const moveProductToStoreA = async (req, res, next) => {
    try {
      const products = req.body;
  
      // Verificar si los productos existen en el inventario
      const inventoryProducts = await Product.findAll({
        where: { id: products.map(product => product.id) }
      });
  
      const invalidProducts = [];
      const validProducts = [];
  
      // Verificar y validar cada producto
      for (const product of products) {
        const inventoryProduct = inventoryProducts.find(p => p.id === product.id);
  
        if (!inventoryProduct) {
          invalidProducts.push(product.id);
        } else if (inventoryProduct.quantity < product.quantity) {
          invalidProducts.push(product.id);
        } else {
          validProducts.push({
            inventoryProduct,
            quantity: product.quantity
          });
        }
      }
  
      if (invalidProducts.length > 0) {
        return res.status(400).json({
          message: 'Algunos productos no están disponibles en la cantidad deseada',
          invalidProducts
        });
      }
  
      // Crear instancias de productos en la tienda y actualizar cantidades en el inventario
      const storeProducts = [];
  
      for (const { inventoryProduct, quantity } of validProducts) {
        let storeProduct = await Store.findOne({
          where: { barcode: inventoryProduct.barcode }
        });
  
        if (storeProduct) {
          // Si el producto ya existe en la tienda, actualizar la cantidad existente
          storeProduct.quantity += quantity;
          await storeProduct.save();
        } else {
          // Si el producto no existe, crear un nuevo registro en la tienda
            storeProduct = await Store.create({
            barcode: inventoryProduct.barcode,
            name: inventoryProduct.name,
            description: inventoryProduct.description,
            price: inventoryProduct.price,
            quantity
          });
        }
  
        // inventoryProduct.quantity -= quantity;
        // await inventoryProduct.save();
  
        storeProducts.push(storeProduct);
  
        // Actualizar la cantidad en la tabla Products
        const product = await Product.findByPk(inventoryProduct.id);
        product.quantity -= quantity;
        await product.save();
      }
  
      res.status(200).json(storeProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocurrió un error al pasar los productos a la tienda'
      }
      
      );
      next(error)
    }
  };
  

  const serachProductByQuery= async (req, res, next) => {
    console.log("Buscando Productos...");
    const { q } = req.query;
  
    try {
      const product = await Product.findAll({
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
 


  const serachProductByQueryStore= async (req, res, next) => {
    console.log("Buscando Productos...");
    const { q } = req.query;
  
    try {
      const product = await Store.findAll({
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
 


module.exports = {
  createProduct,
  getProducts,
  updateProductQuantity,
  deleteProductP,
  deleteMultipleProducts,
  moveProductToStoreA,
  serachProductByQuery,
  updateProduct,
  getAllQuantity,
  getAllQuantityProduct
};
