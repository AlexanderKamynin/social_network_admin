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

    get_user_friends(user_id)
    {
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));
        let friends_id = this.all_users[user_idx].friends;
        if (!friends_id){
            return null;
        }

        let friends = [];
        for(let idx = 0; idx < friends_id.length; idx++)
        {
            let friend = this.all_users[this.all_users.map((user) => {
                return parseInt(user.id)
            }).indexOf(parseInt(friends_id[idx]))];
            friends.push(friend);
        }

        return friends;
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
                const friend_idx = this.all_users.map((user) => {
                    return parseInt(user.id);
                }).indexOf(parseInt(posts.id));
                const friend_info = this.all_users[friend_idx];

                user_news.push({
                    name: friend_info.name,
                    avatar: friend_info.avatar,
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

    authenticate(email, password)
    {
        let auth_info = {}
        const user_idx = this.all_users.map((user) => {
            return user.email;
        }).indexOf(email);

        if(user_idx == -1)
        {
            auth_info = {
                accepted: false,
                user: null,
                reason: "Нет пользователя с таким email"
            };
        } 
        else if(this.all_users[user_idx].password === password)
        {
            auth_info = {
                accepted: true,
                user: this.all_users[user_idx],
                reason: "Успешная аутентификация"
            };
        }
        else {
            auth_info = {
                accepted: false,
                user: null,
                reason: "Неверный пароль"
            };
        }

        return auth_info;
    }

    upload_avatar(user_id, img_name, img_type)
    {
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));

        if(img_type.split('/')[0] !== "image")
        {
            return {
                success: false,
                reason: 'Неправильный формат для изображения',
                user: this.all_users[user_idx]
            }
        }
        else if(!file_system.existsSync('./src/img/' + img_name))
        {
            return {
                success: false,
                reason: 'Выбранного файла не существует',
                user: this.all_users[user_idx]
            }
        }

        this.all_users[user_idx].avatar = img_name;
        return {
            success: true,
            reason: 'Все ок',
            user: this.all_users[user_idx]
        }
    }

    delete_avatar(user_id)
    {
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));

        this.all_users[user_idx].avatar = "default.png";
        return this.all_users[user_idx];
    }

    add_friend(user_id, friend_id)
    {
        friend_id = parseInt(friend_id);

        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));

        const friend_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(friend_id));

        if(this.all_users[user_idx].friends.indexOf(parseInt(friend_id)) != -1){
            return {
                success: false,
                reason: 'Пользователь уже ваш друг',
                user: this.all_users[user_idx]
            }
        }
        else if (user_id == friend_id) {
            return {
                success: false,
                reason: 'Вам не с кем дружить?(',
                user: this.all_users[user_idx]
            }
        }

        if(friend_idx != -1){
            this.all_users[user_idx].friends.push(parseInt(friend_id));

            return {
                success: true,
                reason: 'Все ок',
                user: this.all_users[user_idx]
            }
        }
        
        return {
            success: false,
            reason: 'Пользователя с таким id не существует',
            user: this.all_users[user_idx]
        }
    }

    delete_friend(user_id, friend_id)
    {
        friend_id = parseInt(friend_id);

        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));

        const friend_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(friend_id));

        if (user_id == friend_id) {
            return {
                success: false,
                reason: 'Ну и ну... сам себя стереть хочишь?',
                user: this.all_users[user_idx]
            }
        }

        if(friend_idx != -1){
            if (this.all_users[user_idx].friends.indexOf(friend_id) != -1){
                this.all_users[user_idx].friends.splice(this.all_users[user_idx].friends.indexOf(friend_id),1);

                return {
                    success: true,
                    reason: 'Все ок',
                    user: this.all_users[user_idx]
                }
            }
            else {
                return {
                    success: false,
                    reason: 'У выбранного пользователя нет такого друга',
                    user: this.all_users[user_idx]
                }
            }
        }
        
        return {
            success: false,
            reason: 'Пользователя с таким id не существует',
            user: this.all_users[user_idx]
        }
    }
}


module.exports = AdminTools;