var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
]; /* an array of sources */

var sassSources = ['components/sass/style.scss'];
/* we only uses style.scss (not the partials) because that is the file that we want compass to look at, not the partials (they are accessed throught the compass process) */
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() { /* the console command to run this task will be gulp js */
  gulp.src(jsSources) /* read the array of sources and place the js text into the script.js file */
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
  /* This next part tells compass how and where to build the css file */
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded' /* like normal css - so you can read it  Use compressed when you're ready to go live */
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  /* Here we check alll .scss files for any updates and run the compass task if necessary */ 
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});
 
gulp.task('connect', function() {
  connect.server({
    root: 'builds/development/',
    livereload: true
  });
});

  gulp.task('html', function() {
    gulp.src(htmlSources)
     .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});
    

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
