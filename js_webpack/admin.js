const file_system = require("fs");


class AdminTools
{
    constructor() 
    {
        this.admin_id = 0;
        this.selected_user = 0;
        this.all_users = JSON.parse(file_system.readFileSync('./json/users.json', 'utf8')).users;
        this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
    }

    get_users()
    {
        return this.all_users
    }

    get_selected_user()
    {
        return this.selected_user;
    }

    get_user_news(user_id)
    {
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));
        let friends_id = this.all_users[user_idx].friends;
        if (!friends_id){
            return null;
        }
        let user_news = [];

        for(let idx = 0; idx < this.news.length; idx++)
        {
            let posts = this.news[idx];
            if(friends_id.includes(posts.id))
            {
                user_news.push({
                    id: posts.id,
                    posts: posts.posts
                });
            }
        }

        return user_news;
    }

    set_selected_user(user_id)
    {
        this.selected_user = parseInt(user_id);
    }

    change_user_info(user_id, user_info)
    {
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));
        
        for(const param in user_info)
        {
            if (user_info[param])
            {
                this.all_users[user_idx][param] = user_info[param];
            }
        }
    }
}


module.exports = AdminTools;