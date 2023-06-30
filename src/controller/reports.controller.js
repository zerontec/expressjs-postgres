
const {Op} = require('sequelize');
const {InvoiceFactura, Customer} = require('../db');
const moment = require('moment');
const {sequelize} = require('../db');



// const generateDailyReport = async (req, res, next) => {
  

//     const reportDate = moment(req.params.date, 'YYYY-MM-DD'); // Convertir el parámetro en un objeto moment
//     const startDate = reportDate.startOf('day').toDate(); // Obtener la fecha de inicio del día
//     const endDate = reportDate.endOf('day').toDate(); // Obtener la fecha de fin del día
    
//     try {
//       const resp = await InvoiceFactura.findAll({
//         where: {
//           date: { [Op.between]: [startDate, endDate] }
//         }
//       });
  
//       if(!resp || resp.length === 0 ){
//         return res.status(404).json({mesage:"No hay facturas para el día seleccionado"})
//       }
      
//       const total = resp.reduce((acc, curr) => acc + curr.totalPrice, 0); // Sumar los montos de todas las facturas
  
//       res.status(200).json( `Total Ventas de fecha  ${startDate} es Bs${total}`   );
//     } catch(err) {
//       res.status(500).json( err );
//     }
//   }
  
const generateDailyReport = async (req, res, next) => {
  const { startDate, endDate } = req.params;

  try {
    const resp = await InvoiceFactura.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    if (!resp || resp.length === 0) {
      return res.status(404).json({ message: "No hay facturas para el rango de fechas seleccionado" });
    }

    const total = resp.reduce((acc, curr) => acc + parseFloat(curr.amount), 0); // Sumar los montos de todas las facturas

    res.status(200).json({ totalSales: total });
  } catch (err) {
    res.status(500).json(err);
  }
};


  const getClientPurchases = async (req, res, next) => {
    const clientId = req.params.id;
  
    try {
      const totalPurchases = await InvoiceFactura.findAll({
        attributes: [
          'clientId',
          
          [sequelize.fn('sum', sequelize.col('amount')), 'totalPurchases']
        ],
        where: {
          clientId: clientId
        },
        group: ['clientId']
      });
  
      if (totalPurchases.length === 0) {
        return res.status(404).json({ message:  'No hay compras para este cliente', clientId });
      }
  
      res.status(200).json({ 
        clientId: clientId,
        numInvoices: totalPurchases[0].getDataValue('numInvoices'),
        totalPurchases: totalPurchases[0].getDataValue('totalPurchases')
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };
  

  // const getClientTotalPurchases = async (req, res, next) => {
  //   const { customerId } = req.params;
  
  //   try {
  //     const purchases = await InvoiceFactura.findAll({
  //       attributes: ['invoiceDate', 'amount', 'invoiceNumber'], // Selecciona solo los campos invoiceDate y amount
  //       where: {
  //         customerId: customerId, // Reemplaza "clientId" con el nombre correcto de la columna en tu modelo de facturas
  //       },
  //     });
  
  //     if (!purchases || purchases.length === 0) {
  //       return res.status(404).json({ message: 'No se encontraron compras para el cliente especificado' });
  //     }
  
  //     const totalPurchases = purchases.reduce((total, purchase) => total + purchase.amount, 0);
  
  //     res.status(200).json({ purchases, totalPurchases });
  //   } catch (error) {
  //     next(error);
  //   }
  // };


const getClientTotalPurchases = async (req, res, next) => {
  const { id} = req.params;

  try {
    const customer = await Customer.findOne({
      where: {
        id, // Reemplaza "name" con el nombre correcto de la columna que almacena el nombre del cliente
      },
    });

    if (!customer) {
      return res.status(404).json({ message: 'No se encontró el cliente especificado' });
    }

    const purchases = await InvoiceFactura.findAll({
      attributes: ['date', 'amount', 'invoiceNumber'],
      where: {
        customerId: customer.id, // Reemplaza "customerId" con el nombre correcto de la columna en tu modelo de facturas
      },
    });

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: 'No se encontraron compras para el cliente especificado' });
    }

    const totalPurchases = purchases.reduce((total, purchase) => total +parseFloat( purchase.amount), 0);

    res.status(200).json({ purchases, totalPurchases });
  } catch (error) {
    next(error);
  }
};


const getInvoicesByDateRange = async (req, res, next) => {
  const { startDate, endDate } = req.params;

  try {
    const invoices = await InvoiceFactura.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: 'No se encontraron facturas para el rango de fechas especificado' });
    }

    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};


  module.exports = {

    generateDailyReport,
    getClientPurchases,
    getClientTotalPurchases,
    getInvoicesByDateRange

  }