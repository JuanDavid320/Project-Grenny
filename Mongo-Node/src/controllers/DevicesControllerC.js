const devicesSchema = require('../models/DevicesM');
const dates_devicesSchema = require('../models/DatesDevicesM');
const devicesModel = devicesSchema('devicesCO');
const details_devicesSchema = require('../models/DetailsDevicesM');
const controller = {};

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
  
    dates_devicesSchema.find({ idDevices: id, HardwareName:'Alcanos-Concha'  })
      .then(data => {
        console.log('Documento: ', );
        const data2 = data
        details_devicesSchema
          .findOne({ "idDevices": id, "HardwareName":'Alcanos-Concha' })
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