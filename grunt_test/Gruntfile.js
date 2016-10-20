module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});
	grunt.registerTask('default', 'My "default" task description.', function() {
		grunt.log.writeln('Currently running the "default" task.');
		grunt.log.error('This is an error message.');
		return true;
	});
	grunt.registerTask('foo', 'My "foo" task.', function() {
		return true;
	});
	
	grunt.registerTask('bar_true', 'My "bar" task.', function() {
		
		grunt.task.requires('foo');
		var done = this.async();
		setTimeout(function() {
			grunt.log.writeln('Currently running the "bar" task.');
			done();
		}, 1000);
	});
	


	grunt.registerTask('bar_false', 'My "bar" task.', function() {
		var done = this.async();
		setTimeout(function() {
			// Fail asynchronously.
			grunt.log.error('This is an error message.');
			done(false);
		}, 1000);
	});
	// Load the plugin that provides the "uglify" task.
	// Default task(s).
	//  grunt.registerTask('default', ['uglify']);
	
};