const Service = require("node-windows").Service;

const svc = new Service({
  name: "APIPLC",
  description: "API de comunicación a plc",
  script: "C:\\Users\\admingrabacion\\Documents\\api-02\\index.js", // Ruta del archivo
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
});

svc.on("install", function () {
  svc.start();
});

svc.install();
