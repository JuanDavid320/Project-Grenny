
const DevicesControllerC = require('../controllers/DevicesControllerC')
const DevicesController = require('../controllers/DevicesController')
const dates_devicesSchema = require('../models/DatesDevicesM');
const details_devicesSchema = require('../models/DetailsDevicesM');
const axios = require('axios');
const controller = {};

// Función para realizar una solicitud y llevar al Front-End
function fetchData(url, schema, res) {
  try {
    axios.get(url)
      .then(response => {

        const data = response.data
        res.render(schema, {
          data: data,

        });

      })

  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}
// Ruta que maneja la solicitud

controller.post_date = (req, res) => {
  let url = ''

  const mode = req.params.id
  if (mode == 1) {
    url = 'http://localhost:9000/apiC/get';

  }
  if (mode == 2) {
    url = 'http://localhost:9000/api/get';
  }

  let savedDataArray;

  axios.get(url)
    .then(response => {

      const responseDataArray = response.data;
      const savedPromises = responseDataArray.map(obj => {
        const key2 = obj.Data;
        const numericPart = key2.replace(/[^\d.]/g, '');
        const numericValue = parseFloat(numericPart);
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        const dates_devices = new dates_devicesSchema({
          idDevices: obj.idDevices,
          HardwareName: obj.HardwareName,
          Data: 0,
          DataT: numericValue,
          Date: hoy.toUTCString()
        });
        return dates_devices;
      });

      savedDataArray = savedPromises; // Asignar el valor a savedDataArray
      return Promise.all(savedPromises);
    })
    .then(savedDataArray => {
      console.log("saved data" + savedDataArray);

      // Obtener los últimos registros de cada idDevices en dates_devices
      const latestRecordsPromises = savedDataArray.map(savedData => {
        return dates_devicesSchema.findOne({ idDevices: savedData.idDevices, HardwareName: savedData.HardwareName })
          .sort({ _id: -1 })
          .exec();
      });

      return Promise.all(latestRecordsPromises);
    })
    .then(latestRecordsArray => {
      console.log("ultima data" + latestRecordsArray);
      const resultsJSON = [];
      // Realizar la resta entre Data de la URL y los últimos registros
      for (let i = 0; i < savedDataArray.length; i++) {
        const urlData = savedDataArray[i].DataT;  // Aquí asegúrate de que 'savedDataArray[i]' existe y tiene la propiedad 'Data'
        const latestRecordData = latestRecordsArray[i] ? latestRecordsArray[i].DataT : urlData;
        const resta = urlData - latestRecordData;
        resultsJSON.push({
          idDevices: savedDataArray[i].idDevices,
          HardwareName: savedDataArray[i].HardwareName,
          Data: resta,
          DataT: urlData,
          Date: savedDataArray[i].Date
        })
      }
      const resultsJSONString = JSON.stringify(resultsJSON);
      dates_devicesSchema.insertMany(resultsJSON);
      // Puedes guardar o enviar resultsJSONString según tus necesidades
      console.log(resultsJSONString);
      console.log("Operaciones realizadas exitosamente");
    })
    .catch(error => console.log("Hubo un error: " + error));
};


controller.render = (req, res) => {
  const idrender = req.params.id


  try {
    if (idrender == 1) {
      fetchData('http://localhost:9000/api/get', 'Devices', res);


    }
    if (idrender == 2) {
      fetchData('http://localhost:9000/apiC/get', 'DevicesC', res);

    }
    if (idrender == 3) {

      fetchData('http://localhost:9000/apiM/get', 'DevicesM', res);

    }
    if (idrender == 4) {

      axios.get('http://localhost:9000/api/get')
        .then(response => {
          const data1 = response.data
          axios.get('http://localhost:9000/apiC/get')

            .then(response => {
              const data2 = response.data
              axios.get('http://localhost:9000/apiM/get')
              .then(response => {
                const dataM = response.data
              res.render('DevicesAll', {
                data1: data1,
                data2: data2,
                dataM: dataM
              })
              });
            })
        })
    }

  } catch (error) {
    // Maneja cualquier error que pueda ocurrir al obtener los datos
    console.error('Error general:', error);
    res.status(500).send('Error interno del servidor');
  }
};
// funcion para traer los datos de las api externas- domoticz
controller.getApi = (req, res) => {
  let gateway = ''
  const mode = req.params.id
  if (mode == 1) {
    gateway = 'GateWay oficina'
  }
  if (mode == 2) {
    gateway = 'Alcanos-Concha'

  }
  console.log(gateway)
  const url = `http://integrasoft:Integrasoft@172.16.16.104:8080/json.htm?type=command&param=getdevices`;


  // Realizar la solicitud HTTP
  axios.get(url, {

  })
    .then(response => {

      const responseData = response.data;

      //responseData como objeto antes de enviarlo como JSON
      if (typeof responseData !== 'object') {
        res.status(500).send('Error: El formato de respuesta no es un objeto JSON válido.');
      }
      const filteredData = responseData.result.filter(item => {
        return item.Name && item.HardwareName.includes(gateway) && item.Name && item.Name.includes(req.body.ID);
      })

      const uniqueData = filteredData.filter((item, index, array) => {
        return array.findIndex(otherItem => otherItem.Name === item.Name) === index;
      })

      var order = uniqueData.sort(function (a, b) {
        if (a.Name[5] != ' ') {
          if (a.Name[5] - 1 < b.Name[5] - 1) {
            return -1;

          }
        }
        if (a.Name[6] != ' ') {
          if (a.Name[6] - 1 < b.Name[6] - 1) {
            return -1;

          }

        }
        if (a.Name[7] != ' ') {
          if (a.Name[7] - 1 < b.Name[7] - 1) {
            return -1;

          }
        }

      });


      // Ordenar el arreglo en función del número extraído de "Name"


      if (order && order.length > 0) {

        const dataToSend = order.reduce((accumulator, currentItem, index) => {
          if (index === 0) {
            accumulator.push({
              idDevices: req.body.ID,
              idx: currentItem.idx,
              Name: currentItem.Name,
              BatteryLevel: currentItem.BatteryLevel,
              HardwareName: currentItem.HardwareName,
              Data: currentItem.Data
            })
          } else {
            accumulator.push({
              Data: currentItem.Data,
              Name: currentItem.Name
            });
          }
          return accumulator;
        }, [])


        // Enviar el objeto JSON resultante como respuesta
        // res.status(200).json(dataToSend);
        // Enviar el objeto JSON resultante como respuesta


        if (dataToSend && dataToSend.length > 0) {
          const DataDetails = {
            idDevices: req.body.ID,
            HardwareName: dataToSend[0].HardwareName,
            DataConfig: getDataProperty(dataToSend, 1),

            DataBattery: getDataProperty(dataToSend, 2),

            DataRSSI_LEVEL: getDataProperty(dataToSend, 3),

            DataAlarm: getDataProperty(dataToSend, 4),

            DataPerfil: getDataProperty(dataToSend, 5),

            DataTime: getDataProperty(dataToSend, 6),
          };

          function getDataProperty(dataArray, index) {
            if (dataArray[index]) {
              return [dataArray[index].Data || '-', dataArray[index].Name || '-'];
            } else {
              return ['-', '-'];
            }
          }

          console.log(DataDetails)
          if (mode == 1) {
            const setDevices = DevicesController.devicesModel.create(dataToSend[0]);
            const SetDetailsDevices = details_devicesSchema.create(DataDetails);
            res.redirect('/1');
          }
          if (mode == 2) {
            const setDevices = DevicesControllerC.devicesModel.create(dataToSend[0]);
            const SetDetailsDevices = details_devicesSchema.create(DataDetails);
            res.redirect('/2');
          }
          // Enviar los datos guardados como respuesta


        } else {
          res.status(500).send('No se encontró el campo "result" en la respuesta JSON.');
        }
      } else {
        // Si no hay datos después del filtrado, puedes enviar un mensaje o manejarlo según tus necesidades
        res.status(404).send('No se encontraron datos que cumplan con la condición de filtrado.');
      }


    })
    .catch(error => {
      console.error('Error en la solicitud de login:', error.message);
      res.status(500).send(`Error en la solicitud de login: ${error.message}`);
    });


}



controller.delate = (req, res) => {
  const { id } = req.params;
  const { gate } = req.params;
  const { web } = req.params;
  if (gate == 1) {
    DevicesController.devicesModel
      .deleteOne({ idDevices: id })
      .then((data) => {
        console.log(data)
      })
    details_devicesSchema
      .deleteOne({ idDevices: id, HardwareName: 'GateWay oficina' })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => res.json({ message: error }));
    if (web == 1) {
      res.redirect('/4');
    }
    if (web == 2) {
      res.redirect('/1');
    }
  } if (gate == 2) {
    DevicesControllerC.devicesModel
      .deleteOne({ idDevices: id })
      .then((data) => {
        console.log(data)
      })
    details_devicesSchema
      .deleteOne({ idDevices: id, HardwareName: 'Alcanos-Concha' })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => res.json({ message: error }));
    if (web == 1) {
      res.redirect('/4');
    }
    if (web == 2) {
      res.redirect('/2');
    }
  }

}





