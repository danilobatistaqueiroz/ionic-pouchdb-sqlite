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
docker exec -it YOUR_CONTAINER_NAME bash  



pnpm install -g add-cors-to-couchdb
add-cors-to-couchdb http://localhost:5984 -u admin -p 123456

