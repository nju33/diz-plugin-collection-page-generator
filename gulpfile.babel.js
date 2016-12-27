import gulp from 'gulp';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

gulp.task('babel', () => {
  gulp.src('lib/**/*.+(js|jsx)')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', err => {
      const {loc, stack} = err;
      util.log(`line: ${loc.line}, col: ${loc.column}, ${stack}`);
    })
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['babel'], () => {
  gulp.watch('lib/**/*.js', ['babel']);
});
