var gulp = require('gulp'),
	cordova-builder = require('cordova-gulper'),
	webpack = require('webpack')
	sass = require('gulp-sass');






/*======================================
=            Create Cordova            =
======================================*/
gulp.task('create-index', function() {
return gulp
 .src('render/templates/**/*.html')
 .pipe(fileList('', 'render/template-list.json'))
});


gulp.task('cordova:generate'){
	//run cordova start script
	// add configs to cordova project
	//cordova plugin add org.apache.cordova.device
	//cordova plugin add org.apache.cordova.console
	//cordova platforms add android
}

/*========================================================
=            Create Eletron assets in cordova            =
========================================================*/


