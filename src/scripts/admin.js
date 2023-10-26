const file_system = require("fs");


class AdminTools
{
    constructor() 
    {
        this.admin_id = 0;
        this.selected_user = 0;
        this.all_users = JSON.parse(file_system.readFileSync('./json/users.json', 'utf8')).users;
    }

    get_users()
    {
        return this.all_users
    }

    get_selected_user()
    {
        return this.selected_user;
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