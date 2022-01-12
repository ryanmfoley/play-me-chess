const gulp = require('gulp')
const concat = require('gulp-concat')
const minifyCSS = require('gulp-clean-css')
const sass = require('gulp-sass')(require('sass'))

gulp.task('minify-css', () =>
	gulp
		.src('public/scss/*.scss')
		.pipe(sass())
		.pipe(concat('styles.css'))
		.pipe(minifyCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('public/dist/css/'))
)

gulp.task('watch', function () {
	gulp.watch('./public/scss/*.scss', gulp.series('minify-css'))
})

gulp.task('default', gulp.series('minify-css', 'watch'))
