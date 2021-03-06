var del = require('del');
var path = require('path');
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var symlink = require('gulp-symlink');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var merge = require('merge2');
// var KarmaServer = require('karma').Server;

var tsProject = typescript.createProject('tsconfig.json');

var PATHS = {
	src: {
		ts: ['!src/*.d.ts', 'src/**/*.ts'],
		html: 'src/*.html',
		css: 'src/*.css',
		test: 'test/*.ts',
		typings: 'src/*.d.ts'
	},
	testTypings: [
		'dist/dts/*.d.ts'
	],
};

gulp.task('clean', function (done) {
	return del(['dist'], done);
});

gulp.task('ngc', function(done) {
	exec(path.join("node_modules", ".bin", "ngc") + ' -p tsconfig.aot.json', function (err, stdout, stderr) {
		console.log(stdout);
		console.error(stderr);
		done(err);
	});
});

gulp.task('ts', function () {
	var tsResult = gulp.src(PATHS.src.ts)
		.pipe(sourcemaps.init())
		.pipe(tsProject());

	return merge([
		tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest(path.join('dist', 'js'))),
		tsResult.dts.pipe(gulp.dest(path.join('dist', 'dts')))
	]);
});

gulp.task('test-clean-build', function(done) {
	return del(['test/*.js'], done)
});

gulp.task('test-build', ['test-clean-build'], function () {
	var tsResult = gulp.src([PATHS.src.test, PATHS.src.typings].concat(PATHS.testTypings))
		.pipe(sourcemaps.init())
		.pipe(tsProject());

	return tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('test'));
});

gulp.task('test', ['test-build'], function(done) {
	runSequence('test-link', 'test-run', ['test-link-clean', 'test-clean-build'], done);
});
gulp.task('test-link-clean', function(done) {
	return del(['rxjs'], done);
});
gulp.task('test-link', ['test-link-clean'], function() {
	return gulp.src('node_modules/rxjs/').pipe(symlink('rxjs'));
});
gulp.task('test-run', function(done) {
	new KarmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('test-watch', ['test-build'], function(done) {
	var karma = new KarmaServer({
        configFile: __dirname + '/karma.conf.js'
    }).start();
    gulp.watch([PATHS.src.test], [tasks.testBuild]);
});

gulp.task('html', function () {
	return gulp.src(PATHS.src.html).pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
	return gulp.src(PATHS.src.css).pipe(gulp.dest('dist'));
});

gulp.task('libs', function () {
	return gulp.src('node_modules').pipe(symlink('dist/node_modules', {force: true}));
});

gulp.task('clean', function(done) {
	return del(['dist'], done);
});

gulp.task('build', ['clean'], function() {
	return gulp.start('libs', 'html', 'css', 'ts', 'ngc');
});

gulp.task('build-aot', ['clean'], function() {
	return gulp.start('css', 'ngc');
});

gulp.task('rebuild', ['clean'], function() {
	return gulp.start('build');
});

gulp.task('watch', ['build'], function () {
	gulp.watch(PATHS.src.ts, ['ts']);
	gulp.watch(PATHS.src.html, ['html']);
	gulp.watch(PATHS.src.css, ['css']);
});

gulp.task('default', function() {
	return gulp.start('rebuild');
});
