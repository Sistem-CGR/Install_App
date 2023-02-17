#!/bin/bash
logo="
  _____     _____ __    ______ _______ ___________
  \_   \___/__   ___\ /   ___/  _____/     ()    / 
   / /\/ _ \ / /     |   /   |  |  __\     __    \ 
/\/ /_| (_) / /      |   \___|  |__\  \   \   \   \ 
\____/ \___/\/        \ ______\________\____\  \___\ 

           CORPORATIVO GRUPO RIOS S.A. DE C.V.
"
echo "$logo"
sudo mkdir /home/pi/Data
cd services
sudo docker-compose -f docker-compose.yml up -d
#Declaracion de variables
DB_HOST="127.0.0.1"
DB_PORT=33060
DB_NAME="Telemetria"
DB_USER_NAME="CGRTelemetria"
DB_PASSWORD_NAME="CGR_Silver2671"
# Lista de tablas
Dispositivo_Rasp="Dispositivo_Rasp"
Dispositivos_PLC="Dispositivos_PLC"
Parametros="Parametros"
Data="Data"
table_exists_Dispositivo_Rasp=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Dispositivo_Rasp' AND table_schema = '$DB_NAME';")
table_exists_Dispositivos_PLC=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Dispositivos_PLC' AND table_schema = '$DB_NAME';")
table_exists_Parametros=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Parametros' AND table_schema = '$DB_NAME';")
table_exists_Data=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Data' AND table_schema = '$DB_NAME';")


if [[ $table_exists_Dispositivo_Rasp == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
  CREATE TABLE Dispositivo_Rasp (
    Id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Usuario nvarchar(20)  NOT NULL ,
    Contraseña nvarchar(20)  NOT NULL ,
    Nombre nvarchar(50)  NOT NULL ,
    Modelo nvarchar(50)  NOT NULL ,
    Ram int  NOT NULL ,
    Ssd int  NOT NULL ,
    Dominio nvarchar(100)  NOT NULL ,
    Latitud nvarchar(100)  NOT NULL ,
    Longitud nvarchar(100)  NOT NULL ,
    API nvarchar(20)  NOT NULL ,
    Puerto_API int  NOT NULL ,
    Descripcion nvarchar(500)  NOT NULL
  );
EOF
fi

if [[ $table_exists_Dispositivos_PLC == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
   CREATE TABLE Dispositivos_PLC (
    Id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Id_Rasp int  NOT NULL ,
    foreign key (Id_Rasp) REFERENCES Dispositivo_Rasp(Id),
    Nombre nvarchar(50)  NOT NULL ,
    IP nvarchar(15)  NOT NULL ,
    Puerto_PLC int  NOT NULL ,
    Descripcion nvarchar(500)  NOT NULL
  );
EOF
fi

if [[ $table_exists_Parametros == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
   CREATE TABLE Parametros (
    Id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Id_PLC int  NOT NULL ,
    foreign key (Id_PLC) REFERENCES Dispositivos_PLC(Id),
    Nom_Variable nvarchar(15)  NOT NULL ,
    Tipo_Variable nvarchar(10)  NOT NULL ,
    Valor nvarchar(20)  NOT NULL ,
    Descripcion nvarchar(300)  NOT NULL
  );
EOF
fi

if [[ $table_exists_Data == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
  CREATE TABLE Data (
    Id int AUTO_INCREMENT PRIMARY KEY,
    Id_Parametro int  NOT NULL ,
    foreign key (Id_Parametro) REFERENCES Parametros(Id),
    Valor float  NOT NULL ,
    Alerta nvarchar(1)  NOT NULL ,
    Fecha datetime
  );
EOF
fi

#Desplegar la aplicación
cd ..
cd app
sudo docker build -t app .
sudo docker run --restart=always -d -p 83:8080 app
cd ..
#Mocemos el Proyecto
#sudo chmod 777 /var/www/html/
sudo cp -r Telemetria/ /var/www/html/Telemetria
