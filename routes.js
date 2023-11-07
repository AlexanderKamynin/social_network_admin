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

router.get("/get_users", (request, response) => {
    response.send(
        JSON.stringify({
            "users_table": users_table
        })
    );
});

router.post("/auth", (request, response) => {
    auth_result = admin_tools.authenticate(request.body.email, request.body.password);

    response.send(
        JSON.stringify({
            "accepted": auth_result.accepted,
            "reason": auth_result.reason,
            "user": auth_result.user
        })
    )
});

router.post("/delete_avatar", (request, response) => {
    new_user_data = admin_tools.delete_avatar(request.body.user_id);

    response.send(
        JSON.stringify({
            "new_user_data": new_user_data
        })
    );
});

router.post("/upload_avatar", (request, response) => {
    result = admin_tools.upload_avatar(request.body.user_id, request.body.name, request.body.type);

    response.send(
        JSON.stringify({
            "success": result.success,
            "reason": result.reason,
            "new_user_data": result.user
        })
    );
})

router.post("/add_friend", (request, response) => {
    result = admin_tools.add_friend(request.body.user_id, request.body.friend_id);

    response.send(
        JSON.stringify({
            "success": result.success,
            "reason": result.reason,
            "new_user_data": result.user
        })
    )
})

router.post("/delete_friend", (request, response) => {
    result = admin_tools.delete_friend(request.body.user_id, request.body.friend_id);

    response.send(
        JSON.stringify({
            "success": result.success,
            "reason": result.reason,
            "new_user_data": result.user
        })
    )
})

router.post("/add_user_news", (request, response) => {
    console.log(request.body.data);
    response.send();
})

router.get("/get_user_friends/:user_id([0-9]{1,})", (request, response) => {
    friends = admin_tools.get_user_friends(request.params.user_id);

    response.send(
        JSON.stringify({
            "friends": friends
        })
    )
});

router.get("/get_selected_user", (request, response) => {
    response.send(
        JSON.stringify({
            "user_id": admin_tools.get_selected_user()
        })
    )
})

router.get("/get_user_news/:user_id([0-9]{1,})", (request, response) => {
    response.send(
        JSON.stringify({
            "news": admin_tools.get_user_news(request.params.user_id)
        })
    )
})

router.get("/get_friends_news/:user_id([0-9]{1,})", (request, response) => {
    response.send(
        JSON.stringify({
            "news": admin_tools.get_friends_news(request.params.user_id)
        })
    )
})

router.get("/get_user_messages/:user_id([0-9]{1,})/:friend_id([0-9]{1,})", (request, response) => {
    response.send(
        JSON.stringify({
            "messages": admin_tools.get_user_messages(request.params.user_id, request.params.friend_id)
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