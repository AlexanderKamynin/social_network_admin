let users = null;

$(document).ready(async() => {
    users = await get_users_table("post", "/get_users");

    $(".users_table").append("<ul class='users_list'></ul>")
    
    for(user_num in users)
    {
        $(".users_list").append(`<li>${users[user_num].id}. ${users[user_num].name}</li>`);
    }
})