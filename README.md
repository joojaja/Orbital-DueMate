# DueMate README

## DueMate
[![My Skills](https://skillicons.dev/icons?i=html,css,js,react,spring,vercel,supabase,docker)](https://skillicons.dev)

DueMate is a Collaborative Calendar & Task tracker Web App

Read the full README [here](https://docs.google.com/document/d/15fy2QGhf0_RZ2yMe-tuj9IIIkk6qiEsBR7B783kihD0/edit?tab=t.0)

Completed as part of NUS Orbital – Apollo 11

## What I did and learnt
- Adopted 2-week agile sprints based on milestones and deadlines
- Held weekly standup with project partner to plan the features to work on
- Integrated JSON Web Token (JWT) for secure web authentication
- Utilised automated testing with JUnit and CI/CD pipelines
- React, PostgreSQL, Spring Boot, deployed with Vercel, Supabase, Docker

## Features
- Login & Register
- Two Factor Authentication
- Calendar (add, view, delete events)
- To-do List (add, view, delete tasks)
- Gamification (streaks, exp)

## Launching DueMate
### Docker



### Manual
#### Front-end Requirements
1. NodeJS
2. Create .env file
  > REACT_APP_API_URL={YOUR BACKEND URL eg. http://localhost:8081}
3. Edit APIURL

```bash
cd frontend  
npm install  
npm start  
```
#### Back-end Requirements
1. Java 24
2. Maven
3. PostgreSQL
4. Create a database
5. Setup your user and password in PgAdmin4
6. Create .env file
  > PORT=8081  
  > DB_URL={YOUR DATABASE URL eg. jdbc:postgresql://localhost:5432/orbitaldb}  
  > DB_USER={YOUR DATABASE USER}  
  > DB_PW={YOUR DATABASE PASSWORD}  
  > JWT_SECRET={YOUR JWT SECRET KEY}  
  > EMAIL_USER={THE EMAIL ADDRESS TO SEND EMAILS TO USERS}  
  > EMAIL_PASSWORD={THE EMAIL PASSWORD CONFIGURED ON GMAIL's APP PASSWORD}  
7. Edit APIURL

```bash  
cd backend  
mvn clean install  
mvn spring-boot:run  
```
The backend server should run on port 8081 (specified in application.properties file)
