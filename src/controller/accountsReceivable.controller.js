
const {Customer, AccountsReceivable, InvoiceFactura} = require('../db')

const createAccountsReceivable = async (req, res, next) => {
    try {
      const {clientData,status,notes,    amount, dueDate } = req.body;
  
      // const existingSale = await Sale.findByPk(saleId);
      const existingCustomer = await Customer.findByPk(customerId);
  
      if ( !existingCustomer) {
        return res.status(404).json({ message: ' cliente no encontrado' });
      }
  
      const newAccountsReceivable = await AccountsReceivable.create({
        clientData,
        status,
        notes,
        amount,
        dueDate,
        paid: false, // Inicialmente se establece como no pagado
      });
  
      res.status(200).json(newAccountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al crear la cuenta por cobrar' });
    }
  };
  
  const updateAccountsReceivable = async (req, res, next) => {
    try {
      const id= req.params.id;
      const { amount, dueDate, paid } = req.body;
  
      const accountsReceivable = await AccountsReceivable.findByPk(id);
  
      if (!accountsReceivable) {
        return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
      }
      else {
        accountsReceivable.update(req.body);
        res
          .status(201)
          .json({ message: `cuenta por Cobrar  con ${id} actualizado con exito ` });
      }
      // accountsReceivable.amount = amount;
      // accountsReceivable.dueDate = dueDate;
      // accountsReceivable.paid = paid;
  
      // await accountsReceivable.save();
  
      // res.status(200).json(accountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al actualizar la cuenta por cobrar' });
    }
  };
  
  const deleteAccountsReceivable = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const accountsReceivable = await AccountsReceivable.findByPk(id);
  
      if (!accountsReceivable) {
        return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
      }
  
      await accountsReceivable.destroy();
  
      res.status(200).json({ message: 'Cuenta por cobrar eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al eliminar la cuenta por cobrar' });
    }
  };
  
  const getAccountsReceivable = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const accountsReceivable = await AccountsReceivable.findByPk(id, {
        include: [InvoiceFactura, Customer],
      });
  
      if (!accountsReceivable) {
        return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
      }
  
      res.status(200).json(accountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener la cuenta por cobrar' });
    }
  };
  
  const getAllAccountsReceivable = async (req, res, next) => {
    try {
      const accountsReceivable = await AccountsReceivable.findAll({
        include: [InvoiceFactura, Customer],
      });
  
      res.status(200).json(accountsReceivable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener las cuentas por cobrar' });
    }
  };
  
  module.exports = {
    createAccountsReceivable,
    updateAccountsReceivable,
    deleteAccountsReceivable,
    getAccountsReceivable,
    getAllAccountsReceivable,
  };
  