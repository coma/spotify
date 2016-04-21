import path from 'path';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';
import hot from 'webpack-hot-middleware';
import browser from 'openurl';
import start from '../server';

const src = path.join(process.cwd(), 'src'),
      web = path.join(process.cwd(), 'web');

const config = {
    devtool: 'cheap-module-eval-source-map',
    entry  : {
        app   : ['webpack-hot-middleware/client', src],
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('webpack')
            }
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
                loader : 'style-loader!css-loader'
            }
        ]
    }
};

const compiler = webpack(config);
let first = true;

compiler.plugin('done', () => {if (first) {

    browser.open('http://localhost:5000/login');
    first = false;
}});

start(app => {

    app.use(dev(compiler, {
        noInfo    : true,
        publicPath: config.output.publicPath
    }));

    app.use(hot(compiler));
    app.get('*.js', (req, res) => res.set('Content-Type', 'application/javascript').send(''));
    app.get('*.css', (req, res) => res.set('Content-Type', 'text/css; charset=UTF-8').send(''));
});
