const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

function EventoConectar(){
    client.subscribe('integrasoft/uplink',function (err){
     if(err){
        console.log('Error al conectar '+ err)
    }

    })
}
 function EventoMensaje(topic,message){
    console.log(topic+" - "+ message.toString())
   // client.end()
 }

 client.on('connect',EventoConectar)
 client.on('message', EventoMensaje)