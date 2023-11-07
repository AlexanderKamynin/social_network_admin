"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var file_system = require("fs");
var AdminTools = /*#__PURE__*/function () {
  function AdminTools() {
    _classCallCheck(this, AdminTools);
    this.admin_id = 0;
    this.selected_user = 0;
    this.all_users = JSON.parse(file_system.readFileSync('./json/users.json', 'utf8')).users;
    this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
  }
  _createClass(AdminTools, [{
    key: "get_users",
    value: function get_users() {
      return this.all_users;
    }
  }, {
    key: "get_selected_user",
    value: function get_selected_user() {
      return this.selected_user;
    }
  }, {
    key: "get_user_friends",
    value: function get_user_friends(user_id) {
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      var friends_id = this.all_users[user_idx].friends;
      if (!friends_id) {
        return null;
      }
      var friends = [];
      for (var idx = 0; idx < friends_id.length; idx++) {
        var friend = this.all_users[this.all_users.map(function (user) {
          return parseInt(user.id);
        }).indexOf(parseInt(friends_id[idx]))];
        friends.push(friend);
      }
      return friends;
    }
  }, {
    key: "get_user_news",
    value: function get_user_news(user_id) {
      this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      var user_news = [];
      for (var idx = 0; idx < this.news.length; idx++) {
        var posts = this.news[idx];
        if (parseInt(user_id) == parseInt(posts.id)) {
          var user_info = this.all_users[user_idx];
          user_news.push({
            name: user_info.name,
            avatar: user_info.avatar,
            posts: posts.posts
          });
        }
      }
      return user_news;
    }
  }, {
    key: "get_friends_news",
    value: function get_friends_news(user_id) {
      this.news = JSON.parse(file_system.readFileSync('./json/news.json', 'utf-8')).news;
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      var friends_id = this.all_users[user_idx].friends;
      if (!friends_id) {
        return null;
      }
      var friends_news = [];
      for (var idx = 0; idx < this.news.length; idx++) {
        var posts = this.news[idx];
        if (friends_id.includes(posts.id)) {
          var friend_idx = this.all_users.map(function (user) {
            return parseInt(user.id);
          }).indexOf(parseInt(posts.id));
          var friend_info = this.all_users[friend_idx];
          friends_news.push({
            name: friend_info.name,
            avatar: friend_info.avatar,
            posts: posts.posts
          });
        }
      }
      return friends_news;
    }
  }, {
    key: "set_selected_user",
    value: function set_selected_user(user_id) {
      this.selected_user = parseInt(user_id);
    }
  }, {
    key: "change_user_info",
    value: function change_user_info(user_id, user_info) {
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      for (var param in user_info) {
        if (user_info[param]) {
          this.all_users[user_idx][param] = user_info[param];
        }
      }
    }
  }, {
    key: "authenticate",
    value: function authenticate(email, password) {
      var auth_info = {};
      var user_idx = this.all_users.map(function (user) {
        return user.email;
      }).indexOf(email);
      if (user_idx == -1) {
        auth_info = {
          accepted: false,
          user: null,
          reason: "Нет пользователя с таким email"
        };
      } else if (this.all_users[user_idx].password === password) {
        auth_info = {
          accepted: true,
          user: this.all_users[user_idx],
          reason: "Успешная аутентификация"
        };
      } else {
        auth_info = {
          accepted: false,
          user: null,
          reason: "Неверный пароль"
        };
      }
      return auth_info;
    }
  }, {
    key: "upload_avatar",
    value: function upload_avatar(user_id, img_name, img_type) {
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      if (img_type.split('/')[0] !== "image") {
        return {
          success: false,
          reason: 'Неправильный формат для изображения',
          user: this.all_users[user_idx]
        };
      } else if (!file_system.existsSync('./src/img/' + img_name)) {
        return {
          success: false,
          reason: 'Выбранного файла не существует',
          user: this.all_users[user_idx]
        };
      }
      this.all_users[user_idx].avatar = img_name;
      return {
        success: true,
        reason: 'Все ок',
        user: this.all_users[user_idx]
      };
    }
  }, {
    key: "delete_avatar",
    value: function delete_avatar(user_id) {
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      this.all_users[user_idx].avatar = "default.png";
      return this.all_users[user_idx];
    }
  }, {
    key: "add_friend",
    value: function add_friend(user_id, friend_id) {
      friend_id = parseInt(friend_id);
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      var friend_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(friend_id));
      if (this.all_users[user_idx].friends.indexOf(parseInt(friend_id)) != -1) {
        return {
          success: false,
          reason: 'Пользователь уже ваш друг',
          user: this.all_users[user_idx]
        };
      } else if (user_id == friend_id) {
        return {
          success: false,
          reason: 'Вам не с кем дружить?(',
          user: this.all_users[user_idx]
        };
      }
      if (friend_idx != -1) {
        this.all_users[user_idx].friends.push(parseInt(friend_id));
        return {
          success: true,
          reason: 'Все ок',
          user: this.all_users[user_idx]
        };
      }
      return {
        success: false,
        reason: 'Пользователя с таким id не существует',
        user: this.all_users[user_idx]
      };
    }
  }, {
    key: "delete_friend",
    value: function delete_friend(user_id, friend_id) {
      friend_id = parseInt(friend_id);
      var user_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(user_id));
      var friend_idx = this.all_users.map(function (user) {
        return parseInt(user.id);
      }).indexOf(parseInt(friend_id));
      if (user_id == friend_id) {
        return {
          success: false,
          reason: 'Ну и ну... сам себя стереть хочишь?',
          user: this.all_users[user_idx]
        };
      }
      if (friend_idx != -1) {
        if (this.all_users[user_idx].friends.indexOf(friend_id) != -1) {
          this.all_users[user_idx].friends.splice(this.all_users[user_idx].friends.indexOf(friend_id), 1);
          return {
            success: true,
            reason: 'Все ок',
            user: this.all_users[user_idx]
          };
        } else {
          return {
            success: false,
            reason: 'У выбранного пользователя нет такого друга',
            user: this.all_users[user_idx]
          };
        }
      }
      return {
        success: false,
        reason: 'Пользователя с таким id не существует',
        user: this.all_users[user_idx]
      };
    }
  }]);
  return AdminTools;
}();
module.exports = AdminTools;