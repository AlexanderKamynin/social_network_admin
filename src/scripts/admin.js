const file_system = require("fs");


class AdminTools
{
    constructor() 
    {
        this.admin_id = 0;
        this.all_users = JSON.parse(file_system.readFileSync('./json/users.json', 'utf8'));
    }

    get_users()
    {
        return this.all_users
    }
}


module.exports = AdminTools;