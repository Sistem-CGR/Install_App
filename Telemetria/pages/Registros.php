<?php require '../Global/header.php'; ?>
<!--    Título    -->
<title>Telemetría</title>

<style>
    .ir-arriba {
        display: none;
        padding: 10.3px;
        background: #024959;
        font-size: 12px;
        color: #fff;
        cursor: pointer;
        position: fixed;
        bottom: 15px;
        right: 10px;
    }

    .map-responsive {
        overflow: hidden;
        padding-bottom: 56.25%;
        position: relative;
        height: 0;
    }

    .map-responsive iframe {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
    }

    #Img_Fondo {
        background-image: url("../img/pozo.png");
        height: 800px;

    }

    /*
    .mt-6 {
        margin-top: 4rem !important;
    }

    .mr-6 {
        margin-right: 4rem !important;
    }

    .ml-6 {
        margin-left: 4rem !important;
    }*/
</style>
</head>

<body>
    <?php require '../Global/Menu.php'; ?>
    <!--Contenido-->
    <div class="content-wrapper">
        <div class="box">
            <ul class="nav nav-tabs d-flex justify-content-center mt-3" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <a class="nav-link active" id="Manual-tab" data-toggle="tab" href="#Manual" role="tab" aria-controls="Manual" aria-selected="true">Registros <i class="fas fa-microchip"></i></a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="Excel-tab" data-toggle="tab" href="#Excel" role="tab" aria-controls="Excel" aria-selected="false">Graficas <i class="fas fa-chart-area"></i></a>
                </li>
            </ul>

            <div id="divFallo"></div>
            <div id="divParo"></div>

            <div class="tab-content" id="myTabContent">
                <!--    Registros   -->
                <div class="tab-pane fade show active mt-3" id="Manual" role="tabpanel" aria-labelledby="Manual-tab">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-left row">



                        <div class="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 d-flex justify-content- row ml-3" id="Img_Fondo">

                            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mt-5 ml-5">
                                <h6 class="alert alert-info" role="alert">Flujo: <span id="I1"></span></h6>
                            </div>
                            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mt-5 ml-4">
                                <h6 class="alert alert-info" role="alert">S2: <span id="I2"></span></h6>
                            </div>

                            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mt-5 ml-3">
                                <h6 class="alert alert-info" role="alert">S3: <span id="I3"></span></h6>
                            </div>
                        </div>


                        <div class="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 ml-3">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="alert alert-warning text-center" role="alert">
                                    <h4>Controles</h4>
                                </div>
                                <table class="table table-sm table-striped table-hover table-compact">
                                    <thead class="bg-primary text-white text-center">

                                    </thead>
                                    <tbody>
                                        <tr class="Bobina1" role="alert">
                                            <th class="text-left"> Inicio </th>
                                            <th class="text-center" id="Inicio"></th>
                                            <th class="text-center text-secondary" id="Ind1"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-left"> Arranque </th>
                                            <th class="text-center">
                                                <span calss='text-danger Bobina2 text-secondary' id="Bobina2" onclick='Arranque(7, "Bobina2")' type='button'>
                                                    <i class='fas fa-dot-circle'></i>
                                                </span>
                                            </th>

                                            <th class="text-center align-middle" id="Ind2" rowspan="2"><i class="fas fa-lightbulb text-secondary"></i></th>
                                        </tr>

                                        <tr>
                                            <th class="text-left"> Paro </th>
                                            <th class="text-center">
                                                <span calss='text-secondary Bobina3' id="Bobina3" onclick='Paro(8, "Bobina3")' type='button'>
                                                    <i class='fas fa-dot-circle'></i>
                                                </span>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th class="text-left"> Paro de emergencia </th>
                                            <th class="text-center"> </th>
                                            <th class="text-center text-secondary" id="Ind3"><i class="fas fa-lightbulb"></i></th>
                                        </tr>

                                        <tr>
                                            <th class="text-left"> Falla de fase </th>
                                            <th class="text-center"> </th>
                                            <th class="text-center text-secondary" id="Ind4"><i class="fas fa-lightbulb"></i></th>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="alert alert-primary" role="alert">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center"><b>Presión: </b><span id="Presion" class="badge badge-success badge-pill"></span></b></li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center"><b>Flujo: </b> <span id="Flujo" class="badge badge-success badge-pill"></span></li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center"><b>Nivel dinámico: </b> <span id="Nivel" class="badge badge-success badge-pill"></span></li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center"><b>Fecha: </b> <span id="Fecha" class="badge badge-success badge-pill"></span></li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center"><b>Hora: </b> <span id="Hora" class="badge badge-success badge-pill"></span></li>
                                    </ul>
                                </div>
                            </div>
                            <table class="table table-sm table-striped table-hover table-compact">
                                <thead class="bg-primary text-white text-center">
                                    <tr>
                                        <th colspan=3>Parámetros eléctricos</th>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Parámetro</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th colspan=2 class="text-center"> V12 </th>
                                        <th class="text-center text-primary" id="V12"></th>
                                    </tr>
                                    <tr>
                                        <th colspan=2 class="text-center">V23</th>
                                        <th class="text-center text-primary" id="V23"></th>
                                    </tr>
                                    <tr>
                                        <th colspan=2 class="text-center">V31</th>
                                        <th class="text-center text-primary" id="V31"></th>
                                    </tr>

                                    <tr>
                                        <th colspan=2 class="text-center">Frecuencia</th>
                                        <th class="text-center" id="Frecuencia"></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!--    Graficas    -->
                <div class="tab-pane fade mt-3" id="Excel" role="tabpanel" aria-labelledby="Excel-tab">
                    <div class="col-lg-12 col-12 d-flex justify-content-center row">
                        <!--        Presión     -->
                        <div class="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div class="container-fluid border" id="presionChart" style="height: 300px; width: 100%;"></div>
                        </div>
                        <!--        Flujo       -->
                        <div class="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div class="container-fluid border" id="flujoChart" style="height: 300px; width: 100%;"></div>
                        </div>

                        <!--        Voltajes     -->
                        <div class="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div class="container-fluid border" id="voltajeChart" style="height: 450px; width: 100%;"></div>
                        </div>
                        <!--        Corrientes      -->
                        <div class="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div class="container-fluid border" id="corrienteChart" style="height: 450px; width: 100%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--    BOTON IR ARRIBA  -->
    <span class="ir-arriba" title="Subir"><i class="fas fa-chevron-up"></i></span>
    <?php require '../Global/footer.php'; ?>
    <script src="../lib/Canvasjs/jquery.canvasjs.min.js?v=<?php echo (rand()); ?>"></script>
    <script src="../lib/MQTT/mqtt.min.js"></script>
    <script src="../js/mqtt.js"></script>
</body>

</html>