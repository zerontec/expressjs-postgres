const {Loan, Seller} = require('../db');

// const createLoan = async (req, res, next) => {
//   try {
//     const { codigoSeller, amount, notes } = req.body;

//     const loan = await Loan.create({
//       codigoSeller,
//       amount,
//       notes,
//       status: 'pendiente' // Estado inicial del préstamo
//     });

//     res.status(201).json(loan);
//   } catch (error) {
//     res.status(500).json({ message: 'Error al crear el préstamo' });
//   next(error)
// }
// };
const createLoan = async (req, res, next) => {
    try {
      const { codigoSeller, amount, notes } = req.body;
  
      // Verificar si el vendedor existe
      const seller = await Seller.findOne({
        where: { codigo: codigoSeller },
      });
      if (!seller) {
        return res.status(404).json({ message: "Vendedor no encontrado" });
      }
  
      // Crear la deuda para el vendedor
      const debt = await Loan.create({
        sellerId: seller.id, // Utilizamos el ID del vendedor para relacionar la deuda
        amount,
        notes,
        status:'pendiente'
      });
  
      res.status(201).json(debt);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la deuda", error });
      next(error);
    }
  };
  

const getAllLoan = async (req, res, next) => {
    try {
      
        const loans = await Loan.findAll({
            where: {
              status: 'pendiente', // Filtrar solo las deudas pendientes
            },
            include: [{ model: Seller }],
          });
          
      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los préstamos del vendedor' });
    }
  };

const getLoansBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const loans = await Loan.findAll({
      where: { sellerId }
    });

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los préstamos del vendedor' });
  }
};

const updateLoanStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status,  notes, amount } = req.body;
  
      const loan = await Loan.findByPk(id)
  
      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }
  
      loan.status = status;
      loan.notes = notes
      loan.amount=amount
  
      // Actualizar el monto solo si se proporciona en el cuerpo de la solicitud
      if (amount !== undefined) {
        loan.amount = amount;
      }
  
      await loan.save();
  
      // Obtener la suma total de las deudas del vendedor
      const sellerId = loan.sellerId;
      const totalDebt = await Loan.sum('amount', {
        where: {
          sellerId,
          status: 'pendiente'
        }
      });
  
      res.status(200).json({ loan, totalDebt });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado del préstamo' });
   next(error)
    
    }
  };
  

const deleteLoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    await loan.destroy();

    res.status(200).json({ message: 'Préstamo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el préstamo' });
  }
};

// Backend - Controlador para obtener la deuda y los datos del vendedor
const getSellerDebt = async (req, res, next) => {
    try {
      const { sellerId } = req.params;
  
      // Consultar la deuda del vendedor utilizando el ID y obtener los datos del vendedor
      const seller = await Seller.findByPk(
        
        sellerId);
      const debt = await Loan.sum('amount', {
        where: {
         sellerId,
          status: "pendiente", // Filtrar solo las deudas pendientes
        }
      });
  
      res.json({ seller, debt });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la deuda y los datos del vendedor', error });
    next(error)
    }
  };
  

module.exports = {
  createLoan,
  getLoansBySeller,
  updateLoanStatus,
  deleteLoan,
  getAllLoan,
  getSellerDebt
};
