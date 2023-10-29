const express = require("express");
const router = express.Router();
const path = require("path");

let DIR = "./build";
//let DIR = "./dist";

let AdminTools = null;

if(DIR == "./build")
{
    AdminTools = require(`${DIR}/js/server/admin.js`);
}
else
{
    AdminTools = require(`./build/js/server/admin.js`);
    //AdminTools = require(`${DIR}/js/admin.js`);
}

const admin_tools = new AdminTools();
let users_table = admin_tools.get_users();


// home page
router.get('/', (request, response) => {
    response.redirect("/admin_panel");
})

router.get('/admin_panel', (request, response) => {
    admin_tools.set_selected_user(0);
    response.sendFile(path.join(__dirname, `${DIR}/html/admin_panel.html`));
});

router.post("/get_users", (request, response) => {
    response.send(
        JSON.stringify({
            "users_table": users_table
        })
    );
})

router.post("/get_selected_user", (request, response) => {
    response.send(
        JSON.stringify({
            "user_id": admin_tools.get_selected_user()
        })
    )
})

router.post("/get_user_news", (request, response) => {
    response.send(
        JSON.stringify({
            "news": admin_tools.get_user_news(request.body.user_id)
        })
    )
})

router.post("/change_user_info", (request, response) => {
    admin_tools.change_user_info(request.body.id, request.body);
    users_table = admin_tools.get_users();
    response.send("Success change user info");
})

router.get("/users/:user_id([0-9]{1,})/friends", (request, response) => {
    response.sendFile(path.join(__dirname, `${DIR}/html/friends.html`));
});

router.get("/users/:user_id([0-9]{1,})/news", (request, response) => {
    response.sendFile(path.join(__dirname, `${DIR}/html/news.html`));
})

router.get("/users/:user_id([0-9]{1,})", (request, response) => {
    admin_tools.set_selected_user(request.params.user_id);
    response.sendFile(path.join(__dirname, `${DIR}/html/user.html`));
});


router.get("*", (request, response)=>{
    response.status(404); // Ошибка – нет такой страницы
    response.end("Page not found");
});


module.exports = router;