const router = require('express').Router();
const userRoutes = require('./users');
const expenseRoutes = require('./expenses');

router.use('/api/user', userRoutes);
router.use('/api/expense', expenseRoutes);


module.exports = router;