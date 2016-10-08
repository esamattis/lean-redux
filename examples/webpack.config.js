var webpack = require("webpack");
var fs = require("fs");

var jsFiles = fs.readdirSync(__dirname).filter(n => n.endsWith(".js"));
var sourceFiles = {};
jsFiles.forEach(filename => {
    sourceFiles[filename] = fs.readFileSync(filename).toString();
});




var config = {
    entry: "./index.js",
    output: {
        path: "dist",
        filename: "bundle.js",
        publicPath: "/dist",
    },
    // devtool: "cheap-module-eval-source-map", // faster
    devtool: "sourceMap",
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel",
                exclude: /node_modules/,
            },

        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "SOURCE": JSON.stringify(sourceFiles),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
    ],
};


module.exports = config;
