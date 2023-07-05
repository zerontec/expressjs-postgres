const {
  DailySales,
  inventory,
  Invoice,
  Customer,
  Seller,
  InvoiceFactura,
  Store,
  InvoiceProduct,
  AccountsReceivable,
  Product
} = require("../db");
const { Op } = require("sequelize");
const { generatePdf } = require("../until/pdfgenerator");

async function generateInvoiceNumber() {
  // Obtener el número de factura más alto actualmente en la base de datos
  const highestInvoice = await InvoiceFactura.findOne({
    order: [["invoiceNumber", "DESC"]],
  });

  // Obtener el número de factura más alto o establecerlo en 0 si no hay facturas existentes
  const highestInvoiceNumber = highestInvoice
    ? parseInt(highestInvoice.invoiceNumber.substr(4))
    : 0;

  // Incrementar el número de factura en 1
  const nextInvoiceNumber = (highestInvoiceNumber + 1)
    .toString()
    .padStart(6, "0");

  // Construir el número de factura con el prefijo
  const formattedInvoiceNumber = `INV-${nextInvoiceNumber}`;

  return formattedInvoiceNumber;
}

const createInvoiceFactura = async (req, res, next) => {
  try {
    const {metodoPago, quantity, customer, seller, productos, credit, dueDate, paymentMethod } = req.body;

    // Verificar si el vendedor existe
    const vendedor = await Seller.findOne({
      where: { codigo: seller.codigo },
    });
    if (!vendedor) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }

    // Verificar si el cliente existe
    let cliente = await Customer.findOne({
      where: { identification: customer.identification },
    });
    if (!cliente) {

      
      const newClient = await Customer.create({

          name: customer.name,
          identification: customer.identification,
          address:customer.address

      })

      cliente=newClient;


      // return res.status(404).json({ message: "Cliente no encontrado Agregar" });
    }

    const invoiceNumber = await generateInvoiceNumber();

    let subtotal = 0;
    let Iva = 0;

    // Verificar y descargar los productos de la tienda
    const productFactura = [];
for (const producto of productos) {
  const { barcode, quantity} = producto;

  // Verificar si el producto existe en el inventario
  const inventory = await Product.findOne({
    where: { barcode },
  });

  if (!inventory || inventory.quantity < quantity) {
    return res
      .status(400)
      .json({ message: "Cantidad insuficiente de producto en la tienda" });
  }

  const { price } = inventory;

  // Actualizar la cantidad disponible del producto en la tienda
  inventory.quantity -= quantity;
  await inventory.save();

  const subtotalProducto = producto.price * producto.quantity // Calcular el subtotal del producto por cantidad
  console.log("aqui subTotalProduct", subtotalProducto)
  subtotal += subtotalProducto;
  console.log("subTotaaaaal", subtotal)

  const uniSinIva = producto.price /1.16
  const totalProductosSInIva = subtotal/1.16
  console.log("totalProductosSInIva", totalProductosSInIva)

 const sinIva = subtotalProducto/1.16
 console.log("sinIva", sinIva)
 const ivaR = sinIva - subtotal


    productFactura.push({
    name: producto.name,
    quantity: producto.quantity,
    price: producto.price,
    barcode: producto.barcode,
    id: producto.id,
    
    preProductoUndSinIva:uniSinIva,  
    
   
   
    
  });
}
// const ivaRate = 1.16;
// const iva = subtotal / ivaRate; // Calcular el IVA

// console.log("aqui iva",iva)
const totalPoducSinIva = subtotal / 1.16
console.log("totalPoducSinIva",totalPoducSinIva)
// const parTotalProductoSinIva=parseInt(totalPoducSinIva)

const resultSubB = totalPoducSinIva
const ivaProductosTotal = subtotal - totalPoducSinIva

console.log("resultSubB , ivaProductosTotal",resultSubB, ivaProductosTotal )
const iva = 1.16
console.log("Iva ",iva)
const TotalF  =+ resultSubB *  iva

console.log("TotalF ",TotalF )



    const totalPrice = TotalF
    let amount = totalPrice;


    let resEstatus ="";
    if(credit){
      resEstatus ="Pendiente por cobrar"

    }else resEstatus = "cobrada"

    const metodoPagoArray = Array.isArray(metodoPago) ? metodoPago : [];

    const invoiceFactura = await InvoiceFactura.create({
      date: new Date(),
      invoiceNumber,
      sellerId: vendedor.id,
      clienteId: cliente.identification ,

      credit,
      issueDate: null,
      dueDate, 
      status:resEstatus,
      // paymentMethod,
      metodoPago:metodoPagoArray,
      notes: "",
      amount:totalPrice,
      totalProductosSinIva:parseFloat(totalPoducSinIva),
      ivaTotal:parseFloat(ivaProductosTotal),
      quantity,
      customerId:cliente.id,
      clienteData: {
        name: cliente.name,
        identification: cliente.identification,
        address: cliente.address,
      },
      vendedorData: {
        codigo: vendedor.codigo,
      },
      productoFactura: productFactura,
    });

    // Crear una cuenta por cobrar si la venta es a crédito
    if (credit) {
      const accountsDueDate = dueDate; // Asignar la fecha de vencimiento adecuada
      const paymentMethod = null; // Asignar el método de pago adecuado
      const notes = null; // Agregar notas adicionales si es necesario

      const accountsReceivable = await AccountsReceivable.create({
        dueDate: accountsDueDate,
        status: "Pendiente",
        paymentMethod,
        notes,
        clienteDataC: {
          name: cliente.name,
          identification: cliente.identification,
          address: cliente.address,
        },
        vendedorDataC: {
          codigo: vendedor.codigo,
        },
        montoCobrar: amount,
      });

      // Asociar la cuenta por cobrar con la factura
      invoiceFactura.setAccountsReceivable(accountsReceivable);
    }

    // Actualizar el monto de las ventas diarias
    const date = new Date().toISOString().slice(0, 10);
    let dailySales = await DailySales.findOne({ where: { date } });
    if (!dailySales) {
      dailySales = await DailySales.create({ date, amount: 0 }); // Inicializar el monto en cero si no existe
    }
    dailySales.amount += totalPrice; // Sumar el totalPrice al monto existente en dailySales
    await dailySales.save();
    console.log("dayliSales",dailySales);



    await invoiceFactura.save();

    const response = {
      invoiceNumber,
      invoiceDate: invoiceFactura.invoiceDate,
      credit: false,
      issueDate: null,
      dueDate,
      status: "Pendiente",
      metodoPago,
      notes: "",
      subtotal:totalPoducSinIva,
      iva:ivaProductosTotal,
      amount,
      cliente: {
        name: cliente.name,
        identification: cliente.identification,
        address: cliente.address,
      },
      vendedor: {
        codigo: vendedor.codigo,
        name: vendedor.name,
        identification: vendedor.identification,
      },
      productos: productos.map((item) => ({
        barcode: item.barcode,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        id: item.id,
        iva:iva
      })),
    };

    await generatePdf(response);
    console.log(generatePdf);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al crear la factura de ventas" });
  }
};

