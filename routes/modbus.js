const express = require("express");
const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const dotenv = require("dotenv");
dotenv.config();

// Conexión a la BD
//const { connection } = require('../config.db');

// create a tcp modbus client
const Modbus = require("jsmodbus");
const net = require("net");

const socket = new net.Socket();
const clientPLC = new Modbus.client.TCP(socket);
const options = { host: "192.168.1.50", port: 502 };
// Iniciamos la conexión con el plc
socket.connect(options);

socket.on("error", (err) => console.log(err));

const mqtt = require("mqtt");
//const mqttURL = "ws://192.168.2.83:8083/mqtt";
const mqttURL = "ws://www.sistemaintegralrios.com:8083/mqtt";
const Client_Id =
  "Raspberry_" + Math.floor(Math.random() * (10000 - 1 + 1) + 1);

const clientMQTT = mqtt.connect(mqttURL, {
  clientId: Client_Id,
  clean: true,
  connectTimeout: 4000,
  username: "Raspberry",
  password: "Silver2670",
  reconnectPeriod: 1000,
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|                                                                               MQTT BROQUER                                                                            |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

clientMQTT.on("connect", function () {
  // Subscribe to a topic
  setInterval(() => {
    let status = socket.resume()._readableState.destroyed;
    status ? socket.connect(options) : "";
    clientMQTT.subscribe("Raspberry_STS/#", function (err) {
      if (!err) {
        // Publish a message to a topic
        clientPLC
          .readCoils(6, 8)
          .then((result) => {
            let Bobinas = result.response._body._valuesAsArray;
            let arr = {
              Inicio: Bobinas[0],
              Arranque: Bobinas[1],
              Paro: Bobinas[2],
              Iniciado: Bobinas[0] == 0 ? false : true,
              "Paro de emergencia": Bobinas[4] == 0 ? "OFF" : "ON",
              "Fallo de fase": Bobinas[5] == 0 ? "OFF" : "ON",
            };
            console.log("Envio de datos");
            clientMQTT.publish(
              "Raspberry_STS/Bobinas/Valores",
              JSON.stringify(arr)
            );
          })
          .catch(function () {
            console.log("Error al enviar datos");
            console.error(
              "clientMQTT readCoils " +
                require("util").inspect(arguments, { depth: null })
            );
            clientMQTT.publish("Raspberry_STS/PLC/OFFLINE", "OFFLINE");
          });

        // Publish a message to a topic
        clientPLC
          .readHoldingRegisters(0, 16)
          .then((result) => {
            let Registros = result.response._body._values;
            let arr = {
              Hora: Registros[2] + ":" + Registros[1] + ":" + Registros[0],
              Fecha: Registros[5] + "/" + Registros[4] + "/" + Registros[3],
              V12: Registros[6],
              V23: Registros[7],
              V31: Registros[8],
              Flujo: Registros[9],
              Presión: Registros[10],
              Frecuencia: Registros[11],
              Nivel_dinamico: Registros[12],
              I1: Registros[13],
              I2: Registros[14],
              I3: Registros[15],
            };
            clientMQTT.publish(
              "Raspberry_STS/Registros/Valores",
              JSON.stringify(arr)
            );
          })
          .catch(function () {
            console.error(
              "clientMQTT readCoils " +
                require("util").inspect(arguments, { depth: null })
            );
            clientMQTT.publish("Raspberry_STS/PLC/OFFLINE", "OFFLINE");
          });
      }
    });
  }, 1000);
});

// Receive messages
clientMQTT.on("message", function (topic, message) {
  if (
    topic.includes("Raspberry_STS/coilon") ||
    topic.includes("/Raspberry_STS/coiloff")
  ) {
    id = parseInt(message);
    if (id != isNaN) {
      let status = socket.resume()._readableState.destroyed;
      status ? socket.connect(options) : "";

      switch (topic) {
        // Encendemos la bobina
        case "Raspberry_STS/coilon":
          clientPLC.writeSingleCoil(id, true);
          break;
        // Apagamos la bobina
        case "Raspberry_STS/coiloff":
          clientPLC.writeSingleCoil(id, false);
          break;
      }
    }
  }
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|   FUNCIONES DE LA API (lECTURA DE REGISTROS   /   LECTURA DE REGISTROS    /   ENCEDER BOBINAS /   APAGAR BOBINAS  /   ALMACENAR INFORMACION EN LA BASE DE DATOS)      |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Fubnción pare lectura de bobinas
let readCoils = (req, res) => {
  let status = socket.resume()._readableState.destroyed;
  status ? socket.connect(options) : "";

  const { start, end } = req.body;
  clientPLC
    .readCoils(start, end)
    .then((result) => {
      let Bobinas = result.response._body._valuesAsArray;
      res.status(200).json(Bobinas);
    })
    .catch(function () {
      console.error(
        "readCoils " + require("util").inspect(arguments, { depth: null })
      );
      res.status(202).json(false);
    });
};

// Fubnción pare lectura de bobinas
let readHoldingRegisters = (req, res) => {
  let status = socket.resume()._readableState.destroyed;
  status ? socket.connect(options) : "";

  const { start, end } = req.body;
  clientPLC
    .readHoldingRegisters(start, end)
    .then((result) => {
      let Registros = result.response._body._valuesAsArray;
      res.status(200).json(Registros);
    })
    .catch(function () {
      console.error(
        "readHoldingRegisters " +
          require("util").inspect(arguments, { depth: null })
      );
      res.status(202).json(false);
    });
};

// Función para encedido de bobinas
let coilON = (req, res) => {
  let status = socket.resume()._readableState.destroyed;
  status ? socket.connect(options) : "";

  const id = req.body.id == undefined ? req.params.id : req.body.id;

  clientPLC
    .writeSingleCoil(id, true)
    .then((result) => {
      res.status(200).json(result.response._body);
    })
    .catch(function () {
      console.error(
        "coilON " + require("util").inspect(arguments, { depth: null })
      );
      res.status(202).json(false);
    });
};

// Función para apagado de bobinas
let coilOFF = (req, res) => {
  let status = socket.resume()._readableState.destroyed;
  status ? socket.connect(options) : "";
  const id = req.body.id == undefined ? req.params.id : req.body.id;

  clientPLC
    .writeSingleCoil(id, false)
    .then((result) => {
      res.status(200).json(result.response._body);
    })
    .catch(function () {
      console.error(
        "coilOFF " + require("util").inspect(arguments, { depth: null })
      );
      res.status(202).json(false);
    });
};

// Función para escritura de bobinas
let writeSingleRegister = (req, res) => {
  let status = socket.resume()._readableState.destroyed;
  status ? socket.connect(options) : "";
  const { id, value } = req.body;

  clientPLC
    .writeSingleRegister(id, value)
    .then((result) => {
      res.status(200).json(result.response._body);
    })
    .catch(function () {
      console.error(
        "writeSingleRegister " +
          require("util").inspect(arguments, { depth: null })
      );
      res.status(202).json(false);
    });
};

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|                                                                            CONSULTAS A LA BD                                                                          |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Consultas a la base de datos
/*
let data = (req, res) => {
    connection.query("SELECT * FROM Dispositivo_Rasp",
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

app.get("/", (req, res) => {
  res.json({ mensaje: "Api jsmodbus metodo GET :)" });
});
app.post("/", (req, res) => {
  res.json({ mensaje: "Api jsmodbus metodo POST :)" });
});

// base de datos
//app.get('/data', data)
// app.post('/data', data)

// LECTURA DE BOBINAS
app.post("/readCoils", readCoils); // Parametros { start, end }

// LECTURA DE REGISTROS
app.post("/readRegisters", readHoldingRegisters); // Parametros { start, end }

// ESCRITURA DE REGISTROS
app.post("/writeRegister", writeSingleRegister); // Parametros { id, value }

// ENCEDIDO DE BOBINAS
app.get("/coilon/:id", coilON);
app.post("/coilon", coilON); // Parametros { id }

// APAGADO DE BOBINAS
app.get("/coiloff/:id", coilOFF);
app.post("/coiloff", coilOFF); // Parametros { id }

module.exports = app;
