const {DevolucionesVentas,Purchase,Supplier,Customer, Product, Inventory, Store,InvoiceFactura, ProductosDefectuosos } = require("../db");

const {Op} = require('sequelize');

// Controlador para crear un nuevo producto en el inventario
// Controlador para crear un nuevo producto
const createProduct = async (req, res, next) => {
  try {
    const { name, price, barcode,description, quantity } = req.body;

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

    if (products.length === 0) {
      return res.status(404).json({ message: "No hay productos que mostrar" });
    }

    const productsWithDefectuosos = await Promise.all(
      products.map(async (product) => {
        const defectuosos = await ProductosDefectuosos.sum('cantidadDevuelta', {
          where: { barcode: product.barcode},
        });

        // Actualizar la columna "defectuosos" en la tabla de productos
        await product.update({ defectuosos: defectuosos || 0 });

        return product.toJSON();
      })
    );

    res.status(200).json(productsWithDefectuosos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al obtener los productos" });
  }
};



const getProductStat = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Purchase,
          as: 'productPurchases',
          attributes: ['id', 'createdAt'],
          include: [
            {
              model: Supplier,
              as: 'supplier',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          
            model: InvoiceFactura,
            as: 'products',
          attributes: ['id', 'createdAt'],
          include: [
            {
              model: Customer,
              as: 'customer',
              attributes: ['id', 'name'],
            },
          ],
        },
        // {
        //   model: DevolucionCompras,
        //   as: 'devolucionCompra',
        //   attributes: ['id', 'createdAt'],
        // },
        {
          model: DevolucionesVentas,
          as: 'productosDevueltos',
          attributes: ['id', 'createdAt'],
        },
      ],
      order: [
        ['productPurchases', 'createdAt', 'DESC'],
        ['products', 'createdAt', 'DESC'],
        ['devolucionCompra', 'createdAt', 'DESC'],
        ['productosDevueltos', 'createdAt', 'DESC'],
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No hay productos que mostrar' });
    }

    const formattedProducts = products.map((product) => {
      const purchases = product.purchases.map((purchase) => ({
        id: purchase.id,
        date: purchase.createdAt,
        supplier: purchase.supplier ? purchase.supplier.name : null,
      }));

      const sales = product.sales.map((sale) => ({
        id: sale.id,
        date: sale.createdAt,
        customer: sale.customer ? sale.customer.name : null,
      }));

      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        barcode: product.barcode,
        description: product.description,
        purchases,
        sales,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ocurrió un error al obtener los productos' });
  
  next(error)
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
 

  const incrementProductQuantity = async (req, res, next) => {
    try {
      const { codigo, cantidad, numeroFactura, proveedor, fechaUltimaCompra } = req.body;
  
      // Verificar si el producto ya existe en la base de datos
      const existingProduct = await Product.findOne({
        where: { codigo },
      });
  
      if (existingProduct) {
        // Incrementar la cantidad y actualizar la información adicional
        existingProduct.cantidad += cantidad;
        existingProduct.numeroFactura = numeroFactura;
        existingProduct.proveedor = proveedor;
        existingProduct.fechaUltimaCompra = fechaUltimaCompra;
  
        // Guardar los cambios en la base de datos
        await existingProduct.save();
  
        res.status(200).json({ message: 'Cantidad actualizada correctamente' });
      } else {
        // Crear un nuevo producto con la cantidad y la información adicional
        const newProduct = await Product.create({
          codigo,
          cantidad,
          numeroFactura,
          proveedor,
          fechaUltimaCompra,
        });
  
        res.status(201).json({ message: 'Producto creado correctamente' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al incrementar la cantidad del producto' });
    }
  };
  


  const crearCargaMasivaProductos = async (req, res, next) => {
    try {
      const productos = req.body; // Array de productos a cargar
  
      for (const producto of productos) {
        const { barcode, quantity, name,
        
          price  } = producto;
  
        // Verificar si el producto ya existe en la base de datos
        const productoExistente = await Product.findOne({
          where: { barcode },
        });
  
        if (productoExistente) {
          // El producto ya existe, actualizar la cantidad
          productoExistente.quantity += quantity;
          await productoExistente.save();
        } else {
          // El producto no existe, crear uno nuevo
          await Product.create({
            barcode,
            quantity,
            name,
          
          
            price
            // Otros campos relevantes del producto
          });
        }
      }
  
      res.status(200).json({ message: 'Carga masiva de productos exitosa' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al realizar la carga masiva de productos' });
    }
  };




  const obtenerEstadisticasProducto = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Obtener el producto
      const producto = await Product.findByPk(id);
  
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // Obtener las compras del producto
      const compras = await Purchase.findAll({
        include: [
          {
            model: Product,
            as: 'productos',
            where: { id: id },
          },
        ],
      });
  
      // Obtener las ventas del producto
      const ventas = await InvoiceFactura.findAll({
        include: [
          {
            model: Product,
            as: 'productos',
            where: { id: id },
          },

          
        ],
      });
  
      // Calcular el total de compras y ventas del producto
      const totalCompras = compras.reduce((total, compra) => total + compra.total, 0);
      const totalVentas = ventas.reduce((total, venta) => total + venta.total, 0);
  
      // Obtener otros datos estadísticos del producto si es necesario
  
      res.status(200).json({
        producto,
        compras: compras.length > 0 ? compras : [],
        ventas: ventas.length > 0 ? ventas : [],
        totalCompras,
        totalVentas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener las estadísticas del producto' });
    }
  };
  



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
  getAllQuantityProduct,
  getProductStat,
  crearCargaMasivaProductos,
  obtenerEstadisticasProducto
};
