ionic build
ionic cap copy android
cd android
./gradlew clean
./gradlew build
./gradlew assembleDebug
./gradlew installDebug


ionic build; ionic cap copy android; cd android; ./gradlew clean; ./gradlew build; ./gradlew assembleDebug; ./gradlew installDebug



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

