const gulp = require('gulp')
const concat = require('gulp-concat')
const minifyJS = require('gulp-uglify')
const minifyCSS = require('gulp-clean-css')

gulp.task('minify-css', () =>
	gulp
		.src('public/css/*.css')
		.pipe(concat('styles.css'))
		.pipe(minifyCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('public/dist/css/'))
)

gulp.task('minify-js', () =>
	gulp.src('public/js/*.js').pipe(minifyJS()).pipe(gulp.dest('public/dist/js/'))
)

gulp.task('default', gulp.series('minify-css', 'minify-js'))
