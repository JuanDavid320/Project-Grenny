const express= require("express");
const router = express.Router();
const DevicesControllerC =require('../controllers/DevicesControllerC')

//list devices
router.get('/get',DevicesControllerC.controller.get)
router.get('/devices_Info/:id',DevicesControllerC.controller.getId)
module.exports=router