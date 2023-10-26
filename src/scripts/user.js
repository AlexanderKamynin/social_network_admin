let current_user = null;


$(document).ready(async() => {
    const current_user_id = await get_selected_user();
    users = await get_users_table();
    current_user = users[users.map((user) => {
        return parseInt(user.id);
    }).indexOf(parseInt(current_user_id))];


    $(".user_info").append(`
    <p>ID: ${current_user_id}</p>
    <p>Имя: ${current_user.name}</p>
    <p>Дата рождения: ${current_user.date}</p>
    <p>email: ${current_user.email}</p>
    `);

    document.querySelector(".save").addEventListener('click', function(event) {
        save_changes();
    });

    document.querySelector(".friends").addEventListener('click', function(event) {
        go_to_page(`/users/${current_user.id}/friends`);
    });

    document.querySelector(".back").addEventListener('click', function(event) {
        go_to_page('/');
    });
})


async function save_changes() 
{
    const current_user_id = current_user.id;
    const name = document.querySelector(".name").value;
    const date = document.querySelector(".date").value;
    const email = document.querySelector(".email").value;
    const role = document.querySelector(".role").value;
    const status = document.querySelector(".status").value;

    let data = {
        id: current_user_id,
        name: name,
        date: date,
        email: email,
        role: role,
        status: status
    };

    await change_user_info(data);
}