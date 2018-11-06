const gulp = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')

const paths = {
  sass: './sass/**/*.sass',
  sassOut: './css',
  pug: './pug/*.pug',
  pugOut: './'
}

gulp.task('sass', () => {
  return gulp.src(paths.sass)
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(paths.sassOut))
})

gulp.task('pug', () => {
  return gulp.src(paths.pug)
  .pipe(pug())
  .pipe(gulp.dest(paths.pugOut))
})

gulp.task('watch', () => {
  gulp.watch([paths.sass], ['sass'])
  gulp.watch([paths.pug], ['pug'])
})