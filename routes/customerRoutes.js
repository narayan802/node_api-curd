const express = require('express');
const customerController = require('../controllers/customerController'); 
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/authcheck', customerController.authenticatedCheck);

router.use(verifyToken);

router.post('/createcustomer', customerController.createCustomer);
router.get('/customers', customerController.findAllCustomer);
router.get('/customers/:id', customerController.findCustomerById);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;
