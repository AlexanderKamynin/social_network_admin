function send_request(method, URL, data=null)
{
    if (data)
    {
        data = JSON.stringify(data);
    }
    
    return fetch(
        URL,
        {
            headers:
            {
                'Content-Type': 'application/json',
            },
            method: method,
            body: data
        }
    )
}

function go_to_page(URL)
{
    document.location.href = URL;
}


async function get_users_table()
{
    let users_table = null;
    await send_request("get", "/get_users")
    .then(res => res.json())
    .then(res => {
        users_table = res["users_table"];
    })
    
    return users_table;
}

async function get_selected_user()
{
    let selected_user = null;
    await send_request("get", "/get_selected_user")
    .then(res => res.json())
    .then(res => {
        selected_user = res["user_id"];
    })

    return selected_user;
}

async function get_friends_news(user_id)
{
    let user_news = null;

    await send_request("get", `/get_friends_news/${user_id}`)
    .then(res => res.json())
    .then(res => {
        user_news = res["news"];
    });

    return user_news;
}

async function change_user_info(user_info)
{
    await send_request("post", "/change_user_info", user_info);

    location.reload();
}


module.exports = {send_request};