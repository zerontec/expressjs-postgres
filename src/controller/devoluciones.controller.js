const {
  DevolucionesVentas,
  InvoiceFactura,
  Product,
  ProductoDevuelto,
  Customer,
  NotaCredito,
  ProductosDefectuosos
 
} = require("../db");
const { Sequelize } = require("sequelize");
const { crearNotaCredito } = require("./notaCredito.controller");

// Agregar el método getProductos al modelo InvoiceFactura
InvoiceFactura.prototype.getProductos = async function () {
  const products = await this.getProducts();
  return products;
};

const generarDevolucionNumber = async () => {
  // Obtener el número de devolución más alto actualmente en la base de datos
  const highestDevolucion = await DevolucionesVentas.findOne({
    attributes: [
      [Sequelize.fn("max", Sequelize.col("numeroDevolucion")), "maxDevolucion"],
    ],
  });

  // Obtener el número de devolución más alto o establecerlo en 0 si no hay devoluciones existentes
  const highestDevolucionNumber = highestDevolucion
    ? highestDevolucion.get("maxDevolucion")
    : 0;

  // Incrementar el número de devolución en 1
  const nextDevolucionNumber = highestDevolucionNumber + 1;

  return nextDevolucionNumber;
};
const generarNumeroNota = async () => {
  // Obtener el número de devolución más alto actualmente en la base de datos
  const highestNota = await NotaCredito.findOne({
    attributes: [
      [Sequelize.fn("max", Sequelize.col("numeroNota")), "maxNota"],
    ],
  });

  // Obtener el número de devolución más alto o establecerlo en 0 si no hay Noataes existentes
  const highestNotaNumber = highestNota
    ? highestNota.get("maxNota")
    : 0;

  // Incrementar el número de devolución en 1
  const nextNotaNumber = highestNotaNumber + 1;

  return nextNotaNumber;
};



const crearDevolucion = async (req, res, next) => {
  try {
    const { invoiceNumber, motivo, productos, fechaDevolucion ,id} = req.body;

    // Verificar si la factura existe
    const factura = await InvoiceFactura.findByPk(invoiceNumber, {
      include: {
        model: Product,
        as: "productos",
      },
    });
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    // Verificar si la factura ya tiene una devolución asociada
    // const devolucionExistente = await DevolucionesVentas.findOne({
    //   where: { invoiceNumber },
    // });
    // if (devolucionExistente) {
    //   return res
    //     .status(400)
    //     .json({ message: "Ya se ha creado una devolución para esta factura" });
    // }

    // Actualizar los montos totales de la factura y los productos devueltos
    let totalDevolucion = 0;

    for (const producto of productos) {
      const { id, quantity, defectuoso, barcode } = producto;

      // Verificar si el producto existe en la factura
      let productoFactura = null;

      for (const productoFacturaItem of factura.productoFactura) {
        if (productoFacturaItem.barcode === barcode) {
          productoFactura = productoFacturaItem;
          break;
        }
      }

      if (!productoFactura) {
        return res
          .status(400)
          .json({ message: "El producto no existe en la factura" });
      }

      // Verificar que la cantidad devuelta no supere la cantidad vendida
      if (quantity > productoFactura.quantity) {
        return res
          .status(400)
          .json({
            message: "La cantidad devuelta es mayor a la cantidad vendida",
          });
      }

      // Actualizar la cantidad devuelta del producto
      productoFactura.cantidadDevuelta += quantity;

      // Calcular el monto total de la devolución para el producto
      const montoDevuelto = quantity * productoFactura.price;

      totalDevolucion += montoDevuelto;

      // Obtener el nombre del producto
      const productoItem = await Product.findByPk(id);
      const nombreProducto = productoItem ? productoItem.name : null;

      console.log("nombreProduc", nombreProducto)
      // Guardar los cambios en el producto devuelto
      await ProductoDevuelto.create({
        name: nombreProducto || "",
        productId: id,
        cantidadDevuelta: quantity,
        fechaDevolucion: new Date(),
        invoiceNumber,
        barcode,
      });

      // Si el producto es defectuoso, agregarlo a la tabla ProductosDefectuosos
   /* This code block is checking if the reason for the return is "defective" and if so, it creates a
   new entry in the "ProductosDefectuosos" table with the barcode, quantity returned, return date,
   invoice number, and product name. This is used to keep track of defective products and their
   returns separately from other returns. */
      if (motivo === "defectuoso") {
        await ProductosDefectuosos.create({
          barcode,
          cantidadDevuelta: quantity,
          fechaDevolucion: new Date(),
          invoiceNumber,
          motivo,
          name: nombreProducto || "",
        });
      }
    }

    // Sumar las cantidades devueltas al inventario de Product
    for (const producto of productos) {
      const { id, quantity} = producto;

      const inventory = await Product.findByPk(id);

      if (inventory) {
        inventory.quantity += quantity;
        await inventory.save();
      }
    }

    // Crear la devolución
    const numeroDevolucion = await generarDevolucionNumber();
    const montoDev = totalDevolucion + 0.16;

    const devolucion = await DevolucionesVentas.create({
      numeroDevolucion,
      fechaDevolucion: new Date(),
      motivo,
      invoiceNumber,
      total: montoDev,
      fechaVentaF:factura.createdAt,
      customerData: factura.clienteData,
      clienteId: factura.clienteId,
      productoD: productos, // Aquí asignamos los productos a la columna productoD
    });
    // Guardar los cambios en la factura
    await factura.save();

    const numeroNota = await generarNumeroNota();
    // Crear la nota de crédito
    const notaCredito = await NotaCredito.create({
      numeroNota,
      fecha: new Date(),
      montoDev: montoDev || 0,
      clienteData: factura.clienteData,
      productosDevueltos: JSON.stringify(productos),
      monto: totalDevolucion,
    });

    // Actualizar el estado de la devolución
    devolucion.estado = "Completa";
    await devolucion.save();

    res.status(201).json({ message: "Devolución creada exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al crear la devolución" });
  }
};


