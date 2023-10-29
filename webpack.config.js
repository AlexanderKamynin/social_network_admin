const webpack = require("webpack");

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = fs.readdirSync("./src/views").filter(name => name.endsWith(".pug"));

module.exports = {
    target: "node",
    mode: "development",
    devtool: false,
    entry: {
        admin: './src/scripts/server/admin.js',
        admin_panel: './webpack_entry/admin_panel.js',
        user: './webpack_entry/user.js',
        friends: './webpack_entry/friends.js',
        news: './webpack_entry/news.js',
    },
    output: {
        library: "global",
        path: path.resolve(__dirname, 'dist'),
        filename: "./js/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.pug$/,
                use: [
                    'pug-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: './jquery',
            jQuery: 'jquery'
        }),
        ...pages.map(file => new HtmlWebpackPlugin({
            scriptLoading: "blocking",
            template: `./src/views/${file}`,
            templateParameters: {DIR: "/dist"},
            filename: `./html/${file.replace(/\.pug/, '.html')}`,
            chunks: [file.replace(/\.pug/, "")]
        })),
    ],
};