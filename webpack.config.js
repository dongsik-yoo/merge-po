'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        vendor: ['tui-grid', 'lodash', 'pofile']
    },
    output: {
        filename: 'bundle/[name].js',
        library: ['POLoader'],
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new ExtractTextPlugin('[name].css')
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: 'public/',
        hot: true,
        inline: true,
        filename: 'bundle/[name].js'
    }
};
