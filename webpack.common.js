module.exports = {
    entry: {
        'app': './src/Server.ts'
    },
    output: {
        path: staticPath,
        filename: '[name].bundle.js',
        publicPath: publicPath
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.join(__dirname, 'src'), 'node_modules']
    },

    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     exclude: [/\.(spec|e2e)\.ts$/],
            //     use: [
            //         'awesome-typescript-loader'
            //     ]
            // },
            {
                test: /\.ts$/,
                exclude: [/\.(spec|e2e)\.ts$/],
                use: [
                    'ts-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader']
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: 'file-loader'
            }
        ]
    },

    plugins: [
        new ForkCheckerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app'].reverse()
        })
    ]
}
