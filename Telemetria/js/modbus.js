let api = "192.168.1.141:83";
//let api = "www.sistemaintegralrios.com:8083"
//let api = "192.168.1.10:8083"

let registros = 25;

let init = () => {
  hora(0, 16);
  readCoils(6, 6);
  setInterval(() => {
    hora(0, 16);
    readCoils(6, 6);
  }, 1000);
};

// Funcion para ir arriba
$(".ir-arriba").click(function () {
  $("body, html").animate(
    {
      scrollTop: "0px",
    },
    400
  );
});

$(window).scroll(function () {
  if ($(this).scrollTop() > 0) {
    $(".ir-arriba").slideDown(300);
  } else {
    $(".ir-arriba").slideUp(300);
  }
});

//GRAFICAS
var dps = [];
var dps2 = [];
var dpsV1 = [];
var dpsV2 = [];
var dpsV3 = [];
var dpsI1 = [];
var dpsI2 = [];
var dpsI3 = [];
var segundos = 0;

var presionChart = new CanvasJS.Chart("presionChart", {
  exportEnabled: true,
  title: { text: "Presión" },
  axisX: { title: "Segundos" },
  axisY: { title: "Presión" },
  data: [
    {
      type: "splineArea",
      color: "rgba(54,158,173,.7)",
      markerSize: 5,
      dataPoints: dps,
    },
  ],
});

var flujoChart = new CanvasJS.Chart("flujoChart", {
  exportEnabled: true,
  title: { text: "Flujo" },
  axisX: { title: "Segundos" },
  axisY: { title: "Flujo" },
  data: [
    {
      lineColor: "green",
      color: "rgba(54,158,173,.7)",
      type: "splineArea",
      markerSize: 5,
      dataPoints: dps2,
    },
  ],
});

// Función par aactualizar la grafica de presión
var updatepresionChart = function (yVal, xVal) {
  dps.push({ x: xVal, y: yVal });
  // number of dataPoints visible at any point
  dps.length > registros ? dps.shift() : "";
  presionChart.render();
};

// Función par aactualizar la grafica de flujo
var updateflujoChart = function (yVal, xVal) {
  dps2.push({ x: xVal, y: yVal });

  // number of dataPoints visible at any point
  dps2.length > registros ? dps2.shift() : "";
  flujoChart.render();
};

/**
 *      Graficas de voltaje
 */

var voltajesChart = new CanvasJS.Chart("voltajeChart", {
  exportEnabled: true,
  title: { text: "Vooltajes" },
  data: [
    {
      type: "line",
      name: "V12",
      showInLegend: true,
      yValueFormatString: "#,###",
      dataPoints: dpsV1,
    },
    {
      type: "line",
      name: "V23",
      showInLegend: true,
      yValueFormatString: "#,###",
      dataPoints: dpsV2,
    },
    {
      type: "line",
      name: "V31",
      showInLegend: true,
      yValueFormatString: "#,###",
      dataPoints: dpsV3,
    },
  ],
});

// Función par aactualizar la grafica de flujo
var updatevoltajesChart = function (yVal, yVal2, yVal3, seconds) {
  dpsV1.push({ x: seconds, y: yVal });
  dpsV2.push({ x: seconds, y: yVal2 });
  dpsV3.push({ x: seconds, y: yVal3 });

  // number of dataPoints visible at any point
  dpsV1.length > registros ? dpsV1.shift() : "";
  dpsV2.length > registros ? dpsV2.shift() : "";
  dpsV3.length > registros ? dpsV3.shift() : "";

  voltajesChart.render();
};

/**
 *      Graficas de CORRIENTE
 */

var corrientesChart = new CanvasJS.Chart("corrienteChart", {
  exportEnabled: true,
  title: { text: "Corrientes" },
  data: [
    {
      type: "line",
      name: "I1",
      showInLegend: true,
      yValueFormatString: "#,###",
      dataPoints: dpsI1,
    },
    {
      type: "line",
      name: "I2",
      showInLegend: true,
      yValueFormatString: "#,###",
      dataPoints: dpsI2,
    },
    {
      type: "line",
      name: "I3",
      showInLegend: true,
      yValueFormatString: "#,###",
      dataPoints: dpsI3,
    },
  ],
});

// Función par aactualizar la grafica de flujo
var updatecorrientesChart = function (yVal, yVal2, yVal3, seconds) {
  dpsI1.push({ x: seconds, y: yVal });
  dpsI2.push({ x: seconds, y: yVal2 });
  dpsI3.push({ x: seconds, y: yVal3 });

  // number of dataPoints visible at any point
  dpsI1.length > registros ? dpsI1.shift() : "";
  dpsI2.length > registros ? dpsI2.shift() : "";
  dpsI3.length > registros ? dpsI3.shift() : "";

  corrientesChart.render();
};

