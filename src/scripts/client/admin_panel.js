let users = null;

$(document).ready(async() => {
    users = await get_users_table();
    
    for(let user_num in users)
    {
        const user = users[user_num];
        let user_info = `
            <img src='/src/img/${user.avatar}'>
            <div class="description">
            <p>ID: ${user.id}</p>
            <p>Имя: ${user.name}</p>
            <p>Дата рождения: ${user.date}</p>
            <p>email: ${user.email}</p>
            <p>Роль: ${user.role}</p>
            <p>Статус: ${user.status}<p>

            <a href='/users/${user.id}'>Подробнее</a>
            </div>
        `;

        $(".users_table").append(`<div class="user_info">${user_info}</div>`);
    }

    document.querySelector(".exit").addEventListener('click', function(event) {
        go_to_page(`http://localhost:4200/profile`);
    });
})