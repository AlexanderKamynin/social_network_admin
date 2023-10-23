

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

async function get_users_table()
{
    let result = null;
    await send_request("post", "/get_users")
    .then(res => res.json())
    .then(res => {
        result = res["users_table"]["users"];
    })
    
    return result;
}