let hora = (start, end) => {
  $.post(
    "http://" + api + "/readregisters",
    { start, end },
    (data) => {
      segundos++;

      $("#hora").val(" " + data[2] + " : " + data[1] + " : " + data[0]);
      $("#fecha").val(" " + data[3] + " / " + data[4] + " / " + data[5]);

      // Voltajes
      $("#V12").html(data[6]);
      $("#V23").html(data[7]);
      $("#V31").html(data[8]);
      updatevoltajesChart(data[6], data[7], data[8], segundos);

      $("#Flujo").val(data[9]);
      $("#Precion").val(data[10]);
      // Presión
      !isNaN(data[9]) ? updatepresionChart(data[9], segundos) : "";
      // Flujo
      !isNaN(data[10]) ? updateflujoChart(data[10], segundos) : "";

      $("#Frecuencia").html(data[11]);
      $("#Nivel").val(data[12]);

      // Corrientes
      $("#I1").html(data[13]);
      $("#I2").html(data[14]);
      $("#I3").html(data[15]);
      updatecorrientesChart(data[13], data[14], data[15], segundos);
    },
    "json"
  );
};

let readCoils = (start, end) => {
  $.post(
    "http://" + api + "/readCoils",
    { start, end },
    (data) => {
      t0 = " title='Encender bobina' ";
      t1 = " title='Apagar Bobina'";
      c0 = " class='btn btn-sm btn-outline-danger' ";
      c1 = " class='btn btn-sm btn-outline-success' ";

      click0 = " onclick='coilon(this)' ";
      click1 = " onclick='coiloff(this)' ";

      $(".Bobina1").removeClass("text-success text-danger");

      $("#Ind1").removeClass("text-success text-secondary");
      $("#Ind2").removeClass("text-success text-secondary");
      $("#Ind3").removeClass("text-danger text-secondary");
      $("#Ind4").removeClass("text-danger text-secondary");

      if (data[0] == 1) {
        b1 =
          "<span class='text-success'" +
          t1 +
          " onclick='coiloff(6)' type='button'><i class='fas fa-toggle-on'></i></span>";
        $(".Bobina1").addClass("text-success");
        $("#Ind1").addClass("text-success");
      } else {
        b1 =
          "<span calss='text-danger'" +
          t0 +
          " onclick='coilon(6)' type='button'><i class='fas fa-toggle-off'></i> </span>";
        $(".Bobina1").addClass("text-danger");
        $("#Ind1").addClass("text-secondary");
      }

      data[3] == 1
        ? $("#Ind2").addClass("text-success")
        : $("#Ind2").addClass("text-secondary");
      if (data[4] == 1) {
        $("#Ind3").addClass("text-danger");
        $("#divParo").html(
          '<div class="alert text-center alert-danger alert-dismissible fade show" role="alert">' +
            "<h4><b>¡ ALERTA DE PARO DE EMERGENCIA !</b></h4>" +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            "</button><div>"
        );
      } else {
        $("#divParo").html("");
        $("#Ind3").addClass("text-secondary");
      }

      if (data[5] == 1) {
        $("#Ind4").addClass("text-danger");
        $("#divFallo").html(
          '<div class="alert text-center alert-danger alert-dismissible fade show" role="alert">' +
            "<h4><b>¡ ALERTA DE FALLO DE FASE !</b></h4>" +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            "</button><div>"
        );
      } else {
        $("#divFallo").html("");
        $("#Ind4").addClass("text-secondary");
      }

      $("#Bobina1").html(b1);
    },
    "json"
  );
};

// Funcion para encender bobinas
let coilon = (id) => {
  $.post("http://" + api + "/coilon", { id }, () => {
    readCoils(6, 6);
  });
};

// Pulso de bobina
let coilPress = (id, btn) => {
  $.post("http://" + api + "/coilon", { id }, () => {
    $("#" + btn).removeClass("text-success text-secondary");
    $("#" + btn).addClass("text-success");
    setTimeout(() => {
      $("#" + btn).removeClass("text-success text-secondary");
      $("#" + btn).addClass("text-secondary");
      // Apagamos la bobina
      coiloff(id);
    }, 1000);
  });
};

// Funcion para apagar bobinas
let coiloff = (id) => {
  $.post("http://" + api + "/coiloff", { id }, () => {
    readCoils(6, 6);
  });
};

init();
