

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

function back_to_page(URL)
{
    document.location.href = URL;
}


async function get_users_table()
{
    let result = null;
    await send_request("post", "/get_users")
    .then(res => res.json())
    .then(res => {
        result = res["users_table"];
    })
    
    return result;
}


async function change_user_info(data)
{
    await send_request("post", "/change_user_info", data);

    location.reload();
}