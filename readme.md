# Server for the [boats_rental_frontend](https://github.com/MariaRiosNavarro/boat_rental_frontend) -> Fullstack Boats Rental Aplication

## [RENDER DEPLOYMENT SERVER](https://boat-rental-server.onrender.com/)

## [RENDER DEPLOYMENT FRONTEND](https://boat-rental-frontend.onrender.com/)

npm init -y

npm i express

npm i mongodb cors dotenv uuid multer

npm i mongoose

# Config package.json

- in package.json:

"type": "module",

- in package.json in "scripts" add:

"dev": "node --watch app.js"

- create .gitignore file and write inside

```javascript

node_modules/
.vscode/
.env
uploads/

```

- create .env file and write inside

```javascript

PORT=YOURPORT
MONGODB=mongodb://YOURADRESS
DATABASENAME=YOURDBNAME

```
