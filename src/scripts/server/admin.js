const file_system = require("fs");


class AdminTools
{
    constructor() 
    {
        this.admin_id = 0;
        this.selected_user = 0;
        this.all_users = JSON.parse(file_system.readFileSync('./json/users.json', 'utf8')).users;
        this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
        this.messages = JSON.parse(file_system.readFileSync('./json/messages.json', 'utf-8')).messages;
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
        this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));

        let user_news = [];

        for(let idx = 0; idx < this.news.length; idx++)
        {
            let posts = this.news[idx];
            if(parseInt(user_id) == parseInt(posts.id))
            {
                const user_info = this.all_users[user_idx];

                user_news.push({
                    name: user_info.name,
                    avatar: user_info.avatar,
                    posts: posts.posts
                });
            }
        }

        return user_news;
    }

    get_user_messages(user_id, friend_id)
    {
        user_id = parseInt(user_id)
        friend_id = parseInt(friend_id);

        this.messages = JSON.parse(file_system.readFileSync('./json/messages.json', 'utf-8')).messages;
        let first_id = Math.min(user_id, friend_id);
        let second_id = Math.max(user_id, friend_id);
        for(let idx = 0; idx < this.messages.length; idx++){
            let message_info = this.messages[idx];
            if(first_id == message_info.first_user_id && second_id == message_info.second_user_id)
            {
                return {
                    "user": this.all_users[this.all_users.map((user) => {
                        return parseInt(user.id);
                    }).indexOf(user_id)],
                    "friend": this.all_users[this.all_users.map((user) => {
                        return parseInt(user.id);
                    }).indexOf(friend_id)],
                    "messages": message_info.messages
                };
            }
        }
        return null;
    }

    get_friends_news(user_id)
    {
        this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
        const user_idx = this.all_users.map((user) => {
            return parseInt(user.id);
        }).indexOf(parseInt(user_id));
        let friends_id = this.all_users[user_idx].friends;
        if (!friends_id){
            return null;
        }
        let friends_news = [];

        for(let idx = 0; idx < this.news.length; idx++)
        {
            let posts = this.news[idx];
            if(friends_id.includes(posts.id))
            {
                const friend_idx = this.all_users.map((user) => {
                    return parseInt(user.id);
                }).indexOf(parseInt(posts.id));
                const friend_info = this.all_users[friend_idx];

                friends_news.push({
                    name: friend_info.name,
                    avatar: friend_info.avatar,
                    posts: posts.posts
                });
            }
        }

        return friends_news;
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

    create_account(account_info)
    {
        let max_id = 1;
        for(let idx = 0; idx < this.all_users.length; idx++)
        {
            max_id = Math.max(this.all_users[idx].id, max_id);
        }

        let new_user = {
            "id": max_id + 1,
            "password": account_info.password,
            "name": account_info.name,
            "date": account_info.date,
            "email": account_info.email,
            "avatar": "default.png",
            "role": "Пользователь",
            "status": "Активный",
            "friends": null
        }
        this.all_users.push(new_user);

        return {
            "user": new_user
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

        if(!this.all_users[user_idx].friends){
            this.all_users[user_idx].friends = [parseInt(friend_id)];

            return {
                success: true,
                reason: 'Все ок',
                user: this.all_users[user_idx]
            }
        }

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