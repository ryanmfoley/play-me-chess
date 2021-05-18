const gulp = require('gulp')
const concat = require('gulp-concat')
const minifyCSS = require('gulp-clean-css')

gulp.task('minify-css', () =>
	gulp
		.src('public/css/*.css')
		.pipe(concat('styles.css'))
		.pipe(minifyCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('public/dist/css/'))
)

gulp.task('watch', function () {
	gulp.watch('./public/css/*.css', gulp.series('minify-css'))
})

gulp.task('default', gulp.series('minify-css', 'watch'))
