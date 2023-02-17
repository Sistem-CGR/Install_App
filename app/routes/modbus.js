const express = require('express')
const app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const dotenv = require('dotenv')
dotenv.config()

// Conexión a la BD
const { connection } = require('../config.db');


// create a tcp modbus client
const Modbus = require('jsmodbus')
const net = require('net');

const socket = new net.Socket()
const client = new Modbus.client.TCP(socket)
const options = {
    'host' : '192.168.1.50',
    'port' : 502
}

// Iniciamos la conexión con el plc
socket.connect(options);


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|   FUNCIONES DE LA API (lECTURA DE REGISTROS   /   LECTURA DE REGISTROS    /   ENCEDER BOBINAS /   APAGAR BOBINAS  /   ALMACENAR INFORMACION EN LA BASE DE DATOS)      |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Fubnción pare lectura de bobinas
let readCoils = ( req, res ) => {
    const { start, end } = req.body
    client.readCoils(start, end).then(result => {
        let Bobinas = result.response._body._valuesAsArray
        res.status(200).json(Bobinas)
    }, console.error);
}


// Fubnción pare lectura de bobinas
let readHoldingRegisters = ( req, res ) => {
    const { start, end } = req.body
    client.readHoldingRegisters(start, end).then(result => {
        let Bobinas = result.response._body._valuesAsArray
        res.status(200).json(Bobinas)
    }, console.error);
}

// Función para encedido de bobinas
let coilON = (req, res) => {
    const id = req.body.id == undefined ? req.params.id : req.body.id;

    client.writeSingleCoil(id, true).then(result => {
        res.status(200).json(result.response._body)
    }).catch( () => {
      console.error(arguments)
    })
}

// Función para apagado de bobinas
let coilOFF = (req, res) => {
    const id = req.body.id == undefined ? req.params.id : req.body.id;

    client.writeSingleCoil(id, false).then(result => {
        res.status(200).json(result.response._body)
    }).catch( () => {
      console.error(arguments)
    })
}


// Función para escritura de bobinas
let writeSingleRegister = (req, res) => {
    const { id, value } = req.body

    client.writeSingleRegister(id, value).then(result => {
        res.status(200).json(result.response._body)
    }).catch( () => {
      console.error(arguments)
    })
}



// Consultas a la base de datos
/*
let data = (req, res) => {
    connection.query("SELECT * FROM test",
        ( err, result ) => {
            if(err)
                throw err
            res.status(200).json(result)
        })
}
*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|                                                                 PETICIONES A LA API POR METODO GET Y POST                                                             |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

app.get('/', (req, res) => { res.json({ mensaje: 'Api jsmodbus metodo GET :)' })})
app.post('/', (req, res) => {res.json({ mensaje: 'Api jsmodbus metodo POST :)' })})

// base de datos
    //app.get('/data', data)
   // app.post('/data', data)

// LECTURA DE BOBINAS
    app.post('/readCoils', readCoils)   // Parametros { start, end }

// LECTURA DE REGISTROS
    app.post('/readRegisters', readHoldingRegisters)    // Parametros { start, end }

// ESCRITURA DE REGISTROS
    app.post('/writeRegister', writeSingleRegister)    // Parametros { id, value }

// ENCEDIDO DE BOBINAS
    app.get('/coilon/:id', coilON)
    app.post('/coilon', coilON) // Parametros { id }

// APAGADO DE BOBINAS
    app.get('/coiloff/:id', coilOFF)
    app.post('/coiloff', coilOFF)    // Parametros { id }
    

module.exports = app