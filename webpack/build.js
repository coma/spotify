import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const src = path.join(process.cwd(), 'src'),
      web = path.join(process.cwd(), 'web');

const config = {
    devtool: 'source-map',
    entry  : {
        app   : src,
        worker: path.join(src, 'worker')
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path      : web,
        filename  : '[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared.js'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings : false,
                screw_ie8: true
            }
        }),
        new ExtractTextPlugin('app.css', {
            allChunks: true
        })
    ],
    module: {
        loaders: [
            {
                test   : /\.jsx?$/,
                loader : 'babel',
                include: src
            },
            {
                test   : /\.css$/,
                loader : ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    }
};

webpack(config, info => console.log(info));
