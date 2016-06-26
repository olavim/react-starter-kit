import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import config from '../config';
import _debug from 'debug';

const debug = _debug('app:webpack:config');
const paths = config.utils_paths;
const {__DEV__, __PROD__} = config.globals;

debug('Create configuration.');
const webpackConfig = {
	name: 'client',
	target: 'web',
	devtool: config.compiler_devtool,
	resolve: {
		root: paths.src(),
		extensions: ['', '.js', '.jsx', '.json']
	},
	module: {}
};

const APP_ENTRY_PATHS = [
	'babel-polyfill',
	paths.src('app.js')
];

webpackConfig.entry = __DEV__
	? APP_ENTRY_PATHS.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
	: APP_ENTRY_PATHS;

webpackConfig.output = {
	filename: `[name].[${config.compiler_hash_type}].js`,
	path: paths.dist(),
	publicPath: config.compiler_public_path
};

webpackConfig.plugins = [
	new webpack.DefinePlugin(config.globals),
	new HtmlWebpackPlugin({
		template: paths.static('index.html'),
		hash: false,
		favicon: paths.static('favicon.ico'),
		filename: 'index.html',
		inject: 'body',
		minify: {
			collapseWhitespace: true
		}
	})
];

if (__DEV__) {
	debug('Enable plugins for live development (HMR, NoErrors).');
	webpackConfig.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	)
} else if (__PROD__) {
	debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
	webpackConfig.plugins.push(
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				unused: true,
				dead_code: true,
				warnings: false
			}
		})
	)
}

webpackConfig.module.loaders = [
	{
		test: /\.jsx?$/,
		exclude: /node_modules/,
		loader: 'babel',
		query: {
			cacheDirectory: true,
			plugins: ['transform-runtime'],
			presets: ['es2015', 'react', 'stage-1'],
			env: {
				production: {
					presets: ['react-optimize']
				}
			}
		}
	}
];

webpackConfig.sassLoader = {
	includePaths: paths.static('styles')
};

webpackConfig.module.loaders.push(
	{ test: /\.svg(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
	{ test: /\.(png|jpg)$/, loader: 'url?limit=8192' }
);

export default webpackConfig