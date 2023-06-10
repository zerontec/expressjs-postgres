const {
  DevolucionesVentas,
  InvoiceFactura,
  Product,
  ProductoDevuelto,
  Store,
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

const crearDevolucion = async (req, res, next) => {
  try {
    const { invoiceNumber, motivo, productos } = req.body;

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
    const devolucionExistente = await DevolucionesVentas.findOne({
      where: { invoiceNumber },
    });
    if (devolucionExistente) {
      return res
        .status(400)
        .json({ message: "Ya se ha creado una devolución para esta factura" });
    }

    // Actualizar los montos totales de la factura y los productos devueltos
    let totalDevolucion = 0;

    for (const producto of productos) {
      const { barcode, cantidad } = producto;

      // Verificar si el producto existe en la factura
      // Verificar si el producto existe en la factura
      let productoDevuelto = null;

      for (const producto of factura.productoFactura) {
        if (producto.barcode === barcode) {
          productoDevuelto = producto;
          break;
        }
      }

      if (!productoDevuelto) {
        return res
          .status(400)
          .json({ message: "El producto no existe en la factura" });
      }

      // Verificar que la cantidad devuelta no supere la cantidad vendida
      if (cantidad > productoDevuelto.quantity) {
        return res
          .status(400)
          .json({
            message: "La cantidad devuelta es mayor a la cantidad vendida",
          });
      }

      // Actualizar la cantidad devuelta del producto
      productoDevuelto.cantidadDevuelta += cantidad;

      // Calcular el monto total de la devolución para el producto
      const montoDevuelto = cantidad * productoDevuelto.price;

      console.log("aqui montoDevuelto", montoDevuelto);

      totalDevolucion += montoDevuelto;

      // Actualizar el monto total de la factura
      factura.montoTotal -= montoDevuelto;

      // Guardar los cambios en el producto devuelto
      await ProductoDevuelto.create({
        barcode,
        cantidadDevuelta: cantidad,
      });
    }
    const productosDevueltos = [];
    const productoDevueltosA = [];

    for (const producto of productos) {
      const { barcode, cantidad } = producto;

      // Buscar el producto en la factura
      const productoEnFactura = factura.productoFactura.find(
        (prod) => prod.barcode === barcode
      );

      if (productoEnFactura) {
        const productoDevuelto = await ProductoDevuelto.create({
          // Guardar los campos correspondientes al producto devuelto
          // Puedes ajustar esto según tu modelo ProductoDevuelto
          barcode: productoEnFactura.barcode,
          cantidadDevuelta: cantidad,
          // Otros campos necesarios
        });

        productosDevueltos.push(productoDevuelto);
        productoDevueltosA.push(
          productoEnFactura.barcode,
          productoEnFactura.name
        );
      }
    }

    // Sumar las cantidades devueltas al inventario de Store
    for (const productoDevuelto of productosDevueltos) {
      const { barcode, cantidadDevuelta } = productoDevuelto;

      const inventory = await Store.findOne({
        where: { barcode: barcode },
      });

      if (inventory) {
        inventory.quantity += cantidadDevuelta;
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
      productoD: productoDevueltosA,
    });

    // Guardar los cambios en la factura
    await factura.save();

    const dataclient = factura.clienteData;

    console.log("aqui montoDev", montoDev);
    console.log("aqui totalDevolucion", totalDevolucion);

    await crearNotaCredito(numeroDevolucion, new Date(), montoDev, dataclient);

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
