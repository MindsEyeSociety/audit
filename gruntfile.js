/**
 * Grunt dev helper and validator.
 * @author Ephraim Gregor
 */

module.exports = grunt => {
	'use strict';

	const appjs = [
		'controllers',
		'helpers',
		'models',
		'migrations',
		'seeds',
		'test',
		'.'
	].map( i => i + '/*.js' );

	grunt.initConfig({
		eslint: {
			target: appjs,
			options: {
				envs: [ 'node' ]
			}
		},
		jscs: {
			all: appjs
		}
	});

	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-eslint' );

	grunt.registerTask( 'default', [ 'eslint', 'jscs' ] );
};
