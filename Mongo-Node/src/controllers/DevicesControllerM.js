const { response } = require('express');
const devicesShemaM = require('../models/DevicesM_M');
const dates_devicesSchema = require('../models/DatesDevicesM');
const axios = require('axios');
const controller = {};

controller.get = (req, res) => {
  devicesShemaM
    .find()
    .then((data) => {
      res.json(data)
    })
    .catch((error) => res.json({ message: error }));
}

controller.getId = (req, res) => {
  const { id } = req.params;

  dates_devicesSchema.find({ idDevices: id, HardwareName:'Milesight'  })
    .then(data => {
      console.log('Documento: ', );
      const data2 = data
          console.log(data);

          res.render('InfoM', {
            data2: data2
          });

      


    })
    .catch(err => {
      console.error('Error al realizar la consulta:', err);
    });

}
function post(req) {
  const response = req;

  return new Promise((resolve, reject) => {

    const jsonObject = JSON.parse(response);
    const keysArray = Object.keys(jsonObject);
    
    if (keysArray.length == 3) {
      
      try {
        const datasend = {
          idDevices: 1,
          Data1: [keysArray[0], jsonObject.battery],
          Data2: [keysArray[1], jsonObject.daylight],
          Data3: [keysArray[2], jsonObject.pir],
          Data4: ['-', 0]
        };
        axios.get('http://localhost:9000/apiM/get')
          .then( async response => {
            
            const data = response.data
            if(data && data.length > 0 && data[0]!==undefined && data[1]!==undefined ){
           const updateresult= await devicesShemaM.updateOne({ idDevices: datasend.idDevices }, { $set: datasend });
            
             const tiempoTranscurrido = Date.now();
             const hoy = new Date(tiempoTranscurrido);
             const nuevaInstancia = new dates_devicesSchema({
              idDevices: datasend.idDevices,
              HardwareName: 'Milesight',
              Data: datasend.daylight,
              DataT: datasend.pir,
              Date: hoy.toUTCString()
          });
          nuevaInstancia.save() 
             console.log('Documento actualizado y data almacenada');
             resolve(true);
            }else{
              const devices = devicesShemaM(datasend);
              devices
              .save()
              .then((data) => {
                console.log(data);
                resolve(true); // Resuelve la promesa con true si la operación es exitosa
              })
              .catch((error) => {
                console.error(error);
                reject(false); // Rechaza la promesa con false si hay un error
              });

            }
                 
          }).catch((error) => {
            console.error(error);
            reject(false); // Rechaza la promesa con false si hay un error

            
          });
        } catch (error) {
          console.error('Error al convertir el JSON:', error);
          reject(false); // Rechaza la promesa con false si hay un error al analizar el JSON
        }
          
    }

    console.log("no se pudo el primero")
    if (keysArray.length == 4) {
      try {
        const datasend = {
          idDevices: 2,
          Data1: [keysArray[0], jsonObject.battery],
          Data2: [keysArray[1], jsonObject.humidity],
          Data3: [keysArray[3], jsonObject.temperature],
          Data4: [keysArray[2], jsonObject.pulse]
        };

        axios.get('http://localhost:9000/apiM/get')
          .then( async response => {
            const data = response.data
            if(data && data.length > 0 && data[0]!==undefined && data[1]!==undefined){
           const updateresult= await devicesShemaM.updateOne({ idDevices: datasend.idDevices }, { $set: datasend });
            
             const tiempoTranscurrido = Date.now();
             const hoy = new Date(tiempoTranscurrido);
             const nuevaInstancia = new dates_devicesSchema({
              idDevices: datasend.idDevices,
              HardwareName: 'Milesight',
              Data: datasend.Data3[1],
              DataT:datasend.Data2[1],
              Date: hoy.toUTCString()
          });
          console.log(nuevaInstancia)
          nuevaInstancia.save() 
           
        
        console.log('Documento actualizado y data almacenada');
             resolve(true);
            }else{
              const devices = devicesShemaM(datasend);
              devices
              .save()
              .then((data) => {
                console.log(data);
                resolve(true); // Resuelve la promesa con true si la operación es exitosa
              })
              .catch((error) => {
                console.error(error);
                reject(false); // Rechaza la promesa con false si hay un error
              });

            }
                 
          }).catch((error) => {
            console.error(error);
            reject(false); // Rechaza la promesa con false si hay un error
          });
        
      } catch (error) {
        console.error('Error al convertir el JSON:', error);
        reject(false); // Rechaza la promesa con false si hay un error al analizar el JSON
      }
    }
  });

}





module.exports = {
  controller,
  post
};