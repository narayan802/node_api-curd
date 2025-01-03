const db = require('../db.config');
const Customer = require('../models/customer');

const jwt = require('jsonwebtoken');
require('dotenv').config();


function authenticatedCheck(req, res) {
    const { email } = req.body;


    Customer.findOne({ where: { email } })
        .then(customer => {
            if (!customer) {
                return res.status(404).send({ message: 'User not found.' });
            }

            const secretKey = process.env.SECRETKEY;
            const token = jwt.sign({ id: customer.id, email: customer.email }, secretKey, { expiresIn: '1h' });
            console.log('Generated Token:', token);

            res.status(200).send({
                message: 'You are Authenticated.',
                token: token,
            });
        })
        .catch(error => {
            res.status(500).send({
                message: 'You are Not Authenticated.',
                error: error.message || error,
            });
        });
}




function createCustomer(req, res) {
    const { name, email, age } = req.body;

    if (!name) {
        return res.status(400).send({
            message: "The 'name' field is required.",
        });
    }


    if (!email) {
        return res.status(400).send({
            message: "The 'email' field is required.",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({
            message: "The 'email' field must contain a valid email address.",
        });
    }


    if (age === undefined || age === null) {
        return res.status(400).send({
            message: "The 'age' field is required.",
        });
    }

    if (isNaN(age) || age <= 0) {
        return res.status(400).send({
            message: "The 'age' field must be a positive number.",
        });
    }

    Customer
        .findOne({ where: { email } })
        .then((existingCustomer) => {
            if (existingCustomer) {
                return res.status(400).send({
                    message: "The provided email already exists in the database.",
                });
            }

            
            const customerModel = { name, email, age };

            return Customer.create(customerModel);
        })
        .then((data) => {
            if (data) {
                res.status(200).send({
                    message: "Customer created successfully.",
                    customer: data,
                });
            }
        })
        .catch((error) => {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).send({
                    message: "The provided email already exists in the database.",
                });
            }
            res.status(500).send({
                message: "An error occurred while processing the request.",
                error: error.message || error,
            });
        });
}

function findAllCustomer(req, res) {
    Customer
        .findAll()
        .then((data) => {
            res.status(200).send({
                message: "Customers retrieved successfully.",
                customers: data,
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "An error occurred while retrieving customers.",
                error: error.message || error,
            });
        });
}

function findCustomerById(req, res) {
    const { id } = req.params;

    Customer
        .findOne({ where: { id } })
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: `Customer with ID ${id} not found.`,
                });
            }
            res.status(200).send({
                message: "Customer retrieved successfully.",
                customer: data,
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "An error occurred while retrieving the customer.",
                error: error.message || error,
            });
        });
}


function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, age, email } = req.body;

    Customer
        .update({ name, age, email }, { where: { id } })
        .then((numUpdated) => {
            if (numUpdated[0] === 0) {
                return res.status(404).send({
                    message: `Customer with ID ${id} not found.`,
                });
            }
            res.status(200).send({
                message: "Customer updated successfully.",
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "An error occurred while updating the customer.",
                error: error.message || error,
            });
        });
}


function deleteCustomer(req, res) {
    const { id } = req.params;

    Customer
        .destroy({ where: { id } })
        .then((numDeleted) => {
            if (numDeleted === 0) {
                return res.status(404).send({
                    message: `Customer with ID ${id} not found.`,
                });
            }
            res.status(200).send({
                message: "Customer deleted successfully.",
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "An error occurred while deleting the customer.",
                error: error.message || error,
            });
        });
}

module.exports = {
    authenticatedCheck,
    createCustomer,
    findAllCustomer,
    findCustomerById,
    updateCustomer,
    deleteCustomer,

};
