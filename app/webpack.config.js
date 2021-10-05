var path = require('path');

module.exports={
    entry: './components/app.js',
    output: {
        path: path.resolve('../public','dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                loader:'style-loader'
            },
            {
                test: /\.css$/,
                loader:'css-loader'
                
            }
        ]
        
    }
}