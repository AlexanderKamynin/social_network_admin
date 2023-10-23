const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const AdminTools = require("./src/scripts/admin.js")
const admin_tools = new AdminTools();

// home page
router.get('/', (request, response, next) => {
    response.render('admin_panel');
})


router.post("/get_users", (request, response, next) => {
    let users_table = admin_tools.get_users();
    response.send(
        JSON.stringify({
            "users_table": users_table
        })
    );
})


router.get("*", (request, response)=>{
    response.status(404); // Ошибка – нет такой страницы
    response.end("Page not found");
});


module.exports = router;