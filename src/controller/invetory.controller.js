const {
  Inventory,
  Purchase,
  Store,
  Supplier,
  AccountPayable,
  Product
} = require('../db');
const {
  Op
} = require('sequelize');

// Obtener todos los productos del inventario
const findAllProductsInventory = async (req, res, next) => {
  try {
    const products = await Inventory.findAll();
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron productos en el inventario'
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ocurrió un error al obtener los productos del inventario'
    });
  }
};

// Crear un nuevo producto en el inventario
// Crear un nuevo producto en el inventario o actualizar si ya existe
const createProductInventory = async (req, res, next) => {
  try {
    const {
      name,
      price,
      barcode,
      description,
      quantity,
      alertThreshold
    } = req.body;

    // Verificar si el producto ya existe en el inventario
    let existingProduct = await Inventory.findOne({
      where: {
        barcode
      }
    });

    if (!existingProduct) {
      // Crear un nuevo producto en el inventario si no existe
      existingProduct = await Inventory.create({
        barcode,
        name:name,
        description,
        price,
        quantity
      });



      existingProduct= await Product.findOne({

        where:{

          barcode
        }

      });

      if(!existingProduct){

      // Crear un nuevo producto en la tabla de productos
      await Product.create({
        barcode,
        name:name,
        description,
        price,
        quantity
      });
    }
    } else {
      // Actualizar cantidad y precio si el producto ya existe en el inventario
      existingProduct.quantity += quantity;
      existingProduct.price = price;
      await existingProduct.save();

      // Actualizar el producto en la tabla de productos
      
      await Product.update(
        { name, price,quantity },
        { where: { barcode } }
      );
    }

    // Verificar si el inventario está por debajo del umbral de alerta
    if (existingProduct.quantity < alertThreshold) {
      // Crear una alerta de inventario bajo
      const newAlert = await Alert.create({
        productId: existingProduct.id,
        message: 'Inventario bajo. Por favor reabastecer.'
      });

      // Puedes enviar notificaciones o realizar acciones adicionales aquí
    }

    res.status(200).json(existingProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ocurrió un error al crear o actualizar el producto en el inventario'
    });
  }
};




// Pasar productos del inventario a la tienda
const moveProductToStore = async (req, res, next) => {
  try {
    const products = req.body;

    // Verificar si los productos existen en el inventario
    const inventoryProducts = await Inventory.findAll({
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

      inventoryProduct.quantity -= quantity;
      await inventoryProduct.save();

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


// Obtener un producto específico del inventario por su ID
const getProductById = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Inventory.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado en el inventario'
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener el producto del inventario'
    });
  }
};




const updateInventoryProduct = async (req, res, next) => {
  try {
    const { id, quantity, name, price } = req.body;

    // Actualizar la existencia del producto en el inventario
    await Inventory.update(
      { quantity, name, price },
      { where: { id } }
    );

    // Actualizar la cantidad en la tabla de productos
    await Product.update(
      { quantity },
      { where: { id } }
    );

    // Actualizar el nombre y precio en la tabla de productos (opcional)
    await Product.update(
      { name, price },
      { where: { id } }
    );

    res.status(200).json({ message: 'Existencia del producto actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocurrió un error al actualizar la existencia del producto' });
  next(error)
  }
};













// Actualizar la cantidad de un producto en el inventario
const updateProductQuantity = async (req, res, next) => {
  const productId = req.params.id;
  const {
    quantity
  } = req.body;

  try {
    const product = await Inventory.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado en el inventario'
      });
    }

    product.quantity = quantity;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al actualizar la cantidad del producto en el inventario'
    });
  }
};

// Editar un producto en el inventario
const editProduct = async (req, res, next) => {
  const productId = req.params.id;
  const {
    name,
    description,
    price
  } = req.body;

  try {
    const product = await Inventory.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado en el inventario'
      });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al editar el producto en el inventario'
    });
  }
};

// Eliminar un producto del inventario
const deleteProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    const productI = await Inventory.findByPk(id);

    if (!productI) {
      return res.status(404).json({
        message: 'Producto no encontrado en el inventario'
      });
    }

    const productP = await Product.findByPk(id);
      if (!productP) {
        return res.status(404).json({ message: "No se encontró el producto" });
      }

    await productI.destroy();
    await productP.destroy();

    res.status(200).json({
      message: 'Producto eliminado del inventario correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar el producto del inventario'
    });
  }
};

const deleteMultipleProducts = async (req, res, next) => {
  const productIds = req.body.productIds;

  try {
    const products = await Inventory.findAll({
      where: {
        id: productIds
      }
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: 'Productos no encontrados en el inventario'
      });
    }

    await Inventory.destroy({
      where: {
        id: productIds
      }
    });

    res.status(200).json({
      message: 'Productos eliminados del inventario correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar los productos del inventario'
    });
  }
};
const searchProducts = async (req, res, next) => {
  try {
    const {
      searchQuery
    } = req.query;

    const products = await ProductInventory.findAll({
      where: {
        [Op.or]: [{
          name: {
            [Op.like]: `%${searchQuery}%`
          }
        }, {
          barcode: {
            [Op.like]: `%${searchQuery}%`
          }
        }, ]
      }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};


const createInventoryMovement = async (req, res, next) => {
  try {
    const {
      productId,
      quantity,
      type
    } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!productId || !quantity || !type) {
      return res.status(400).json({
        error: 'Falta información requerida'
      });
    }

    // Crear el registro del movimiento en el inventario
    const newInventoryMovement = await InventoryMovement.create({
      productId,
      quantity,
      type
    });

    res.status(200).json(newInventoryMovement);
  } catch (error) {
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};


module.exports = {
  findAllProductsInventory,
  createProductInventory,
  moveProductToStore,
  updateProductQuantity,
  deleteProduct,
  createInventoryMovement,
  searchProducts,
  deleteMultipleProducts,
  editProduct,
  updateInventoryProduct,
  getProductById

};
