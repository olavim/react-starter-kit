import _debug from 'debug';
import {argv} from 'yargs';

const debug = _debug('app:config');
debug('Creating default configuration.');

const config = {
	env: process.env.NODE_ENV || 'development',
	dir_client: 'src',
	dir_dist: 'dist',
	server_port: process.env.PORT || 3000
};

config.globals = {
	'__DEV__': config.env === 'development',
	'__PROD__': config.env === 'production',
	'__TEST__': config.env === 'test',
	'__DEBUG__': config.env === 'development' && !argv.no_debug
};

export default config;