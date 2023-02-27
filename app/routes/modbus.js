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
const clientPLC = new Modbus.client.TCP(socket)
const options = {
    'host' : '192.168.1.50',
    'port' : 502
}

// Iniciamos la conexión con el plc
socket.connect(options);




const mqtt = require('mqtt')
const mqttURL = 'ws://192.168.2.83:8083/mqtt'
//const mqttURL = 'ws://www.sistemaintegralrios.com/mqtt'

const clientMQTT  = mqtt.connect(mqttURL)

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|                                                                               MQTT BROQUER                                                                            |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

clientMQTT.on('connect', function () {
    // Subscribe to a topic
    setInterval(() => {
        clientMQTT.subscribe('/tst/#', function (err) {
            if (!err) {
                // Publish a message to a topic
                clientPLC.readCoils(6, 8).then(result => {
                    let Bobinas = result.response._body._valuesAsArray
                    let arr = {
                        "Inicio"    : Bobinas[0],
                        "Arranque"  : Bobinas[1],
                        "Paro"  : Bobinas[2],
                        "Iniciado"  : Bobinas[0] == 0 ? false : true,
                        "Paro de emergencia"  : Bobinas[4] ==  0 ? 'OFF' : 'ON',
                        "Fallo de fase"  : Bobinas[5] ==  0 ? 'OFF' : 'ON',
                    }
                    clientMQTT.publish('/tst/Bobinas', JSON.stringify(arr))
                    //clientMQTT.publish('/tst/Bobinas', JSON.stringify(Bobinas))
                }, console.error);

                // Publish a message to a topic
                clientPLC.readHoldingRegisters(0, 16).then(result => {
                    let Registros = result.response._body._values
                    let arr = {
                        "Hora"  : Registros[2] + ':'+Registros[1]+':'+Registros[0],
                        "Fehca" : Registros[5] + '/'+Registros[4]+'/'+Registros[3],
                        "V12"   : Registros[6],
                        "V23"   : Registros[7],
                        "V31"   : Registros[8],
                        "Flujo"   : Registros[9],
                        "Presión"   : Registros[10],
                        "Frecuencia"   : Registros[11],
                        "Nivel dinamico"   : Registros[12],
                        "I1"   : Registros[13],
                        "I2"   : Registros[14],
                        "I3"   : Registros[15]
                    }
                    clientMQTT.publish('/tst/Registros', JSON.stringify(arr))
                    //clientMQTT.publish('/tst/Registros', JSON.stringify(Registros))
                }, console.error);
            }
          })
    }, 1000);
})

// Receive messages
clientMQTT.on('message', function (topic, message) {
    if (topic.includes('/tst/coilon') || topic.includes('/tst/coiloff')){
        id = parseInt(message)
        if (id != isNaN) {
            switch (topic){
                // Encendemos la bobina
                case '/tst/coilon': clientPLC.writeSingleCoil(id, true); break;
                // Apagamos la bobina
                case '/tst/coiloff': clientPLC.writeSingleCoil(id, false); break;
            }
        }
    }
})




/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|   FUNCIONES DE LA API (lECTURA DE REGISTROS   /   LECTURA DE REGISTROS    /   ENCEDER BOBINAS /   APAGAR BOBINAS  /   ALMACENAR INFORMACION EN LA BASE DE DATOS)      |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Fubnción pare lectura de bobinas
let readCoils = ( req, res ) => {
    const { start, end } = req.body
    clientPLC.readCoils(start, end).then(result => {
        let Bobinas = result.response._body._valuesAsArray
        res.status(200).json(Bobinas)
    }, console.error);
}

// Fubnción pare lectura de bobinas
let readHoldingRegisters = ( req, res ) => {
    const { start, end } = req.body
    clientPLC.readHoldingRegisters(start, end).then(result => {
        let Registros = result.response._body._valuesAsArray
        res.status(200).json(Registros)
    }, console.error);
}

// Función para encedido de bobinas
let coilON = (req, res) => {
    const id = req.body.id == undefined ? req.params.id : req.body.id;

    clientPLC.writeSingleCoil(id, true).then(result => {
        res.status(200).json(result.response._body)
    }).catch( () => {
      console.error(arguments)
    })
}

// Función para apagado de bobinas
let coilOFF = (req, res) => {
    const id = req.body.id == undefined ? req.params.id : req.body.id;

    clientPLC.writeSingleCoil(id, false).then(result => {
        res.status(200).json(result.response._body)
    }).catch( () => {
      console.error(arguments)
    })
}


// Función para escritura de bobinas
let writeSingleRegister = (req, res) => {
    const { id, value } = req.body

    clientPLC.writeSingleRegister(id, value).then(result => {
        res.status(200).json(result.response._body)
    }).catch( () => {
      console.error(arguments)
    })
}

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


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|                                                                            CONSULTAS A LA BD                                                                          |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
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

module.exports = app