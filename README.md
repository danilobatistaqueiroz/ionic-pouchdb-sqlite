ionic build
ionic cap copy android
cd android
./gradlew clean
./gradlew build
./gradlew assembleDebug
./gradlew installDebug


ionic build; ionic cap copy android; cd android; ./gradlew clean; ./gradlew build; ./gradlew assembleDebug; ./gradlew installDebug


# Configurando o PouchDB/SQLite

pnpm i cordova-sqlite-storage  
pnpm i pouchdb  
pnpm i pouchdb-adapter-cordova-sqlite  
pnpm i @types/pouchdb  


##### polyfills.ts
```ts
(window as any).global = window;
```

#### tsconfig.app.json
```json
"types": ["node"]
```

#### tsconfig.json
```json
    "esModuleInterop":true,
    "moduleResolution": "node",
```

# Configurando OffLineFirst

pnpm i @capacitor/network

# Sync com o CouchDB

É possível usar detecção de rede e controlar a sincronização, ou usar o sync do PouchDB
O sync pode ficar automático quando houver qualquer alteração (live:true) ou pode ser na chamada do método sync(..,{live:false})
É possível apenas enviar os dados: db.replicate.to(remoteDB, [options]);  
Ou apenas receber os dados: db.replicate.from(remoteDB, [options]);  


# Subindo o CouchDB

cd couch;  
sudo service docker start  
docker-compose up -d  
http://localhost:5984/  
http://localhost:5984/_utils/  
**accessar o bash do couchdb server:**  
docker exec -it couch_couchserver_1 bash  


**configurando cors:**  
pnpm install -g add-cors-to-couchdb
add-cors-to-couchdb http://localhost:5984 -u admin -p 123456

**ssl:**  
[ssl]
enable = true
cert_file = /etc/couchdb/cert/couchdb.pem
key_file = /etc/couchdb/cert/privkey.pem

**_users database:**  
criar o database _users

**usando openssl:**  
shell> mkdir /etc/couchdb/cert
shell> cd /etc/couchdb/cert
shell> openssl genrsa > privkey.pem
shell> openssl req -new -x509 -key privkey.pem -out couchdb.pem -days 1095

entrar no container:  
docker exec -it couch_couchserver_1 bash  

shell> chmod 600 privkey.pem couchdb.pem
shell> chown couchdb privkey.pem couchdb.pem

**para alterar o arquivo local.ini:**  
sudo chmod +w ./etc/local.ini; sudo chmod g+w ./etc/local.ini; sudo chown element ./etc/local.ini


**connectando do Android no CouchDB server:**  
É necessário um certificado de alguma entidade emissora, não funciona self-cert  


**rodar o emulador por fora do Android Studio**  
emulator -avd Nexus_10_API_30 -gpu host -dns-server 8.8.8.8 -writable-system

**ativar compartilhamento de pastas no emulador, ativar wifi, compartilhar clipboard e arquivos, SSL self signed certificates**  
https://forum.ionicframework.com/t/ionic-cant-make-https-request-calls/240804
https://httptoolkit.com/blog/android-11-trust-ca-certificates/
https://stackoverflow.com/questions/30434451/how-to-copy-files-to-android-emulator-instance
https://stackoverflow.com/questions/71854047/install-ca-certificate-on-android-emulator
https://stackoverflow.com/questions/42736038/android-emulator-not-able-to-access-the-internet
https://stackoverflow.com/questions/50670547/android-studio-android-emulator-wifi-connected-with-no-internet?page=1&tab=scoredesc#tab-top
https://stackoverflow.com/questions/66362274/how-to-cold-boot-emulator-using-command-linecmd
https://stackoverflow.com/questions/50420374/how-to-cold-boot-emulators-running-api-27-on-android-studio
https://askubuntu.com/questions/346838/how-do-i-configure-my-dns-settings-in-ubuntu-server
https://stackoverflow.com/questions/50670547/android-studio-android-emulator-wifi-connected-with-no-internet
https://stackoverflow.com/questions/72377424/how-to-recreate-a-docker-container-without-docker-compose

é necessário adicionar DNS no Ubuntu 8888 e 8884 na ethernet, isso pode ser feito via interface gráfica, tem que configurar DHCP addresses only e DNS servers 8.8.8.8, 8.8.8.4  
é necessário desabilitar proxy no emulador e rodar usando -gpu host -dns-server 8.8.8.8  
para ativar clipboard shared é necessário iniciar o emulado com -writable-system  
ssl é necessário adicionar o certificado em Settings do Android, Security, instalar o certificado, antes disso copiar arrastando o certificado dragging and dropping da pasta do computador no desktop do Android, se não aparecer, reinicie o Android com cold-boot usando -no-snapshot-load  

**permitindo self signed certificates no android**  
pnpm i @jcesarmobile/ssl-skip
npx cap sync

