const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const AdminTools = require("./src/scripts/admin.js")
const admin_tools = new AdminTools();
let users_table = admin_tools.get_users();


// home page
router.get('/', (request, response) => {
    response.redirect("/admin_panel");
})

router.get('/admin_panel', (request, response) => {
    admin_tools.set_selected_user(0);
    response.render('admin_panel');
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
    response.render("friends");
});

router.get("/users/:user_id([0-9]{1,})/news", (request, response) => {
    response.render("news");
})

router.get("/users/:user_id([0-9]{1,})", (request, response) => {
    admin_tools.set_selected_user(request.params.user_id);
    response.render("user");
});


router.get("*", (request, response)=>{
    response.status(404); // Ошибка – нет такой страницы
    response.end("Page not found");
});


module.exports = router;