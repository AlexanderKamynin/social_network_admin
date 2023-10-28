let users = null;

$(document).ready(async() => {
    users = await get_users_table();

    $(".users_table").append("<ul class='users_list'></ul>")
    
    for(let user_num in users)
    {
        const user = users[user_num];
        $(".users_list").append(`<li><a href='/users/${user.id}'>${user.id}. ${user.name}, дата-рождения: ${user.date}, email: ${user.email}, role: ${user.role}, status: ${user.status}</a></li>`);
    }
})