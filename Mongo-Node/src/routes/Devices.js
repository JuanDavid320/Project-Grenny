const express= require("express");
const router = express.Router();
const DevicesController =require('../controllers/DevicesController')


// create devices 
router.post('/devices',DevicesController.controller.post)

//list devices
router.get('/get',DevicesController.controller.get)

//list details_devices

 //get a devices
 router.get('/devices_Info/:id',DevicesController.controller.getId)







module.exports=router