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

function add_message_handler(data){
    //console.log(data);
    all_messages = JSON.parse(file_system.readFileSync('./json/messages.json', 'utf-8')).messages;
    let is_contain_dialog = false;

    for(let idx = 0; idx < all_messages.length; idx++)
    {
        if(
            (all_messages[idx].first_user_id == Math.min(parseInt(data.user_id), parseInt(data.friend_id))) &&
            (all_messages[idx].second_user_id == Math.max(parseInt(data.user_id), parseInt(data.friend_id)))
        )
        {
            is_contain_dialog = true;
            all_messages[idx].messages.push(
                {
                    "sender": data.user_id,
                    "message": data.new_message
                }
            )
        }
    }

    if(!is_contain_dialog)
    {
        all_messages.push(
            {
                "first_user_id": Math.min(parseInt(data.user_id), parseInt(data.friend_id)),
                "second_user_id": Math.max(parseInt(data.user_id), parseInt(data.friend_id)),
                "messages": [
                    {
                        "sender": data.user_id,
                        "message": data.new_message
                    }
                ]
            }
        )
    }

    file_system.writeFileSync('./json/messages.json', JSON.stringify({"messages": all_messages}));
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

    socket.on("add_message_client", data => {
        add_message_handler(data);
        io.sockets.emit("add_message_server", data);
    })
})


SERVER.listen(PORT);
console.log(`Server working using ${PORT} port on https://localhost:${PORT}/`);

module.exports = SERVER;