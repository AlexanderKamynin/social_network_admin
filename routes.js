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
    response.render('admin_panel');
});

router.post("/get_users", (request, response) => {
    response.send(
        JSON.stringify({
            "users_table": users_table
        })
    );
})

router.post("/change_user_info", (request, response) => {
    admin_tools.change_user_info(request.body.id, request.body);
    users_table = admin_tools.get_users();
    response.send("Success change user info");
})

router.get("/users/:user_id([0-9]{1,})", (request, response) => {
    response.render("user");
});


router.get("*", (request, response)=>{
    response.status(404); // Ошибка – нет такой страницы
    response.end("Page not found");
});


module.exports = router;