const getAllInvoice = async (req, res, next) => {
  try {
    const invoices = await InvoiceFactura.findAll();
    if (invoices.length === 0) {
      return res.status(404), json({ message: "No Hay facturas quemostrar " });
    } else res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

const getInvoiceDetails = async (req, res, next) => {
  try {
    const invoiceNumber = req.params.id;

    // Obtener la factura y sus detalles a partir del ID proporcionado
    const invoice = await InvoiceFactura.findByPk(invoiceNumber, {
      include: [
        { model: Customer, as: "customer" },
        { model: Seller, as: "seller" },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ocurrió un error al obtener los detalles de la factura",
    });
  }
};

// Buscar facturas por fecha
const searchInvoicesByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    // Realizar la búsqueda de facturas por fecha en la base de datos
    const invoices = await InvoiceFactura.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        { model: Customer, as: "customer" },
        { model: Seller, as: "seller" },
      ],
    });
    if (!invoices.length) {
      return res
        .status(404)
        .json({ message: "no se encontraron facturas para esta fecha" });
    }

    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al buscar las facturas por fecha" });
  }
};




const searchInvoiceByQuery = async (req, res, next) => {
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




module.exports = {
  getInvoiceDetails,
  searchInvoicesByDate,
  getAllInvoice,
  searchInvoiceByQuery,
  createInvoiceFactura,
};
