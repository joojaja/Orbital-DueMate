# Orbital-DueMate
Repository for Team DueMate's Orbital project


## How to set up and run front-end
---
- Ensure that you nodejs installed

- Create a .env file in frontend folder and add this lines inside:
REACT_APP_API_URL={YOUR BACKEND URL eg. http://localhost:8081}

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

- Create a .env file in backend folder and add this lines inside:
PORT=8081
DB_URL={YOUR DATABASE URL eg. jdbc:postgresql://localhost:5432/orbitaldb}
DB_USER={YOUR DATABASE USER}
DB_PW={YOUR DATABASE PASSWORD}
JWT_SECRET={YOUR JWT SECRET KEY}
EMAIL_USER={THE EMAIL ADDRESS TO SEND EMAILS TO USERS}
EMAIL_PASSWORD={THE EMAIL PASSWORD CONFIGURED ON GMAIL's APP PASSWORD}


```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend server should run on port 8081 (specified in application.properties file)
