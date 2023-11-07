const express = require("express");
const app = express();
const file_system = require("fs");
const cors = require("cors");
const socket = require("socket.io");


const PORT = 3000;
https_options = {
    key: file_system.readFileSync('./cert/key.pem', 'utf-8'),
    cert: file_system.readFileSync('./cert/cert.pem', 'utf-8')
};

app.use(
    cors({
        origin: ['http://localhost:4200'],
        credentials: true,
    })
);

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


function add_news_handler(data){
    //console.log(data);
    all_news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
    let is_contain_id = false;

    for(let idx = 0; idx < all_news.length; idx++)
    {
        if(all_news[idx].id == data.user_id)
        {
            is_contain_id = true;
            all_news[idx].posts.push(data.new_post);
        }
    }

    if(!is_contain_id)
    {
        all_news.push(
            {
                "id": data.user_id,
                "posts": [data.new_post]
            }
        )
    }
    file_system.writeFileSync('./json/news.json', JSON.stringify({"news": all_news}));
}


module.exports = add_news_handler;

const io = socket(SERVER, {
    cors: {
        origin: "*",
        methods: "*"
    }
})
io.on("connection", socket => {
    socket.on("add_news_client", data => {
        add_news_handler(data);
        io.sockets.emit("add_news_server", data);
    })
})


SERVER.listen(PORT);
console.log(`Server working using ${PORT} port on https://localhost:${PORT}/`);