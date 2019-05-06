var path = require("path");
const root = path.join(__dirname);
const src = path.join(root);
const nodeModules = path.join(root, '/node_modules/')


const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./client/main.js']
	},
	resolve: {
	    modules: [
    	  path.resolve('node_modules')
		],
		extensions: ['.mjs', '.scss', '.js', '.svelte', '.html'],
		mainFields: ['svelte', 'browser', 'module', 'main'] //app can use the original component source code, rather than consuming the already-compiled version (which is less efficient).
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.(svelte|html)$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [src, path.join(nodeModules, '@material')],
		        exclude: /node_modules/,
				options: {
					cacheDirectory: true,
				},
			},
			{ test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' } }] },
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
						name: 'bundle.css',
						},
					},
					{ loader: 'extract-loader' },
					{ loader: 'css-loader' },
					{ loader: 'sass-loader',
						options: {
							sourceMap: false,
							includePaths: [src, 'node_modules'],
						},
					},
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	],
	devtool: prod ? false: 'source-map',
	devServer: {
		compress: true,
		disableHostCheck: true,
		headers: { "X-Custom-Header": "yes" },
		proxy: {
		'/api/*': {
			proxyTimeout: 120000,
			target: 'http://localhost:8000/',
			secure: false,
			changeOrigin: false,
			ws: true,
			xfwd: true,
		},
		'/vendor*': {
			proxyTimeout: 120000,
			target: 'http://localhost:8000/',
			secure: false,
			changeOrigin: false,
			ws: true,
			xfwd: true,
		}
		}
	}
};