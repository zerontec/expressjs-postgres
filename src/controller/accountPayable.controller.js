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

    const abonos = parseFloat(accountPayable.abonos) || 0;
    let saldoPendientes = parseFloat(accountPayable.saldoPendiente) || 0;
    const montoTotal = parseFloat(accountPayable.amount) || 0;

    // Verificar si el monto pagado es válido
    if (montoPagado <= 0) {
      return res.status(400).json({ message: "El monto pagado debe ser mayor a cero" });
    }

    // Verificar si el monto pagado excede el saldo pendiente
    if (montoPagado > accountPayable.amount  && montoPagado !== saldoPendientes) {
      return res.status(400).json({ message: "El monto pagado excede el saldo pendiente de la cuenta por pagar" });
    }

    let nuevoSaldoPendiente=0;
    // Calcular el nuevo saldo pendiente y los nuevos abonos
    const nuevoAbono = abonos + montoPagado;
    console.log("nuevoAbono ",nuevoAbono )
      if(saldoPendientes=== 0){
         nuevoSaldoPendiente= accountPayable.amount-montoPagado

      }else{

         nuevoSaldoPendiente = saldoPendientes - montoPagado;
      }
      

   
    console.log("nuevoSaldoPendiente ",nuevoSaldoPendiente)
    // Actualizar el saldo pendiente y los abonos en la cuenta por pagar
    accountPayable.abonos = nuevoAbono.toFixed(2);
    accountPayable.saldoPendiente = nuevoSaldoPendiente.toFixed(2);
    await accountPayable.save();

    // Verificar si la cuenta por pagar ha sido totalmente pagada
    if (nuevoSaldoPendiente === 0) {
      accountPayable.status = "pagada";
      await accountPayable.save();
    }

    // Crear el pago en la base de datos
    const payment = await PagoCompras.create({
      proveedor,
      montoPagado,
      fechaPago,
      compraId, // Asignar el ID de la compra al campo de clave externa
    });

    // Respuesta exitosa
    res.status(201).json({ message: "Pago creado exitosamente", payment });
  } catch (error) {
    // Error al crear el pago
    res.status(500).json({ message: "Error al crear el pago de la cuenta por pagar" });
    next(error);
  }
};





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
