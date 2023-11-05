let selected_user_id = null;


$(document).ready(async() => {
    selected_user_id = await get_selected_user();
    let news = await get_friends_news(selected_user_id);
    let posts_number = 1;

    if (news)
    {
        for(let idx = 0; idx < news.length; idx++)
        {
            const friend_news = news[idx];

            let description = `
            <div class="description">
            <img src='/src/img/${friend_news.avatar}'>
            <p>${friend_news.name}</p>
            </div>
            `

            $(".news").append(`<div class="friend_news" id="${posts_number}">${description}</div>`);
            for(let post_idx = 0; post_idx < friend_news.posts.length; post_idx++)
            {
                $(".news").children(`#${posts_number}`).append(`<p>${friend_news.posts[post_idx]}</p>`);
            }

            posts_number++;
        }
    }
    else
    {
        $(".news").append(`<div class='no_news'>Нет новостей</div>`);
    }

    document.querySelector(".back").addEventListener('click', function(event) {
        go_to_page(`/users/${selected_user_id}`);
    });
})
