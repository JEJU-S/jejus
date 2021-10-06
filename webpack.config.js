
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry : "./src/public/js/main.js",
    mode : "development",
    watch : true, 
    plugins : [new MiniCssExtractPlugin({
        filename : "css/styles.css",
    }),
    ],
    output : {
        filename : "js/start.js",
        path : path.resolve(__dirname, "assets"),
    },

    module : {
        rules : [
            {
                test : /\.js$/,
                use : {
                    loader : "babel-loader",
                    options : {
                        presets : [["@babel/preset-env", {targets : "defaults"}]]
                    },
                },

                test : /\.scss$/,
                use : [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]


            },
        ]

    }
};