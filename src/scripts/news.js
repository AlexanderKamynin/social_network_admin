let selected_user_id = null;


$(document).ready(async() => {
    selected_user_id = await get_selected_user();
    let news = await get_user_news(selected_user_id);

    if (news)
    {
        for(let idx = 0; idx < news.length; idx++)
        {
            const friend_news = news[idx];

            $(".news").append(`<div id=${friend_news.id}></div>`);
            $(".news").children(`#${friend_news.id}`).append(`<p>ID: ${friend_news.id}</p>`);
            for(let post_idx = 0; post_idx < friend_news.posts.length; post_idx++)
            {
                $(".news").children(`#${friend_news.id}`).append(`<p>${friend_news.posts[post_idx]}</p>`);
            }
        }
    }
    else
    {
        $(".news").append("<p>Нет новостей</p>");
    }

    document.querySelector(".back").addEventListener('click', function(event) {
        go_to_page(`/users/${selected_user_id}`);
    });
})
