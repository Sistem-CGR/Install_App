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
#Actualizamos el sistema
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y
#Instalacion de docker y plugin
sudo apt install docker.io -y
sudo apt install docker-compose -y
#Intstalacion de lamp
sudo apt install apache2 -y
sudo apt install php -y
sudo apt install mariadb-server -y
sudo chmod +x Run_app.sh
sudo apt install ddclient -y
sudo chmod 777 /etc/ddclient.conf
sudo echo 'daemon=3600' > /etc/ddclient.conf
sudo echo 'protocol=dyndns2' >> /etc/ddclient.conf
sudo echo 'use=web' >> /etc/ddclient.conf
sudo echo 'server=domains.google.com' >> /etc/ddclient.conf
sudo echo 'login=14fSV0GUQlzzeg8n' >> /etc/ddclient.conf
sudo echo "password='G0TYxOdN5MepULJg'" >> /etc/ddclient.conf
sudo echo 'raspberry.telemetriamorelos.com' >> /etc/ddclient.conf
sudo chmod 644 /etc/ddclient.conf
sudo systemctl enable ddclient
sudo systemctl start ddclient
sudo apt autoremove -y
#sudo ddclient -daemon=0 -debug -verbose -noquiet
sudo shutdown -r now # &&  /home/pi/Install_IOT/Run_app.sh
