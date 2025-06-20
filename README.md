# Orbital-DueMate
Repository for Team DueMate's Orbital project


## How to set up and run front-end
---
- Ensure that you nodejs installed

```bash
cd frontend
npm install
npm start
```

## How to set up and run back-end
---
- Ensure that you have Java 24 installed (```java --version```)
- Ensure that you have installed Maven
- Ensure you have PostgreSQL installed already
- Create a database
- Ensure that you have setup your user and password in PgAdmin4 already

Go to backend/src/main/java/com/example/resources/application.properties and edit this three things

spring.datasource.url=jdbc:postgresql://localhost:5432/{change to your database name}

spring.datasource.username={change to your username}

spring.datasource.password={change to your password}

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend server should run on port 8081 (specified in application.properties file)

