var fs          = require('fs-extra');
var gulp        = require('gulp');
var runSequence = require('run-sequence');

/**
 *
 * Clean standalone
 *
 */
gulp.task('clean', function (done) {
    fs.remove('./standalone', done);
});

/**
 *
 * Create a standalone version of pleeease
 * ./standalone/pleeease-<version>.min.js
 *
 */
gulp.task('standalone', ['clean'], function() {
    var fs         = require('fs');
    var source     = require('vinyl-source-stream');
    var uglify     = require('gulp-uglify');
    var streamify  = require('gulp-streamify');
    var browserify = require('browserify');

    var version = JSON.parse(fs.readFileSync('package.json', 'utf-8'))['version'];

    return browserify('./lib/index.js')
          .bundle({standalone: 'pleeease'})
          .pipe(source('pleeease-' + version + '.min.js'))
          .pipe(streamify(uglify()))
          .pipe(gulp.dest('./standalone'));
});

/**
 *
 * Lint JS files
 * lint:lib, lint:tests and lint
 *
 */
gulp.task('lint:lib', function() {
    var jshint = require('gulp-jshint');

    gulp.src(['bin/**/*.js', 'lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('lint:tests', function() {
    var jshint = require('gulp-jshint');

    gulp.src(['spec/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('lint', ['lint:lib', 'lint:tests']);

/**
 *
 * Test spec
 *
 */
gulp.task('test', function () {
    var jasmine = require('gulp-jasmine');

    return gulp.src('spec/*.js')
          .pipe(jasmine());
});

/**
 *
 * Bump version
 * gulp bump --type <patch, minor, major>
 *
 */
gulp.task('_bump', function () {
    var bump = require('gulp-bump');
    var args = require('yargs');

    return gulp.src('package.json')
            .pipe(bump({ type: args.type }))
            .pipe(gulp.dest('./'));

});
gulp.task('bump', function (cb) {

    runSequence('_bump', 'standalone', cb);

});