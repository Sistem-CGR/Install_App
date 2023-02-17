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
DB_USER_NAME="Telemetria"
DB_PASSWORD_NAME="Silver2670T"
# Lista de tablas
#=""
Table1="Dispositivo_Rasp"
Table2="Dispositivos_PLC"
Table3="Parametros"
Table4="Data"
table_exists_Table1=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p $DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Table1' AND table_schema = '$DB_NAME';")
table_exists_Table2=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p $DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Table2' AND table_schema = '$DB_NAME';")
table_exists_Table3=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p $DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Table3' AND table_schema = '$DB_NAME';")
table_exists_Table4=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p $DB_PASSWORD_NAME -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$Table4' AND table_schema = '$DB_NAME';")

echo $table_exists_Table1
echo $table_exists_Table2
echo $table_exists_Table3
echo $table_exists_Table4

if [[ $table_exists_Table1 == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
  CREATE TABLE $Table1 (
    Id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Usuario nvarchar(20) NOT NULL ,
    Contraseña nvarchar(20) NOT NULL ,
    Nombre nvarchar(50) NOT NULL ,
    Modelo nvarchar(50) NOT NULL ,
    Ram int NOT NULL ,
    Ssd int NOT NULL ,
    Dominio nvarchar(100) NULL ,
    Latitud nvarchar(100) NULL ,
    Longitud nvarchar(100) NULL ,
    API nvarchar(20) NULL ,
    Puerto_API int NULL ,
    Descripcion nvarchar(500) NULL
  );
EOF
fi

if [[ $table_exists_Table2 == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
   CREATE TABLE $Table2 (
    Id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Id_Rasp int NOT NULL ,
    foreign key (Id_Rasp) REFERENCES $Table1(Id),
    Nombre nvarchar(50)  NOT NULL ,
    IP nvarchar(15) NOT NULL ,
    Puerto_PLC int NOT NULL ,
    Descripcion nvarchar(500) NOT NULL
  );
EOF
fi

if [[ $table_exists_Table3 == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
   CREATE TABLE $Table3 (
    Id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Id_PLC int  NOT NULL ,
    foreign key (Id_PLC) REFERENCES $Table2(Id),
    Nom_Variable nvarchar(15)  NOT NULL ,
    Tipo_Variable nvarchar(10)  NOT NULL ,
    Valor nvarchar(20)  NOT NULL ,
    Descripcion nvarchar(300)  NOT NULL
  );
EOF
fi

if [[ $table_exists_Table4 == 0 ]]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER_NAME -p$DB_PASSWORD_NAME $DB_NAME << EOF
  CREATE TABLE $Table4 (
    Id int AUTO_INCREMENT PRIMARY KEY,
    Id_Parametro int  NOT NULL ,
    foreign key (Id_Parametro) REFERENCES $Table3(Id),
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
#sudo cp -r Telemetria/ /var/www/html/Telemetria
