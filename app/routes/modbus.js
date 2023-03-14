const express = require("express");
const app = express();
//  mqtt
const mqtt = require("mqtt");
const URL_Client = "ws://www.sistemaintegralrios.com:8080/mqtt";
//const URL_Client = "ws://192.168.2.83:8080/mqtt";
const Client_Id =
  "Raspberry_" + Math.floor(Math.random() * (10000 - 1 + 1) + 1);

const Mqtt_Client = mqtt.connect(URL_Client, {
  clientId: Client_Id,
  clean: true,
  connectTimeout: 4000,
  username: "Raspberry",
  password: "Silver2670",
  reconnectPeriod: 1000,
});

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const dotenv = require("dotenv");
dotenv.config();

// Conexión a la BD
const { connection } = require("../config.db");

// create a tcp modbus client
const Modbus = require("jsmodbus");
const net = require("net");

const socket = new net.Socket();
const client = new Modbus.client.TCP(socket);
const options = {
  host: "192.168.1.50",
  port: 502,
};

// Iniciamos la conexión con el plc
socket.connect(options);

//MQTT

Mqtt_Client.on("connect", function () {
  Mqtt_Client.subscribe("Raspberry/Raspberry_TST/#", function (err) {
    if (!err) {
      setInterval(() => {
        client.readCoils(6, 8).then((result) => {
          let Bobinas = result.response._body._valuesAsArray;
          let arr = {
            Inicio: Bobinas[0],
            Arranque: Bobinas[1],
            Paro: Bobinas[2],
            Iniciado: Bobinas[0] == 0 ? false : true,
            "Paro de emergencia": Bobinas[4] == 0 ? "OFF" : "ON",
            "Fallo de fase": Bobinas[5] == 0 ? "OFF" : "ON",
          };
          //console.log(arr);
          Mqtt_Client.publish(
            "Raspberry/Raspberry_TST/Out/Bobinas",
            JSON.stringify(arr)
          );
        }, console.error);
      }, 5000);

      setInterval(() => {
        client.readHoldingRegisters(0, 16).then((result) => {
          //console.log(result.response._body);
          let Registros = result.response._body._values;
          let arr = {
            Hora: Registros[2] + ":" + Registros[1] + ":" + Registros[0],
            Fecha: Registros[5] + "/" + Registros[4] + "/" + Registros[3],
            V12: Registros[6],
            V23: Registros[7],
            V31: Registros[8],
            Flujo: Registros[9],
            Presion: Registros[10],
            Frecuencia: Registros[11],
            Nivel: Registros[12],
            I1: Registros[13],
            I2: Registros[14],
            I3: Registros[15],
          };
          //console.log(arr);
          Mqtt_Client.publish(
            "Raspberry/Raspberry_TST/Out/Registros",
            JSON.stringify(arr)
          );
        }, console.error);
      }, 1000);
    }
  });
});

Mqtt_Client.on("message", function (topic, message) {
  if (
    topic.includes("Raspberry/Raspberry_TST/Coil/On") ||
    topic.includes("Raspberry/Raspberry_TST/Coil/Off") ||
    topic.includes("Raspberry/Raspberry_TST/Coil/Arranque") ||
    topic.includes("Raspberry/Raspberry_TST/Coil/Paro")
  ) {
    Datos = JSON.parse(message.toString());
    console.log(topic);
    console.log(Datos);
    console.log(Datos.Bobina);
    if (Datos.Bobina != isNaN) {
      switch (topic) {
        // Encendemos la bobina
        case "Raspberry/Raspberry_TST/Coil/On":
          client.writeSingleCoil(Datos.Bobina, true);
          break;
        // Apagamos la bobina
        case "Raspberry/Raspberry_TST/Coil/Off":
          client.writeSingleCoil(Datos.Bobina, false);
          break;
        case "Raspberry/Raspberry_TST/Coil/Arranque":
          client.writeSingleCoil(Datos.Bobina, true);
          break;
        case "Raspberry/Raspberry_TST/Coil/Paro":
          client.writeSingleCoil(Datos.Bobina, false);
          break;
      }
    }
  }
  //client.end();
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------\
|   FUNCIONES DE LA API (lECTURA DE REGISTROS   /   LECTURA DE REGISTROS    /   ENCEDER BOBINAS /   APAGAR BOBINAS  /   ALMACENAR INFORMACION EN LA BASE DE DATOS)      |
\----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

// Fubnción pare lectura de bobinas
let readCoils = (req, res) => {
  const { start, end } = req.body;
  client.readCoils(start, end).then((result) => {
    let Bobinas = result.response._body._valuesAsArray;
    res.status(200).json(Bobinas);
  }, console.error);
};

// Fubnción pare lectura de bobinas
let readHoldingRegisters = (req, res) => {
  const { start, end } = req.body;
  client.readHoldingRegisters(start, end).then((result) => {
    let Bobinas = result.response._body._valuesAsArray;
    res.status(200).json(Bobinas);
  }, console.error);
};

// Función para encedido de bobinas
let coilON = (req, res) => {
  const id = req.body.id == undefined ? req.params.id : req.body.id;

  client
    .writeSingleCoil(id, true)
    .then((result) => {
      res.status(200).json(result.response._body);
    })
    .catch(() => {
      console.error(arguments);
    });
};

// Función para apagado de bobinas
let coilOFF = (req, res) => {
  const id = req.body.id == undefined ? req.params.id : req.body.id;

  client
    .writeSingleCoil(id, false)
    .then((result) => {
      res.status(200).json(result.response._body);
    })
    .catch(() => {
      console.error(arguments);
    });
};

// Función para escritura de bobinas
let writeSingleRegister = (req, res) => {
  const { id, value } = req.body;

  client
    .writeSingleRegister(id, value)
    .then((result) => {
      res.status(200).json(result.response._body);
    })
    .catch(() => {
      console.error(arguments);
    });
};

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
