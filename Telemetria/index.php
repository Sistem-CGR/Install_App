<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="shortcut icon" href="img/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="lib/b4/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/menu.css">
    <link rel="stylesheet" href="lib/sweetalert2/sweetAlert.css">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <div class="login-page bg-light login-page Img_Fondo">
        <div class="container">
            <div class="row">
                <div class="col-lg-10 offset-lg-1">
                    <div class="bg-white shadow rounded">
                        <div class="row">
                            <div class="col-md-7 pe-0">
                                <div class="form-left h-100 py-5 px-5 border">
                                    <form action="" class="row g-4" id="Form_Login" name="Form_Login">
                                        <div class="col-12 text-center border border-success">
                                            <h1>Telemetria</h1>
                                        </div>
                                        <div class="d-flex justify-content-center col-12">
                                            <span class="text-danger" id="Alert_User"></span>
                                        </div>
                                        <div class="col-12">
                                            <label>Usuario <span class="text-danger">*</span></label>
                                            <div class="input-group">
                                                <div class="input-group-text"><i class="fas fa-user-lock"></i></div>
                                                <input type="text" class="form-control form-control-lg" required>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <label>Contraseña <span class="text-danger">*</span></label>
                                            <div class="input-group">
                                                <div class="input-group-text"><i class="fas fa-key"></i> </div>
                                                <input type="password" class="form-control form-control-lg" required>
                                            </div>
                                        </div>
                                        <div class="col-12 justify-content-end d-flex">
                                            <button type="submit" class="btn btn-primary px-4 float-end mt-4">login <i class="fas fa-sign-in-alt"></i></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="col-md-5 ps-0 d-none d-md-block">
                                <div class="form-right h-100 text-white text-center pt-5"> <img src="../Telemetria/img/logo.png" alt="logo" srcset=""></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="lib/jquery-3.6.3.min.js"></script>
    <script src="lib/b4/js/popper.min.js"></script>
    <script src="lib/b4/js/bootstrap.min.js"></script>
    <script src="lib/fa5/js/all.min.js"></script>
    <script src="lib/sweetalert2/sweetAlertMin.js"></script>
    <script src="../Telemetria/js/login.js  "></script>
</body>

</html>