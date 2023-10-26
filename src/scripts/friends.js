const selected_user_id = null;


$(document).ready(async() => {
    selected_user_id = await get_selected_user();
    let friends = await get_user_friends(selected_user_id);

    document.querySelector(".back").addEventListener('click', function(event) {
        go_to_page(`/users/${selected_user_id}`);
    });
})
