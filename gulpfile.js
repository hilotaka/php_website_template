//Init
//--------------------------------------------
var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var imagemin  = require('gulp-imagemin');
var uglify         = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

//Image minify
//--------------------------------------------
var imgPaths ={
	  src:  './assets/src/img/',
	  dist: './assets/dist/img/'
	}
gulp.task( 'imagemin', function(){
  var srcGlob = imgPaths.src + '/**/*.+(jpg|jpeg|png|gif|svg)';
  var dstGlob = imgPaths.dist;
  var imageminOptions = {
    optimizationLevel: 7
  };
 
  gulp.src( srcGlob )
    .pipe(imagemin( imageminOptions ))
    .pipe(gulp.dest( dstGlob ));
});

//SASS
//--------------------------------------------
var sassPaths = {
	src: 'assets/src/css/main.scss',
	dist: 'assets/dist/css/'
}
gulp.task("sass",function(){
	gulp.src(sassPaths.src)
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest(sassPaths.dist))
		.pipe(browserSync.stream());
});

//Browser-sync
//--------------------------------------------
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost:8888/"
    });
});

//JS concat
//--------------------------------------------
var jsPaths = {
	src: './assets/src/js/components/*.js',
	filename: 'main.js',
	dist: './assets/dist/js/'
}
gulp.task('scripts', function() {
  return gulp.src(jsPaths.src)
    .pipe(concat(jsPaths.filename))
    .pipe(gulp.dest(jsPaths.dist));
});

//Watch
//--------------------------------------------
var jsWatchPaths = ['assets/src/js/components/*.js'];
var cssWatchPaths = ['assets/src/css/*.scss',
					'assets/src/css/*/*.scss',
					'assets/src/css/*/*.sass'];
var phpWatchPaths = ['*.php', '**/*.php'];

gulp.task("watch",["browser-sync"], function(){
	//変更の可能性のある全てのディレクトリを監視させる
	gulp.watch(jsWatchPaths, ['scripts']);
	gulp.watch(cssWatchPaths, ['sass']);
	//PHPファイルはリロードをかける
	gulp.watch(phpWatchPaths).on('change', function() {
      browserSync.reload()
    });
})

//JS Uglify
//--------------------------------------------
gulp.task('minify-js', function () {
    gulp.src(jsPaths.src)
        .pipe( concat(jsPaths.filename) )
        .pipe( uglify() )
        .pipe( gulp.dest(jsPaths.dist) );
});

//CSS Minify
//--------------------------------------------
gulp.task('minify-css', function() {
    return gulp.src(sassPaths.dist + '*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(sassPaths.dist));
});