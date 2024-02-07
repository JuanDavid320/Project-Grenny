const express= require('express');
const path= require('path');
const mongoose = require('mongoose');

//conector a mqtt
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

require('dotenv').config();
const devicesRoutes= require('./routes/Devices');
const devicesRoutesM= require('./routes/DevicesM');
const devicesRoutesC = require('./routes/DevicesC')
const dataGeneralRoutes= require('./routes/GenealData');
const app= express();

//config
const port=process.env.PORT || 9000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
//middeware
app.use(express.json());
app.use(express.urlencoded({extended: false}))
//routes
app.use('/api',devicesRoutes);
app.use('/apiM',devicesRoutesM.router);
app.use('/apiC',devicesRoutesC);
app.use('/',dataGeneralRoutes);
//static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//mongo db connection

mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("conectado a mongoDB Atlas"))
.catch((error)=> console.error(error, 'lo siento :('))

app.listen(port, ()=>console.log('server listening on port',port))
 
//sub mqqt 
function EventoConectar(){
    client.subscribe('integrasoft/uplink',function (err){
     if(err){
        console.log('Error al conectar '+ err)
    }else{
        console.log('suscribe mqtt')
    }

    })
}

 client.on('connect',EventoConectar)
 client.on('message', devicesRoutesM.EventoMensaje)