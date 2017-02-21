var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
]; /* an array of sources */
gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});
gulp.task('js', function() { /* the console command to run this task will be gulp js */
  gulp.src(jsSources) /* read the array of sources and place the js text into the script.js file */
    .pipe(concat('script.js'))
    .pipe(gulp.dest('builds/development/js'))
});