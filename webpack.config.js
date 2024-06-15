const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './js/tictactoe.js',
    output: {
        filename: 'tictactoe-bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    mode: 'production',
};
