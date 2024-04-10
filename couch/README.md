**usando openssl:**  
shell> mkdir /etc/couchdb/cert
shell> cd /etc/couchdb/cert
shell> openssl genrsa > privkey.pem
shell> openssl req -newkey rsa:2048 -nodes -x509 -keyout privkey.pem -out couchdb.pem -days 1095 -addext "subjectAltName = IP.1:192.168.1.27" \

entrar no container:  
docker exec -it couch_couchserver_1 bash  

shell> chmod 600 privkey.pem couchdb.pem
shell> chown couchdb privkey.pem couchdb.pem

**para alterar o arquivo local.ini:**  
sudo chmod +w ./etc/local.ini; sudo chmod g+w ./etc/local.ini; sudo chown element ./etc/local.ini


sudo service docker start  
docker-compose up -d  

http://localhost:5984/  
http://localhost:5984/_utils/  

**ssl:**  
https://localhost:6984/_utils/  

**accessar o bash do couchdb server:**  
docker exec -it couch_couchserver_1 bash  


**configurando cors:**  
pnpm install -g add-cors-to-couchdb
add-cors-to-couchdb http://localhost:5984 -u admin -p 123456
add-cors-to-couchdb http://192.168.1.27:5984 -u admin -p 123456

docker-compose down  