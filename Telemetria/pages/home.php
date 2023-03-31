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
                    <div class="col-lg-12 col-12 d-flex justify-content-start row">
                        <div class="form-group col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <div class="form-group row">
                                <div class="col-lg-12  col-md-3 col-sm-3 row">
                                    <div class="col-lg-4 col-md-12">
                                        <input type="text" id="Precion" class="form-control form-control-sm" placeholder="0.00" aria-describedby="Presdesc" readonly>
                                        <small id="Presdesc" class="form-text text-muted"> Presión</small>
                                    </div>
                                    <div class="col-lg-4 col-md-12">
                                        <input type="text" id="Flujo" class="form-control form-control-sm" placeholder="0.00" aria-describedby="Flujodesc" readonly>
                                        <small id="Flujodesc" class="form-text text-muted"> Flujo</small>
                                    </div>

                                    <div class="col-lg-4 col-md-12">
                                        <input type="text" id="Nivel" class="form-control form-control-sm" placeholder="0.00" aria-describedby="Niveldesc" readonly>
                                        <small id="Niveldesc" class="form-text text-muted"> Nivel dinamico</small>
                                    </div>
                                </div>

                                <div class="col-lg-12 col-md-9 col-sm-9">
                                    <img class="mw-100" src="../img/pozo.png" alt="img">
                                </div>
                            </div>
                        </div>

                        <div class="form-row col-lg-3 col-md-12 col-sm-12">
                            <div class="col-6">
                                <input type="text" id="hora" class="form-control form-control-sm" readonly>
                                <small class="form-text text-muted"> Hora</small>
                            </div>

                            <div class="col-6">
                                <input type="text" id="fecha" class="form-control form-control-sm" readonly>
                                <small class="form-text text-muted"> Fecha</small>
                            </div>

                            <div class="col-12">
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
                                            <th colspan=2 class="text-center">I1</th>
                                            <th class="text-center" id="I1"></th>
                                        </tr>

                                        <tr>
                                            <th colspan=2 class="text-center">I2</th>
                                            <th class="text-center" id="I2"></th>
                                        </tr>

                                        <tr>
                                            <th colspan=2 class="text-center">I3</th>
                                            <th class="text-center" id="I3"></th>
                                        </tr>

                                        <tr>
                                            <th colspan=2 class="text-center">Frecuencia</th>
                                            <th class="text-center" id="Frecuencia"></th>
                                        </tr>

                                        <tr class="bg-primary text-white text-center">
                                            <th colspan=3>Controles</th>
                                        </tr>

                                        <tr class="Bobina1">
                                            <th class="text-center"> Inicio </th>
                                            <th class="text-center" id="Bobina1"></th>
                                            <th class="text-center text-secondary" id="Ind1"> <i class="fas fa-lightbulb"></i> </th>
                                        </tr>

                                        <tr>
                                            <th class="text-center"> Arranque </th>
                                            <th class="text-center">
                                                <span calss='text-danger Bobina2 text-secondary' id="Bobina2" onclick='coilPress(7, "Bobina2")' type='button'>
                                                    <i class='fas fa-dot-circle'></i>
                                                </span>
                                            </th>

                                            <th class="text-center align-middle" id="Ind2" rowspan="2">sadfsdfad</th>
                                        </tr>

                                        <tr>
                                            <th class="text-center"> Paro </th>
                                            <th class="text-center">
                                                <span calss='text-secondary Bobina3' id="Bobina3" onclick='coilPress(8, "Bobina3")' type='button'>
                                                    <i class='fas fa-dot-circle'></i>
                                                </span>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th class="text-center"> Paro de emergencia </th>
                                            <th class="text-center"> </th>
                                            <th class="text-center text-secondary" id="Ind3"><i class="fas fa-lightbulb"></i></th>
                                        </tr>

                                        <tr>
                                            <th class="text-center"> Falla de fase </th>
                                            <th class="text-center"> </th>
                                            <th class="text-center text-secondary" id="Ind4"><i class="fas fa-lightbulb"></i></th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="form-row col-md-9 col-sm-12  col-12 ">
                            <div class="col-12 map-responsive">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4008.604397020155!2d-99.06340139999999!3d18.900108199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce731494ce33d7%3A0xe31da3b8bc56de1b!2sCorporativo%20Grupo%20R%C3%ADos%20S.A.%20de%20C.V.!5e1!3m2!1ses-419!2smx!4v1676069634986!5m2!1ses-419!2smx" width="10" height="10" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                            </div>
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
    <script src="../js/modbus.js"></script>
</body>

</html>