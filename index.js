const express = require('express')
const app = express()


// Nos ayuda a nalizxar el cuerpo de la  solicitud
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

// Cargamos el archivo de rutas
app.use(require('./routes/modbus'))
/*
app.listen(process.env.PORT||8083, () => {
    console.log("Ejecutando dervidro en localhost:8080")
})*/

app.listen(8080)

module.exports = app;