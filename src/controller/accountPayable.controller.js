const { AccountPayable, Purchase, Supplier, PagoCompras } = require("../db");

const createAccountsPayable = async (req, res, next) => {
  try {
    const { purchaseId, supplierId, amount, dueDate } = req.body;

    const existingPurchase = await Purchase.findByPk(purchaseId);
    const existingSupplier = await Supplier.findByPk(supplierId);

    if (!existingPurchase || !existingSupplier) {
      return res
        .status(404)
        .json({ message: "Compra o proveedor no encontrado" });
    }

    const newAccountsPayable = await AccountsPayable.create({
      purchaseId,
      supplierId,
      amount,
      dueDate,
      paid: false, // Inicialmente se establece como no pagado
    });

    res.status(200).json(newAccountsPayable);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al crear la cuenta por pagar" });
  }
};

const updateAccountsPayable = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { amount, dueDate, paid } = req.body;

    const accountsPayable = await AccountPayable.findByPk(id);

    if (!accountsPayable) {
      return res
        .status(404)
        .json({ message: "Cuenta por pagar no encontrada" });
    } else {
      accountsPayable.update(req.body);
      res
        .status(201)
        .json({
          message: `cuenta por pagar  con ${id} actualizado con exito `,
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar la cuenta por pagar" });
  }
};

const deleteAccountsPayable = async (req, res, next) => {
  try {
    const id = req.params.id;

    const accountsPayable = await AccountPayable.findByPk(id);

    if (!accountsPayable) {
      return res
        .status(404)
        .json({ message: "Cuenta por pagar no encontrada" });
    }

    await accountsPayable.destroy();

    res
      .status(200)
      .json({ message: "Cuenta por pagar eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al eliminar la cuenta por pagar" });
  }
};

const getAccountsPayable = async (req, res, next) => {
  try {
    const id = req.params.id;

    const accountsPayable = await AccountPayable.findByPk(id, {
      include: [Purchase, Supplier],
    });

    if (!accountsPayable) {
      return res
        .status(404)
        .json({ message: "Cuenta por pagar no encontrada" });
    }

    res.status(200).json(accountsPayable);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener la cuenta por pagar" });
  }
};

const getAllAccountsPayable = async (req, res, next) => {
  try {
    const accountsPayable = await AccountPayable.findAll({
      include: [Purchase, Supplier],
    });
    if (accountsPayable.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay informacion que mostrar " });
    }
    res.status(200).json({ accountsPayable });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener las cuentas por pagar" });
  }
};

// Controlador para crear un nuevo pago de cuenta por pagar
const createPayment = async (req, res, next) => {
  try {
    const { proveedor, montoPagado, fechaPago, compraId } = req.body;

    // Obtener la cuenta por pagar correspondiente a la compra
    const accountPayable = await AccountPayable.findByPk(compraId);

    // Verificar si la cuenta por pagar existe y no ha sido pagada anteriormente
    if (!accountPayable || accountPayable.status === "pagada") {
      return res
        .status(400)
        .json({ message: "La cuenta por pagar no existe o ya ha sido pagada" });
    }
    let abonado = parseFloat(accountPayable.abonos) || 0;
    console.log("accountPayable.abonado", abonado);
    // Calcular el saldo pendiente restando los abonos anteriores
    const montos = parseFloat(accountPayable.amount) || 0;
    console.log("montos", montos);

    let saldosPendientes = parseFloat(accountPayable.saldoPendiente) || 0;

    if (abonado === 0) {
      saldosPendientes = montos - montoPagado;
    } else {
      saldosPendientes -= montoPagado;
    }

    console.log("accountPayable.abonos2", abonado);

    console.log("saldoPendientes1", saldosPendientes);

    console.log("saldoPendiente2", saldosPendientes);

    // saldoPendiente = montos - abonado;
    console.log("saldoPendiente", saldosPendientes);

    if (montoPagado <= saldosPendientes) {
      // Actualizar el saldo de la cuenta por pagar
      abonado += montoPagado;

      // Verificar si el saldo pendiente es igual al monto pagado para marcar la cuenta como pagada
      if (saldosPendientes === montoPagado) {
        accountPayable.status = "pagada";

        // Obtener la lista de compras asociada a la cuenta por pagar
        // const purchase = await Purchase.findOne({
        //   where: { id: accountPayable.purchase.id },
        // });

        // Verificar si la compra existe y no ha sido pagada anteriormente
        // if (purchase && purchase.status !== "pagada") {
        //   // Actualizar el estado de la compra a pagada
        //   purchase.status = "pagada";
        //   await purchase.save();
        // }
      }

      accountPayable.saldoPendiente = saldosPendientes.toFixed(2);

      accountPayable.abonos = abonado.toFixed(2);
      console.log(" accountPayable.abonos3", accountPayable.abonos);
      // Guardar los cambios en la cuenta por pagar
      await accountPayable.save({
        abonos: abonado,
        saldoPendiente: saldosPendientes,
      });

      // Crear el pago en la base de datos
      const payment = await PagoCompras.create({
        proveedor,
        montoPagado,
        fechaPago,

        compraId, // Asignar el ID de la compra al campo de clave externa
      });

      // Respuesta exitosa
      res.status(201).json({ message: "Pago creado exitosamente", payment });
    } else {
      // El monto pagado excede el saldo pendiente
      res
        .status(400)
        .json({
          message:
            "El monto pagado excede el saldo pendiente de la cuenta por pagar",
        });
    }
  } catch (error) {
    // Error al crear el pago
    res
      .status(500)
      .json({ message: "Error al crear el pago de la cuenta por pagar" });
    next(error);
  }
}



const getAllPagoComprasID = async(req, res, next)=> {

try{
  const compraId = req.body

  const pago = await PagoCompras.findAll({
    
    where:compraId



  });

if(!pago){

  return res.status(404).json({message:'No se encontraron pagos con ese Id'})
}

res.status(200).json(pago)




}catch(error){

  res.status(500).json(error)

  next(error)

}



}


module.exports = {
  createAccountsPayable,
  updateAccountsPayable,
  deleteAccountsPayable,
  getAccountsPayable,
  getAllAccountsPayable,
  createPayment,
  getAllPagoComprasID
};
