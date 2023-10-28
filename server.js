const express = require("express");
const app = express();
const fs = require("fs");

const PORT = 3000;
https_options = {
    key: fs.readFileSync('./cert/key.pem', 'utf-8'),
    cert: fs.readFileSync('./cert/cert.pem', 'utf-8')
};

app.use(require("express").json());
app.use(require("express").urlencoded({ extended: true }));

const file_upload = require("express-fileupload");
app.use(file_upload());

app.set("view engine", "pug");

const routes = require("./routes");
const {createServer} = require("https");
app.use(require("express").static(__dirname));
app.use("/", routes);


const SERVER = createServer(https_options, app);
SERVER.listen(PORT);
console.log(`Server working using ${PORT} port on https://localhost:${PORT}/`);