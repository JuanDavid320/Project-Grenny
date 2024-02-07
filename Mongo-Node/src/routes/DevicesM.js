const express= require("express");
const DevicesController =require('../controllers/DevicesControllerM')
const router = express.Router();


router.get('/get',DevicesController.controller.get)
router.get('/get/:id',DevicesController.controller.getId)

function EventoMensaje(topic,message){
  console.log(message.toString())
    if(message){
       DevicesController.post(message.toString())
        .then((result) => {
          console.log(result); 
          console.log('Datos del dispositivo agragados a la base de datos ')
        })
        .catch((error) => {
            console.log('Hubo un error al momento de guardar los datos ')
          console.error(error);
        });
    
    
    }
    
    //client.end()
 }


 module.exports = {
    EventoMensaje,
    router
  };