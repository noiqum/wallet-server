const router = require('express').Router();
const expenseController = require('../controllers/expenses.controller');
const authMiddleware = require('../middleware/authMiddleware')
router.route('/').post(authMiddleware, expenseController.save)
router.route('/:id').get(expenseController.findById)
router.route('/list').post(authMiddleware, expenseController.find)
router.route('/delete/:id').post(authMiddleware, expenseController.delete)
router.route('/update/:id').post(authMiddleware, expenseController.update)

module.exports = router;