let selected_user_id = null;


$(document).ready(async() => {
    selected_user_id = await get_selected_user();
    let users = await get_users_table();

    const current_user = users[users.map((user) => {
        return parseInt(user.id);
    }).indexOf(parseInt(selected_user_id))];
    const friends = current_user.friends;

    if(friends)
    {
        $(".friends_table").append("<ul class='friends_list'></ul>")
        
        for(let idx = 0; idx < friends.length; idx++)
        {
            const friend = users[users.map((user) => {
                return parseInt(user.id);
            }).indexOf(parseInt(friends[idx]))];
            $(".friends_list").append(`<li>${friend.id}. ${friend.name}, дата-рождения: ${friend.date}, email: ${friend.email}, role: ${friend.role}, status: ${friend.status}</li>`);
        }
    }
    else
    {
        $(".friends_table").append("<p>У пользователя нет друзей =(</p>");
    }

    document.querySelector(".back").addEventListener('click', function(event) {
        go_to_page(`/users/${selected_user_id}`);
    });
})
