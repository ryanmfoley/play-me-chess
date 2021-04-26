const gulp = require('gulp')
const concat = require('gulp-concat')
const minifyJS = require('gulp-uglify')
const minifyCSS = require('gulp-clean-css')

gulp.task('minify-css', () =>
	gulp
		.src('public/css/*.css')
		.pipe(concat('styles.css'))
		.pipe(minifyCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('public/css/'))
)

gulp.task('minify-js', () =>
	gulp
		.src('public/js/*.js')
		.pipe(concat('script.js'))
		.pipe(minifyJS())
		.pipe(gulp.dest('public/js/'))
)

gulp.task('watch', function () {
	gulp.watch('./public/css/*.css', gulp.series('minify-css'))
	gulp.watch('./public/js/*.js', gulp.series('minify-js'))
})

gulp.task('default', gulp.series('minify-css', 'minify-js', 'watch'))
