const {AccountPayable, Purchase,Supplier } = require ('../db')

const createAccountsPayable = async (req, res, next) => {
    try {
      const { purchaseId, supplierId, amount, dueDate } = req.body;
  
      const existingPurchase = await Purchase.findByPk(purchaseId);
      const existingSupplier = await Supplier.findByPk(supplierId);
  
      if (!existingPurchase || !existingSupplier) {
        return res.status(404).json({ message: 'Compra o proveedor no encontrado' });
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
      res.status(500).json({ message: 'Ocurrió un error al crear la cuenta por pagar' });
    }
  };
  


  const updateAccountsPayable = async (req, res, next) => {
    try {
      const id= req.params.id;
      const { amount, dueDate, paid } = req.body;
  
      const accountsPayable = await AccountPayable.findByPk(id);
  
      if (!accountsPayable) {
        return res.status(404).json({ message: 'Cuenta por pagar no encontrada' });
      }
  
      else {
        accountsPayable.update(req.body);
        res
          .status(201)
          .json({ message: `cuenta por pagar  con ${id} actualizado con exito ` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al actualizar la cuenta por pagar' });
    }
  };
  
  const deleteAccountsPayable = async (req, res, next) => {
    try {
      const  id = req.params.id;
  
      const accountsPayable = await AccountPayable.findByPk(id);
  
      if (!accountsPayable) {
        return res.status(404).json({ message: 'Cuenta por pagar no encontrada' });
      }
  
      await accountsPayable.destroy();
  
      res.status(200).json({ message: 'Cuenta por pagar eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al eliminar la cuenta por pagar' });
    }
  };
  
  const getAccountsPayable = async (req, res, next) => {
    try {
      const id= req.params.id;
  
      const accountsPayable = await AccountPayable.findByPk(id, {
        include: [Purchase, Supplier],
      });
  
      if (!accountsPayable) {
        return res.status(404).json({ message: 'Cuenta por pagar no encontrada' });
      }
  
      res.status(200).json(accountsPayable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener la cuenta por pagar' });
    }
  };
  
  const getAllAccountsPayable = async (req, res, next) => {
    try {
      const accountsPayable = await AccountPayable.findAll({
        include: [Purchase, Supplier],
      });
  
      res.status(200).json(accountsPayable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al obtener las cuentas por pagar' });
    }
  };
  
  module.exports = {
    createAccountsPayable,
    updateAccountsPayable,
    deleteAccountsPayable,
    getAccountsPayable,
    getAllAccountsPayable,
  };
  