const obtenerDevoluciones = async (req, res) => {
  try {
    // Obtiene todas las devoluciones de productos
    const devoluciones = await DevolucionesVentas.find();

    // Calcula la cantidad de productos defectuosos
    const productosDefectuosos = devoluciones.filter(devolucion => devolucion.estado === 'defectuoso').length;

    // Envía la respuesta al front-end, incluyendo la cantidad de productos defectuosos
    res.status(200).json({ devoluciones, productosDefectuosos });
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al obtener las devoluciones' });
  }
};


const obtenerDevolucionesVentas = async (req, res, next) => {
  try {
    const devoluciones = await DevolucionesVentas.findAll({
      // Aquí puedes incluir opciones de consulta, como incluir modelos relacionados
    });
    res.json(devoluciones);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las devoluciones de ventas" });
    next(error);
  }
};

const obtenerDevolucionVenta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const devolucion = await DevolucionesVentas.findByPk(id, {
      include: [
        {
          model: ProductoDevuelto,
          as: "productosDevueltos",
          // include: [Product], // Incluye el modelo de producto
        },
      ],
    });

    if (!devolucion) {
      return res
        .status(404)
        .json({ message: "Devolución de venta no encontrada" });
    }

    res.json(devolucion);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener la devolución de venta" });

    next(error);
  }
};

const editDevolucion =async(req, res, net)=> {

try{

const id = req.params.id
const { motivo, total} = req.body;

const devolucion = await DevolucionesVentas.findByPk(id);
if(devolucion){

    devolucion.update({

motivo:motivo,
total:total

    });

res.status(201).json({messague:"Devolucion edita exitosamente"})


}else res.staus(404).json({messague:"no se encontro devolucion con ese id"})





}catch(err){

    res.status(500).json(err)
    next(err)
}

} 

module.exports = {
  crearDevolucion,
  obtenerDevolucionesVentas,
  obtenerDevolucionVenta,
  editDevolucion
};
