const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    entry: {
        app: path.join(__dirname, 'index.tsx')
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {        
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.min.js',
        path: path.join(__dirname, '..', 'api', 'static', 'js'),
        chunkFormat: false
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    optimization: {
        avoidEntryIife: false
    }
};