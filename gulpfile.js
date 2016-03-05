var karma = require('karma').server;
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
//var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var pipe = require('pipe');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var fs = require('fs');
var jshint = require('gulp-jshint');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var fs = require('fs');
var SshClient = require('ssh2').Client;
var sourceFiles = 'www/.';

gulp.task('compress', function () {
  gulp.src('www/js/*.js')
    .pipe(minify({
      exclude: ['tasks'],
      ignoreFiles: ['.min.js']
    }))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('build', function (done) {
  runSequence('rsync', 'minify-html', 'minify-js-css', 'minifypng', done);
});

gulp.task('rsync', function (done) {
  // http://ss64.com/osx/rsync.html
  var command = 'rsync -rlpt ' + sourceFiles + ' ' + 'dist/.';

  console.log(command);

  sh.exec(command, function () {
    done();
  });
});

gulp.task('minify-html', function () {
  var opts = {
    conditionals: false,
    spare: false
  };

  return gulp.src('./www/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js-css', function () {
  var assets = useref.assets();

  return gulp.src('www/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('minifypng', function(){
  return gulp.src('www/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('local-publish', function (done) {
  var command = 'rsync -rlpt dist/. /Users/admin/desktop/dist/youyan/www/.';
  console.log(command);
  sh.exec(command, function () {
    done();
  });
});

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('test', function () {
  gulp
    .src(['./www/js/**/*.js', '!./www/js/googleAnalytics.js', '!./www/js/demo.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
