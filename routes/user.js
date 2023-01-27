var express = require('express');
var router = express.Router();
var userServices = require('../services/userService');
var appLogger = require('../logging/appLogger');
const { response } = require('express');

//routes

router.get('/getuserDetails', async function (req, res) {
    try {
        let response = await userServices.getAllUserDetails(req.body);
        appLogger.info("User details Retrived Successfully")
        res.send(response);
    } catch (error) {
        appLogger.error({ err: error }, "Error while saving user details");
        res.status(500).send({ error: error.name, message: error.message });
    }
});

router.post('/adduser', async function (req, res) {
    try {
        let response = await userServices.addUser(req.body);
        appLogger.info("User Details Successfully Added")
        res.send(response);
    } catch (error) {
        appLogger.error({ err: error }, "Error while adding user details");
        res.status(500).send({ error: error.name, message: error.message });
    }
});

router.put('/:id', async function (req, res) {
    try {
        let response = await userServices.update(req.body._id,req.body);
        appLogger.info("User details Updated Successfully");
        res.send(response);
    } catch (error) {
        appLogger.error({ err: error }, "Error while Updating user details");
        res.status(500).send({ error: error.name, message: error.message });
    }
});
 
router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id
        let response = await userServices.remove(id);
        appLogger.info("User details Deleting Successfully");
        res.send(response);
    } catch (error) {
        appLogger.error({ err: error }, "Error while Updating user details");
        res.status(500).send({ error: error.name, message: error.message });
    }
});


module.exports = router;