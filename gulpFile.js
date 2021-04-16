const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')

gulp.task('minify-css', () => {
	return gulp.src('.public/css/*.css').pipe(cleanCSS()).pipe(gulp.dest('dist'))
})

// We create a 'default' task that will run when we run `gulp` in the project //
gulp.task('default', function () {
	// We use `gulp.watch` for Gulp to expect changes in the files to run again //
	gulp.watch('./public/css/*.css', function (evt) {
		gulp.task('minify-css')
	})
})
