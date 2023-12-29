# Server for the [boats_rental_frontend](https://github.com/MariaRiosNavarro/boat_rental_frontend) -> Fullstack Boats Rental Aplication

## [RENDER DEPLOYMENT SERVER](https://boat-rental-server.onrender.com/)

## [RENDER DEPLOYMENT FRONTEND](https://boat-rental-frontend.onrender.com/)

npm init -y

npm i express

npm i mongodb cors dotenv uuid multer

npm i mongoose

npm i cloudinary

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

- Create .env file and write inside (I dont use in my proyect the CLOUDINARY_URL, but i saved it for the future).

- You need this secrets (mongodbAtlas + cloudinary) in your deployment too

```javascript


PORT=YourPort
MONGODB_URI=yourMongoDBAtlaslike(mongodb+srv:...)

CLOUDINARY_URL=yourCLOUDINARY_Url
FRONTEND_URL=YourDeployedUrlUsedInYourDeployment

CLOUDINARY_CLOUD_NAME=yourCLOUDINARYName
CLOUDINARY_API_KEY=yourCLOUDINARYKey
CLOUDINARY_SECRET=yourCLOUDINARYSecret

```
