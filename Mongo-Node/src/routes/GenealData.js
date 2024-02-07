const express= require("express");
const router = express.Router();
const DataGenController =require('../controllers/DataGenController')

//renderizar view
router.get('/:id',DataGenController.render)


//update devices 
router.get('/devicesU/:id',DataGenController.update)

//prueba
router.get('/postData/:id', DataGenController.post_date)


//get info API
router.post('/getApiData/:id', DataGenController.getApi)

//delate user 
router.get('/devicesD/:id/:gate/:web',DataGenController.delate)

module.exports=router


