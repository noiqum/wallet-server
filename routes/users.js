const router = require('express').Router();
const userController = require('../controllers/user.controller');


router.route('/').post(userController.save)
router.route('/:id').get(userController.get)
router.route('/login').post(userController.login)
router.route('/logout').get(userController.logout)
router.route('/verify').post(userController.check)
router.route('/bill').post(userController.addBill)

module.exports = router;