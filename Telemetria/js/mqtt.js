const URL_Client = "ws://192.168.2.83:8080/mqtt";
const Client_Id = "User" + Math.floor(Math.random() * (10000 - 1 + 1) + 1);
const Mqtt_Client = mqtt.connect(URL_Client);

Mqtt_Client.on("connect", function () {
  Mqtt_Client.subscribe("Raspberry/Raspberry_TST/#", function (err) {
    if (!err) {
    }
  });
});

Mqtt_Client.on("message", function (topic, message) {
  //console.log("Tópico " + topic);
  switch (topic) {
    case "Raspberry/Raspberry_TST/Out/Registros":
      let Registros = JSON.parse(message.toString());
      $("#Presion").text(Registros.Presion);
      $("#Flujo").text(Registros.Flujo);
      $("#Nivel").text(Registros.Nivel);
      $("#Fecha").text(Registros.Fecha);
      $("#Hora").text(Registros.Hora);
      $("#I1").text(Registros.I1);
      $("#I2").text(Registros.I2);
      $("#I3").text(Registros.I3);
      $("#V12").text(Registros.V12);
      $("#V23").text(Registros.V23);
      $("#V31").text(Registros.V31);
      $("#Frecuencia").text(Registros.Frecuencia);
      break;
    case "Raspberry/Raspberry_TST/Out/Bobinas":
      let Bobinas = JSON.parse(message.toString());
      Bobinas.Inicio == 1
        ? $("#Inicio").html(
            "<span class='text-success' type='button' onclick='Coil_Off(6,0)' ><i class='fas fa-toggle-on'></i></span>"
          )
        : $("#Inicio").html(
            "<span class='text-danger' type='button' onclick='Coil_On(6,1)'><i class='fas fa-toggle-off'></i></span>"
          );
      //console.log(Bobinas);
      break;
  }
});

let Coil_Off = (Id, Status) => {
  let Datos = {
    Bobina: Id,
    Status: Status,
  };
  Mqtt_Client.publish(
    "Raspberry/Raspberry_TST/Coil/Off",
    JSON.stringify(Datos),
    function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Published");
      }
    }
  );
  let Datos2 = {
    Bobina: 7,
    Status: Status,
  };

  setTimeout(() => {
    console.log("Apagar de nuevo");
    Mqtt_Client.publish(
      "Raspberry/Raspberry_TST/Coil/Off",
      JSON.stringify(Datos2),
      function (error) {
        if (error) {
          console.log(error);
        } else {
          $("#Ind2").html('<i class="fas fa-lightbulb text-secondary"></i>');
          console.log("Published");
        }
      }
    );
  }, 250);
  /*
  setTimeout(() => {
    console.log("Apagar de nuevo");
    Mqtt_Client.publish(
      "Raspberry/Raspberry_TST/Coil/Off",
      JSON.stringify(Datos),
      function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Published");
        }
      }
    );
  }, 250);*/
};
let Coil_On = (Id, Status) => {
  let Datos = {
    Bobina: Id,
    Status: Status,
  };
  Mqtt_Client.publish(
    "Raspberry/Raspberry_TST/Coil/On",
    JSON.stringify(Datos),
    function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Published");
      }
    }
  );
};

let Arranque = (Id, Status) => {
  let Datos = {
    Bobina: Id,
    Status: Status,
  };
  Mqtt_Client.publish(
    "Raspberry/Raspberry_TST/Coil/Arranque",
    JSON.stringify(Datos),
    function (error) {
      if (error) {
        console.log(error);
      } else {
        $("#Ind2").html('<i class="fas fa-lightbulb text-success"></i>');
        console.log("Published");
      }
    }
  );
  setTimeout(() => {
    console.log("Apagar de nuevo");
    Mqtt_Client.publish(
      "Raspberry/Raspberry_TST/Coil/Off",
      JSON.stringify(Datos),
      function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Published");
        }
      }
    );
  }, 500);
};

let Paro = (Id, Status) => {
  let Datos = {
    Bobina: Id,
    Status: Status,
  };
  Mqtt_Client.publish(
    "Raspberry/Raspberry_TST/Coil/On",
    JSON.stringify(Datos),
    function (error) {
      if (error) {
        console.log(error);
      } else {
        $("#Ind2").html('<i class="fas fa-lightbulb text-secondary"></i>');
        console.log("Published Paro");
      }
    }
  );

  setTimeout(() => {
    console.log("Apagar de nuevo");
    Mqtt_Client.publish(
      "Raspberry/Raspberry_TST/Coil/Off",
      JSON.stringify(Datos),
      function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Published");
        }
      }
    );
  }, 500);
};
