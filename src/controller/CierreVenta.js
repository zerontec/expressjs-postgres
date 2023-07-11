const {InvoiceFactura, Payment} = require('../db')
const{Op}=require('sequelize')


const getDailySalesReport = async (req, res, next) => {
    try {
      // Obtener la fecha actual
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0];
  
      // Obtener todas las facturas emitidas en el día actual
      const invoices = await InvoiceFactura.findAll({
        where: {
          createdAt: {
            [Op.gte]: currentDateString,
          },
        },
        // include: [
        //   {
        //     model: Payment,
        //   },
        // ],
      });
  
      // Calcular el total de ventas y los totales por método de pago
      let totalSales = 0;
      const paymentTotals = {};
  
      invoices.forEach(invoice => {
        // Obtener el monto total de la factura
        const invoiceTotal = invoice.total;
  
        // Incrementar el total de ventas
        totalSales += invoiceTotal;
  
        // Obtener los métodos de pago asociados a la factura
        const payments = InvoiceFactura.metodoPago;
  
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
  
      res.status(200).json(salesReport);
    } catch (error) {
      res.status(500).json({ message: 'Error al generar el informe de cierre de ventas diarias' });
      next(error);
    }
  };

  

  module.exports = {


    getDailySalesReport


  }