
const {Invoice, AccountPayable, Purchase, Supplier, Product, Inventory} =require('../db');



const createPurchase = async (req, res, next) => {
  try {
    // Obtener los datos de la compra desde el cuerpo de la solicitud
    const {
      purchaseNumber,
      rif,
      products,
      invoiceNumber,
      status,
      
      
    
     
    } = req.body;
    console.log("Rif", rif)
    // Verificar si el proveedor existe
    const supplier = await Supplier.findOne({where:{

      rif:rif

    }});
    if (!supplier) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }





    const duplicateInvoiceNumber = await Purchase.findOne({
      where: { invoiceNumber: invoiceNumber },
    });
    if (duplicateInvoiceNumber) {
      return res
        .status(409)
        .json({ mesage: "Este Numero de factura ya Existe" });
    }

    const duplicatePurchaseNumber = await Purchase.findOne({
      where: {
        purchaseNumber: purchaseNumber,
      },
    });
    if (duplicatePurchaseNumber) {
      return res
        .status(409)
        .json({ messague: "El Numero de Compra ya Existe" });
    }

    let totalAmount = 0;

  

    // Crear la compra en la base de datos con el totalAmount calculado
    const newPurchase = await Purchase.create({
      purchaseNumber,
      totalAmount,
      invoiceNumber,
      status,
      supplierRif:rif,
      supplierName: supplier.name,
      supplierAddress: supplier.address,
      supplierPhone: supplier.phone,
      productDetails: JSON.stringify(products), // Convertir el array de objetos a JSON
    });


    // Crear una lista para almacenar los productos asociados a la compra
const newProducts = [];
    // Recorrer los productos de la compra
    for (const productData of products) {
      const { name, id, cantidad, price, barcode, description, costo} = productData;

      // Verificar si el producto existe en la tabla de inventario
      const existingProduct = await Product.findOne({
        where: {
          barcode,
        },
      });

      if (existingProduct) {
        // Actualizar la cantidad y el precio del producto existente en el inventario
        existingProduct.quantity += cantidad;
        existingProduct.price = price;
        await existingProduct.save();
      } else {
       // Crear el producto en la tabla de inventario y asociarlo a la compra
    const createdProduct = await Product.create({
      purchaseId: newPurchase.id,
      quantity:cantidad,
      price,
      barcode,
      description,
      costo,
      name
    });
    newProducts.push(createdProduct);
  }
  await newPurchase.setProducts(newProducts);
      // Verificar si el producto existe en la tabla de productos
      // const existingProductInProductTable = await Product.findByPk(id);

      // if (existingProductInProductTable) {
      //   // Actualizar la cantidad y el precio del producto existente en la tabla de productos
      //   existingProductInProductTable.quantity += quantity;
      //   existingProductInProductTable.price = price;
      //   await existingProductInProductTable.save();
      // } else {
      //   // Crear el producto en la tabla de productos
      //   await Product.create({
      //     id,
      //     name,
      //     quantity,
      //     price,
      //     barcode,
      //     description,
      //   });
      // }
    }

    // Calcular el totalAmount sumando los subtotales de los productos
     for (const productData of products) {
      const { costo,cantidad} = productData;
      const subtotal = costo * cantidad;
      totalAmount += subtotal;
    }
    

    // Actualizar el total de la compra en la base de datos
    newPurchase.totalAmount = totalAmount;
    await newPurchase.save();

    // Resto del código...

   
    // Crear la cuenta por pagar asociada a la compra y al proveedor
    
    if(newPurchase.status === "Por Pagar"){
    const newAccountsPayable = await AccountPayable.create({
      amount: totalAmount,
      supplierRif: supplier.rif,
      supplierName: supplier.name,
      supplierAddress: supplier.address,
      status:"Por Pagar",
      invoiceN:invoiceNumber
    });


        // Asociar la cuenta por pagar a la compra y al proveedor
        await newAccountsPayable.setPurchase(newPurchase);
        await newAccountsPayable.setSupplier(supplier);
    
        // Crear la factura asociada a la compra y al proveedor
        const newInvoice = await Invoice.create({
          invoiceNumber: invoiceNumber,
          amount: totalAmount,
         
          status
         
        });
    
        // Asociar la factura a la compra y al proveedor
        await newInvoice.setPurchase(newPurchase);
        await newInvoice.setSupplier(supplier);
    
  }


    




    res.status(200).json(newPurchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al crear la compra" });
  }
};



const findAllPurchase = async(req, res, next) => {

  try{

const purchase = await Purchase.findAll();
if(purchase.length === 0){

  return res.status(400).json({messague:"No se encontraron compras registradas"});


} else res.status(201).json(purchase)




  }catch(err){

    res.status(500).json(err)
  }


}


const detailPurchase = async(req, res, next)=> {

try{

const id = req.params.id;

    const purchase = await Purchase.findByPk(id);
    if(!purchase){

      return res.status(404).json({messague:"no exite compra con id " `${id}`})
    }

    res.status(201).json(purchase)
 

}catch(err){

  res.status(500).json(err)
  next(err)

}


}


const deletepurchase = async (req, res, next) => {
  let id = req.params.id;
  try {
    const purchase = await Purchase.findByPk(id);
    if (purchase) {
      await purchase.destroy();
      res.status(200).json({ message: "Cliente borrado con exito" });
    } else {
      res.status(400).json({ message: "No se encontro cliente con ID " });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};



const updatePurchase = async(req, res, next)=>{

try{

  const id = req.params.id

  const purchase = await Purchase.findByPk(id);
  if(!purchase){

    return res.status(404).json({messague:'no se encontro compra con id ' `${id}`})
  }else 
await purchase.update(req.body);
res.status(201).json({messague:'Compra actualizada correctamente '})




}catch(err){


  res.status(500).json(err)
  next(err)

}



}



const searchPurchaseByQuery = async (req, res, next) => {
  console.log("Buscando Invoices...");
  const { q } = req.query;

  try {
    const invoices = await InvoiceFactura.findAll({
      where: {
        [Op.or]: [
          {
            invoiceNumber: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            clienteData: {
              [Op.iLike]: `%${q}%`,
            },
          },
        ],
      },
    });
    console.log("Consulta SQL generada:", invoices.toString()); // Nueva línea de código
    console.log("Aqui el log", invoices);
    console.log("q:", invoices.toString()); // Verificar la consulta
    if (analysis.length === 0) {
      console.log("No se encontraron análisis.");
      return res.status(404).json({ message: "No se Encontro Analysis" });
    }

    res.status(200).json(analysis);
    console.log(analysis);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json(err);
    next(err);
  }
};



module.exports={

createPurchase,
findAllPurchase,
detailPurchase,
updatePurchase,
deletepurchase

}