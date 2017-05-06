var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var fs = require('fs');
var WebpackDevServer = require('webpack-dev-server');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.WEBPACK_ENV !== 'pro';
const env = process.env.WEBPAC_ENV;
const imgLimit = 1;
const serverPort = 9100;
const devPort = 9101;
var exec = require('child_process').exec;
console.log("isdebug: " + debug);
console.log("root path: " + path.join(__dirname, "src"));

var entries = getEntry('src/scripts/entries/**/*.js', 'src/scripts/entries/');
console.log(entries);

var chunks = Object.keys(entries);
var config = {
    entry: entries,
    output: {
        path: path.join(__dirname, '..'),
        publicPath: '',
        filename: 'static/scripts/[name].js',
        chunkFilename: 'scripts/[id].chunk.js?[chunkhash]'
    },
    devServer:{
        contentBase: path.join(__dirname, 'src'),
        hot:true,
        inline:true,
    },
    resolve: {
        root: [
            path.join(__dirname, "src")
        ]
    },
    module: {
        loaders: [ //加载器
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css!less')
            }, {
                test: /\.html$/,
                loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
            }, {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=static/fonts/[name].[ext]'
            }, {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=' + imgLimit + '&name=/static/imgs/[name]-[hash].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: 'jquery'
        }),
        new CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: chunks,
            minChunks: chunks.length // 提取所有entry共同依赖的模块
        }),
        new ExtractTextPlugin('/static/styles/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        debug ? function() {} : new UglifyJsPlugin({ //压缩代码
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require'] //排除关键字
        })
    ]
};

var pages = Object.keys(getEntry('src/views/**/*.html', 'src/views/'));
pages.forEach(function(pathname) {
    var conf = {
        filename: 'views/' + pathname + '.html', //生成的html存放路径，相对于path
        template: 'src/views/' + pathname + '.html', //html模板路径
        inject: false,  //js插入的位置，true/'head'/'body'/false
    };
    console.log(pathname);
    if (pathname in config.entry) {
        //conf.favicon = 'src/imgs/favicon.ico';
        conf.inject = 'body';
        conf.chunks = ['vendors', pathname];
        conf.hash = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

if (env === 'dev') {

    for (var i in config.entry) {
        if (config.entry.hasOwnProperty(i)) {
            config.entry[i].unshift('webpack-dev-server/client?http://localhost:' + devPort, "webpack/hot/dev-server")
        }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    var proxy = {
        "*": "http://localhost:" + 9100
    };

    fs.watch('./src/views/', function() {
        exec('webpack --progress --hide-modules', function(err, stdout, stderr) {
            if (err) {
                console.log(stderr);
            } else {
                console.log(stdout);
            }
        });
    });

    //启动服务
    var app = new WebpackDevServer(webpack(config), {
        publicPath: '/static/',
        hot: false,
        proxy: proxy
    });

    app.listen(devPort, function() {
        console.log('dev server on http://0.0.0.0:' + devPort +'\n');
    });

}

function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname,  basename));
        pathDir = path.normalize(pathDir);
        if(pathname.startsWith(pathDir)){
            pathname = pathname.substring(pathDir.length)
        }
        entries[pathname] = ['./' + entry];
    }
    return entries;
}


module.exports = config;
