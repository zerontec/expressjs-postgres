const {Router}= require('express');
const { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } = require('../controller/expense.controller');

const router =Router();



router.get('/get-all', getExpenses);
router.get('/get-expense/:id', getExpenseById);
router.post('/create', createExpense);
router.put('/update/:id', updateExpense);
router.delete('/delete/:id', deleteExpense);







module.exports = router;
