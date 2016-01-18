var         gulp = require('gulp');
var       jshint = require('gulp-jshint');
var       uglify = require('gulp-uglify');
var    minifyCSS = require('gulp-minify-css');
var          del = require('del');
var       concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var         sass = require('gulp-sass');
var  runSequence = require('run-sequence');
var      nodemon = require('gulp-nodemon');

var BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var EXTENSIONS = '{html,ico,txt,jpeg,jpg,png,gif,json,svg}';

////////////////////////////////////////////////////////////////////////////////

gulp.task('clean-dist', function() {
    del(['./dist/*']);
});

gulp.task('scripts', function() {
    gulp.src(['./app/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('styles', function() {
    gulp.src(['./app/css/app.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: BROWSERS }))
    .pipe(minifyCSS({ comments:true, spare:true }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('files', function () {
    gulp.src('./app/**/*.' + EXTENSIONS)
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', function() {

    runSequence(
        'clean-dist',
        'scripts',
        'styles',
        'files'
    );

    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['./**/*']
    });

    gulp.watch(['./app/**/*.' + EXTENSIONS], ['files']);
    gulp.watch(['./app/css/app.scss'], ['styles']);
    gulp.watch(['./app/js/**/*.js'], ['scripts']);

});