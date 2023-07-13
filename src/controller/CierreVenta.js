const {InvoiceFactura, SalesClosure} = require('../db')
const{Op}=require('sequelize')


const getDailySalesReport = async (req, res, next) => {
    try {
      // Obtener la fecha actual
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0];
  
 // Verificar si ya existe un registro para la fecha actual
 const existingReport = await SalesClosure.findOne({ where: { date: currentDateString } });

 if (existingReport) {
   // Si ya existe un reporte para la fecha actual, enviar un mensaje informando que ya existe
   return res.status(409).json({ message: 'El reporte de cierre de ventas ya existe para la fecha actual' });
 }

      // Obtener todas las facturas emitidas en el día actual
      const invoices = await InvoiceFactura.findAll({
        where: {
          createdAt: {
            [Op.gte]: currentDateString,
          },
        },
      });
  
      // Calcular el total de ventas y los totales por método de pago
      let totalSales = 0;
      const paymentTotals = {};
  
      invoices.forEach(invoice => {
        // Obtener el monto total de la factura
        const invoiceTotal = parseFloat(invoice.amount);
  
        // Incrementar el total de ventas
        totalSales += invoiceTotal;
  
        // Obtener los métodos de pago asociados a la factura
        const payments = invoice.metodoPago;
  
        payments.forEach(payment => {
          // Obtener el método de pago y el monto
          const paymentMethod = payment.method;
          const paymentAmount = payment.amount;
  
          // Agregar el monto al total correspondiente
          if (!paymentTotals[paymentMethod]) {
            paymentTotals[paymentMethod] = paymentAmount;
          } else {
            paymentTotals[paymentMethod] += paymentAmount;
          }
        });
      });
  
      // Generar el informe de cierre de ventas
      const salesReport = {
        date: currentDateString,
        totalSales,
        paymentTotals,
      };

 // Guardar el registro del cierre de ventas en la base de datos
 const salesClosure = new SalesClosure({
    date: currentDateString,
    totalSales: totalSales.toFixed(2),
    paymentTotals: JSON.stringify(paymentTotals), // Convertir a formato JSON antes de guardar en la base de datos
  });

  await salesClosure.save();
  
      res.status(200).json(salesReport);
    } catch (error) {
      res.status(500).json({ message: 'Error al generar el informe de cierre de ventas diarias' });
      next(error);
    }
  };




const getAllClosure =async(req, res, next)=> {

try{

    const sales = await SalesClosure.findAll()
    if(!sales){

        return res.status(400).json({message:'no hay informacion que mostrar'})

    }

    res.status(200).json(sales)


}catch(error){

    res.status(500),json(error)

}


}


  
  module.exports = {


    getDailySalesReport,
    getAllClosure


  }