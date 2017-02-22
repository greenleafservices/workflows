var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
]; /* an array of sources */

sassSources = ['components/sass/style.scss'];
/* we only uses style.scss (not the partials) because that is the file that we want compass to look at, not the partials (they are accessed throught the compass process) */
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + '/js/*.json'];

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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
  /* This next part tells compass how and where to build the css file */
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + '/images',
      style: sassStyle /* depends on the environment */
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  /* Here we check alll .scss files for any updates and run the compass task if necessary */ 
  gulp.watch('components/sass/*.scss', ['compass']);
    /* Here we check alll .html development files for any updates and run the html task if necessary */ 
  gulp.watch('builds/development/*.html', ['html']);
      /* Here we check alll .json development files for any updates and run the json task if necessary */
  gulp.watch('builds/development/js/*.json', ['json']);
      /* Here we check alll images in the development folder for any updates and run the images task if necessary */
    gulp.watch('builds/development/images/**/*.*', ['images']);
});
 
gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

  gulp.task('html', function() {
      /* Using any HTML files in the development folder, 
      if we're in production environment, minify them and send them to the production folder. Then reload the browser*/
    gulp.src('builds/development/*.html')
      .pipe(gulpif(env === 'production', minifyHTML()))
      .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
      .pipe(connect.reload())
});

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);
