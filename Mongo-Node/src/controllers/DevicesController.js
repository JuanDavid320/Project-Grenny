const devicesSchema = require('../models/DevicesM');
const devicesModel = devicesSchema('devices');
const dates_devicesSchema = require('../models/DatesDevicesM');
const details_devicesSchema = require('../models/DetailsDevicesM');
const axios = require('axios');
const controller = {};
controller.post = (req, res) => {
  const devices = devicesModel(req.body);
  devices
    .save()
    .then((data) => {
      console.log(data)
    })
    .catch((error) => res.json({ message: error }));

};

controller.get = (req, res) => {

  devicesModel
    .find()
    .then((data) => {
      res.json(data)
    })
    .catch((error) => res.json({ message: error }));

}
controller.getId = (req, res) => {
  const { id } = req.params;

  dates_devicesSchema.find({ idDevices: id, HardwareName:'GateWay oficina' })
    .then(data => {
      console.log('Documento: ', data);
      const data2 = data
      details_devicesSchema
        .findOne({ "idDevices": id, "HardwareName":'GateWay oficina' })
        .then(data => {

          console.log(data);

          res.render('Info', {
            data: data,
            data2: data2
          });

        }).catch((error) => console.log("no se pudo renderizar" + error));


    })
    .catch(err => {
      console.error('Error al realizar la consulta:', err);
    });

}

module.exports = {
  controller,
  devicesModel
};


// Establece el temporizador para ejecutar la función cada 10 segundos
//const intervaloDeActualizacion = 15 * 60 * 1000;
//setInterval(controller.update, intervaloDeActualizacion);
//const intervaloAgregardatosgrafica =  16 *60 * 1000;
//setInterval(controller.post_date, intervaloAgregardatosgrafica);