import { get_selected_user, get_users_table } from "./request";

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
        for(let idx = 0; idx < friends.length; idx++)
        {
            const friend = users[users.map((user) => {
                return parseInt(user.id);
            }).indexOf(parseInt(friends[idx]))];

            let friend_info = `
            <img src='/src/img/${friend.avatar}'>
            <div class="description">
            <p>ID: ${friend.id}</p>
            <p>Имя: ${friend.name}</p>
            <p>Дата рождения: ${friend.date}</p>
            <p>email: ${friend.email}</p>
            <p>Роль: ${friend.role}</p>
            <p>Статус: ${friend.status}<p>
            </div>
            `;

            $(".friends_table").append(`<div class="friend_info">${friend_info}</div>`);
        }
    }
    else
    {
        $(".friends_table").append(`<div class='no_friend'>У пользователя нет друзей =(</div>`);
    }

    document.querySelector(".back").addEventListener('click', function(event) {
        go_to_page(`/users/${selected_user_id}`);
    });
})
