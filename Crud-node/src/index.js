const express = require('express');
const path = require('path');
const morgan= require('morgan');
const mysql= require('mysql');

const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');

// ...

// Agrega este middleware antes de tus rutas.

const app = express();

//importando rutas
const usuarioRoutes= require('./routes/customer');
const adminRoutes= require('./routes/admin');

//configuracion
app.set('port',process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//middleweres 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(myConnection(mysql,{
host:'localhost',
user:'root',
password:'',
port: 3306,
database: 'clientes'
},'single'));
app.use(express.urlencoded({extended: false}))

//routes
app.use('/',usuarioRoutes)
app.use('/',adminRoutes)

//archivos estaticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// forma de iniciar el servidor 
app.listen(app.get('port'),()=>{
    console.log('server on port 3000');
});