controller.update = (req, res) => {

  let url = '';
  let mode = req.params.id;

  if (mode == 1) {

    url = 'http://localhost:9000/apiC/get'
  }
  if (mode == 2) {
    url = 'http://localhost:9000/api/get'
  }

  axios.get(url)
    .then(response => {
      if (Array.isArray(response.data)) {
        const idxArray = response.data.map(obj => obj.idx);
        const baseUrl = 'http://integrasoft:Integrasoft@172.16.16.104:8080/json.htm?type=devices&rid='

        // Utiliza Promise.all para manejar múltiples solicitudes en paralelo
        const updatePromises = idxArray.map(async (idx) => {
          const apiUrl = `${baseUrl}${idx}`;

          try {
            // Realiza la solicitud a la API externa
            const apiResponse = await axios.get(apiUrl);

            if (apiResponse.status === 200) {
              const result = apiResponse.data.result;
              const idDevices=tomarId(result[0].Name);
               console.log(idDevices)
              if (result && result.length > 0) {
                const dataToSend = result.map(item => ({  
                  idDevices: idDevices,
                  idx: item.idx,
                  Name: item.Name,
                  BatteryLevel: item.BatteryLevel,
                  HardwareName: item.HardwareName,
                  Data: item.Data
                }));
                // Encuentra el documento existente por idx y actualíza
                if (mode == 1) {
                  const updateResult = await DevicesControllerC.devicesModel.updateMany({ idx: idx }, { $set: { ...dataToSend[0] } });
                  console.log(`Actualizado para idx ${idx}`, updateResult);
                }
                if (mode == 2) {
                  const updateResult = await DevicesController.devicesModel.updateMany({ idx: idx }, { $set: { ...dataToSend[0] } });
                  console.log(`Actualizado para idx ${idx}`, updateResult);
                }
              } else {
                console.error(`No se encontró el campo "result" para idx ${idx}`);
              }
            } else {
              console.error(`Error en la solicitud a la API externa para idx ${idx}. Estado: ${apiResponse.status}`);
            }
          } catch (error) {
            console.error(`Error en la solicitud para idx ${idx}:`, error.message);
          }
        });

        // Espera a que todas las actualizaciones se completen antes de redirigir
        Promise.all(updatePromises)
          .then(() => {
            console.log('Todas las actualizaciones completadas');



          })
          .catch((error) => {
            console.error('Error al actualizar documentos:', error);
            res.status(500).send(`Error al actualizar documentos: ${error.message}`);
          });
      } else {
        res.status(500).send('La respuesta no es un arreglo de objetos.');
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud a la ruta local:', error);
      res.status(500).send(`Error en la solicitud a la ruta local: ${error.message}`);
    });

}

// Definir la función que realiza la petición
const automatic = async () => {
  try {
    // Realizar la petición a /devicesU/1
    const urls = [
      'http://localhost:9000/devicesU/1',
      'http://localhost:9000/devicesU/2',
      // Agrega más URLs según sea necesario
    ];

    // Realiza múltiples peticiones en paralelo con Promise.all
    const responses = await Promise.all(urls.map(url => axios.get(url)));

  } catch (error) {
    console.error('Error en la petición:', error.message);
  }
};
const automatic2 = async () => {
  try {
    // Realizar la petición a /devicesU/2
    const urls = [
      'http://localhost:9000/postData/1',
      'http://localhost:9000/postData/2',
      // Agrega más URLs según sea necesario
    ];

    // Realiza múltiples peticiones en paralelo con Promise.all
    const responses = await Promise.all(urls.map(url => axios.get(url)));

  } catch (error) {
    // Manejar errores en la petición
    console.error('Error en la petición:', error.message);
  }
};


function tomarId(Name){

// Utilizar expresión regular para extraer el número
const matchResult = Name.match(/\b\d+\b/);

// Verificar si se encontró un número en la cadena
if (matchResult) {
  // Extraer el número encontrado
  const idDevices = matchResult[0];
  return idDevices
} else {
  console.log("No se encontró ningún número en la cadena.");
}

} 


// Establecer el intervalo de tiempo en milisegundos (por ejemplo, cada 5 segundos)
const intervaloDeTiempo =  15*60* 1000;
// Configurar setInterval para realizar la petición cada cierto tiempo
setInterval(automatic, intervaloDeTiempo);

// Establecer el intervalo de tiempo en milisegundos (por ejemplo, cada 5 segundos)
const intervaloDeTiempo2 = 16 * 60 * 1000;
// Configurar setInterval para realizar la petición cada cierto tiempo
setInterval(automatic2, intervaloDeTiempo2);
module.exports = controller;

// Establece el temporizador para ejecutar la función cada 10 segundos

