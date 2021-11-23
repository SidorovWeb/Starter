'use strict'

import { paths } from '../gulpfile.babel'
import gulp from 'gulp'
import gulpif from 'gulp-if'
import rename from 'gulp-rename'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
const sass = gulpSass(dartSass)
import autoprefixer from 'autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import plumber from 'gulp-plumber'
import browsersync from 'browser-sync'
import yargs from 'yargs'

const argv = yargs.argv,
  production = !!argv.production

gulp.task('styles', () => {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(plumber())
    .pipe(sass({ 'include css': true }))
    .pipe(
      postCss([
        autoprefixer({ grid: 'autoplace' }),
        cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }),
      ])
    )
    .pipe(
      gulpif(
        production,
        rename({
          suffix: '.min',
        })
      )
    )
    .pipe(plumber.stop())
    .pipe(gulpif(!production, sourcemaps.write('./maps/')))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browsersync.stream())
})
