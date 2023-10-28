const webpack = require("webpack");

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const pages = fs.readdirSync("./src/views").filter(name => name.endsWith(".pug"));

module.exports = {
    target: "node",
    mode: "development",
    devtool: false,
    entry: {
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
                test: /\/src\/scripts\/*.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\/src\/styles\/*.less$/,
                use: [
                    "style-loader",
                    'css-loader',
                    'less-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\/src\/views\/*.pug$/,
                use: [
                    'pug-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        ...pages.map(file => new HtmlWebpackPlugin({
            scriptLoading: "blocking",
            template: `./src/views/${file}`,
            templateParameters: {dir: "./dist"},
            filename: `./html/${file.replace(/\.pug/, '.html')}`,
            chunks: [file.replace(/\.pug/, "")]
        })),

    ]
};