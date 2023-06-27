const {Purchase,DevolucionCompras,NotaDebito ,Product  }= require('../db');

const generarNumeroDevolucion = async () => {
    // Obtener el número de devolución más alto actualmente en la base de datos
    const highestDevolucion = await DevolucionesCompras.findOne({
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
  
const crearDevolucionCompra = async (req, res, next) => {
  try {
    const { purchaseNumber, motivo, productos } = req.body;


    // Verificar si la compra existe
    const compra = await Purchase.findOne({
        where: { purchaseNumber },
      include: {
        model: Product,
        as: 'productos',
      },
    });

    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    // Verificar si la compra ya tiene una devolución asociada
    const devolucionExistente = await DevolucionCompras.findOne({
      where: { numeroFactura },
    });

    if (devolucionExistente) {
      return res
        .status(400)
        .json({ message: 'Ya se ha creado una devolución para esta compra' });
    }

    // Actualizar los montos totales de la compra y los productos devueltos
    let totalDevolucion = 0;

    for (const producto of productos) {
      const { barcode, quantity } = producto;

      // Verificar si el producto existe en la compra
      const productoEnCompra = compra.productos.find(
        (prod) => prod.barcode === barcode
      );

      if (!productoEnCompra) {
        return res
          .status(400)
          .json({ message: 'El producto no existe en la compra' });
      }

      // Verificar que la cantidad devuelta no supere la cantidad comprada
      if (quantity > productoEnCompra.quantity) {
        return res.status(400).json({
          message: 'La cantidad devuelta es mayor a la cantidad comprada',
        });
      }

      // Actualizar la cantidad devuelta del producto en la compra
      productoEnCompra.cantidadDevuelta += quantity;

      // Calcular el monto total de la devolución para el producto
      const montoDevuelto = quantity * productoEnCompra.precio;

      totalDevolucion += montoDevuelto;
    }

    // Actualizar el monto total de la compra
    compra.montoTotal -= totalDevolucion;
    await compra.save();

    // Crear la devolución en compra
    const numeroDevolucion = await generarNumeroDevolucion();
    const devolucionCompra = await DevolucionCompra.create({
      numeroDevolucion,
      fechaDevolucion: new Date(),
      motivo,
      numeroFactura,
      total: totalDevolucion,
    });

    // Actualizar la cantidad de productos devueltos en la tabla Product
    for (const producto of productos) {
      const { barcode, quantity } = producto;

      const productoEnTabla = await Product.findOne({
        where: { barcode },
      });

      if (productoEnTabla) {
        productoEnTabla.quantity -= quantity;
        await productoEnTabla.save();
      }
    }

    // Crear la nota de débito
    const numeroNotaDebito = await generarNumeroNotaDebito();
    const notaDebito = await NotaDebito.create({
      numeroNotaDebito,
      fechaEmision: new Date(),
      motivo,
      total: totalDevolucion,
      numeroDevolucion,
    });

    res.status(201).json({ message: 'Devolución en compra creada exitosamente' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ocurrió un error al crear la devolución en compra' });
  }
};

module.exports = {
  crearDevolucionCompra,
};
